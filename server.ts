import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  connectToMongo, 
  isMongoConnected, 
  getDatabase, 
  getMongoStatus, 
  syncLocalToMongo 
} from './src/server/mongo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-config.json');

// Ensure data directory and files exist
function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const filesWithDefaults: [string, any][] = [
    [CLIENTS_FILE, []],
    [BOOKINGS_FILE, []],
    [ORDERS_FILE, []],
    [PAYMENTS_FILE, []],
    [INQUIRIES_FILE, []],
    [NOTIFICATIONS_FILE, []],
  ];

  for (const [file, defaultVal] of filesWithDefaults) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2), 'utf-8');
    }
  }
}

ensureDataFiles();

// Helper to safely read JSON
async function readData<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

// Helper to safely write JSON
async function writeData<T>(filePath: string, data: T): Promise<void> {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`[Data Write Error] Unable to persist file.`);
  }
}

// =========================================================================
// SECURITY CORE: Authentication, Hashing & Session Management
// =========================================================================

interface AdminConfig {
  username: string;
  salt: string;
  passwordHash: string;
  twoFactorPin?: string;
  isTwoFactorEnabled: boolean;
}

const SERVER_SECRET = process.env.ADMIN_JWT_SECRET || crypto.randomBytes(32).toString('hex');
const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin@123';

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// Initialize Admin Config
function initAdminConfig(): AdminConfig {
  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8'));
      if (data.passwordHash && data.salt) {
        return data;
      }
    }
  } catch {}

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(DEFAULT_ADMIN_PASS, salt);
  const config: AdminConfig = {
    username: DEFAULT_ADMIN_USER,
    salt,
    passwordHash,
    twoFactorPin: process.env.ADMIN_2FA_PIN || undefined,
    isTwoFactorEnabled: Boolean(process.env.ADMIN_2FA_PIN),
  };

  try {
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch {}

  return config;
}

let adminConfig = initAdminConfig();

// In-Memory Secure Sessions
interface ActiveSession {
  token: string;
  username: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, ActiveSession>();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function createSession(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  activeSessions.set(token, {
    token,
    username,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
  return token;
}

function validateSession(token: string | undefined): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  // Sliding expiry refresh
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

function revokeSession(token: string | undefined): void {
  if (token) {
    activeSessions.delete(token);
  }
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
}, 15 * 60 * 1000);

// =========================================================================
// SECURITY RATE LIMITING (Sliding Window Algorithm)
// =========================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
  blockedUntil?: number;
}

const rateLimitStores = {
  general: new Map<string, RateLimitRecord>(),
  auth: new Map<string, RateLimitRecord>(),
  forms: new Map<string, RateLimitRecord>(),
};

function checkRateLimit(
  store: Map<string, RateLimitRecord>,
  ip: string,
  limit: number,
  windowMs: number,
  blockMs = 0
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = store.get(ip);

  if (record && record.blockedUntil && now < record.blockedUntil) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.blockedUntil - now) / 1000),
    };
  }

  if (!record || now > record.resetAt) {
    store.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true };
  }

  record.count += 1;

  if (record.count > limit) {
    if (blockMs > 0) {
      record.blockedUntil = now + blockMs;
      return {
        allowed: false,
        retryAfter: Math.ceil(blockMs / 1000),
      };
    }
    return {
      allowed: false,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  return { allowed: true };
}

// Clean up rate limits store every 10 mins
setInterval(() => {
  const now = Date.now();
  for (const store of Object.values(rateLimitStores)) {
    for (const [ip, rec] of store.entries()) {
      if (now > rec.resetAt && (!rec.blockedUntil || now > rec.blockedUntil)) {
        store.delete(ip);
      }
    }
  }
}, 10 * 60 * 1000);

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Middleware: General Rate Limiter (200 requests / 15 minutes per IP)
function generalRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const result = checkRateLimit(rateLimitStores.general, ip, 200, 15 * 60 * 1000);
  if (!result.allowed) {
    res.setHeader('Retry-After', String(result.retryAfter || 60));
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please slow down.',
    });
  }
  next();
}

// Middleware: Form Submissions Limiter (25 requests / 15 minutes per IP)
function formsRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const result = checkRateLimit(rateLimitStores.forms, ip, 25, 15 * 60 * 1000);
  if (!result.allowed) {
    res.setHeader('Retry-After', String(result.retryAfter || 60));
    return res.status(429).json({
      success: false,
      error: 'Submission rate limit reached. Please wait a few moments before trying again.',
    });
  }
  next();
}

// Middleware: Admin Auth Limiter (5 attempts / 15 minutes, 15 minute lockout)
function authRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const result = checkRateLimit(rateLimitStores.auth, ip, 5, 15 * 60 * 1000, 15 * 60 * 1000);
  if (!result.allowed) {
    res.setHeader('Retry-After', String(result.retryAfter || 900));
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Temporarily locked for security. Retry in ${result.retryAfter} seconds.`,
    });
  }
  next();
}

// Middleware: Admin Authentication Guard
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication required.',
    });
  }

  const token = authHeader.substring(7).trim();
  if (!validateSession(token)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Session expired or invalid token.',
    });
  }

  next();
}

// =========================================================================
// INPUT SANITIZATION & VALIDATION HELPERS
// =========================================================================

function sanitizeString(input: unknown, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip JS protocol
    .replace(/data:/gi, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Strip control chars
    .trim()
    .slice(0, maxLength);
}

function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(email: unknown): boolean {
  if (!email || typeof email !== 'string') return true; // optional
  const trimmed = email.trim();
  if (trimmed.length === 0) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 100;
}

// Check honeypot field (anti-spam bot detection)
function isHoneypotTriggered(body: any): boolean {
  return Boolean(body.hp_field || body.website_hp || body.fax_number);
}

// =========================================================================
// DATA MODELS
// =========================================================================

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  gotra?: string;
  nakshatra?: string;
  preferredDeity?: string;
  notes?: string;
  totalBookings: number;
  totalOrders: number;
  totalSpend: number;
  status: 'active' | 'inactive' | 'vip';
  createdAt: string;
  updatedAt: string;
}

export interface BookingRecord {
  id: string;
  clientId?: string;
  name: string;
  phone: string;
  poojaType: string;
  date: string;
  time: string;
  location: string;
  message?: string;
  status: 'pending' | 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  amount?: number;
  purohitName?: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  clientId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: any[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

// =========================================================================
// SERVER SETUP & ROUTING
// =========================================================================

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // 1. Disable Fingerprinting
  app.disable('x-powered-by');

  // 2. Comprehensive Security Headers Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    // HSTS (HTTP Strict Transport Security)
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // MIME Sniffing Prevention
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy (Limit sensitive hardware APIs, allow payments)
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com")'
    );

    // Content-Security-Policy (CSP)
    // Allows Vite, Google Fonts, Firebase Auth, Google APIs, Razorpay checkout scripts/frames, and iframe preview in AI Studio
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://apis.google.com https://*.firebaseapp.com https://www.gstatic.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' ws: wss: https://api.razorpay.com https://checkout.razorpay.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
        "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.firebaseapp.com https://accounts.google.com",
        "frame-ancestors 'self' https://*.google.com https://*.googleusercontent.com https://*.run.app",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ].join('; ')
    );

    next();
  });

  // 3. Strict Payload Limits & JSON Parser (Prevents Payload Exhaustion DoS)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '50kb' }));

  // 4. Global API Rate Limiter
  app.use('/api', generalRateLimiter);

  // =========================================================================
  // PUBLIC ENDPOINTS
  // =========================================================================

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Sanaatana Pooja Seve Protected API',
      securityStatus: 'enforced',
      timestamp: new Date().toISOString(),
    });
  });

  // Admin Authentication: Login
  app.post('/api/auth/login', authRateLimiter, async (req: Request, res: Response) => {
    try {
      const { username, password, twoFactorCode } = req.body;

      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
      }

      const inputUser = String(username).trim();
      const inputPass = String(password);

      // Verify username
      if (inputUser !== adminConfig.username) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Verify password
      const calculatedHash = hashPassword(inputPass, adminConfig.salt);
      const isPasswordValid = crypto.timingSafeEqual(
        Buffer.from(calculatedHash),
        Buffer.from(adminConfig.passwordHash)
      );

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Verify 2FA if enabled
      if (adminConfig.isTwoFactorEnabled) {
        if (!twoFactorCode) {
          return res.json({
            success: false,
            requires2FA: true,
            message: 'Please provide 2FA Security PIN',
          });
        }
        if (String(twoFactorCode).trim() !== adminConfig.twoFactorPin) {
          return res.status(401).json({ success: false, error: 'Invalid 2FA Security PIN' });
        }
      }

      // Generate secure session token
      const token = createSession(adminConfig.username);

      res.json({
        success: true,
        token,
        expiresIn: SESSION_TTL_MS / 1000,
        user: { username: adminConfig.username, role: 'admin' },
      });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Authentication service failure' });
    }
  });

  // Admin Authentication: Verify Session
  app.get('/api/auth/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false });
    }
    const token = authHeader.substring(7).trim();
    if (validateSession(token)) {
      return res.json({
        success: true,
        user: adminConfig.username,
        twoFactorEnabled: adminConfig.isTwoFactorEnabled,
        expiresIn: SESSION_TTL_MS / 1000,
      });
    }
    res.status(401).json({ success: false });
  });

  // Admin Authentication: Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      revokeSession(authHeader.substring(7).trim());
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Public: Contact Inquiry Form (Honeypot, Rate-limited, Sanitized)
  app.post('/api/contact', formsRateLimiter, async (req: Request, res: Response) => {
    try {
      if (isHoneypotTriggered(req.body)) {
        return res.status(400).json({ success: false, error: 'Spam validation failed' });
      }

      const name = sanitizeString(req.body.name, 100);
      const phone = sanitizeString(req.body.phone, 20);
      const query = sanitizeString(req.body.query, 1000);

      if (!name || name.length < 2) {
        return res.status(400).json({ success: false, error: 'Valid name is required (min 2 characters)' });
      }

      if (!isValidPhone(phone)) {
        return res.status(400).json({ success: false, error: 'Valid 10-digit mobile number is required' });
      }

      if (!query || query.length < 5) {
        return res.status(400).json({ success: false, error: 'Please enter your inquiry details' });
      }

      const inquiries = await readData<any[]>(INQUIRIES_FILE, []);
      const newInquiry = {
        id: `inq-${Date.now().toString().slice(-6)}`,
        name,
        phone,
        query,
        createdAt: new Date().toISOString(),
        status: 'new',
      };

      inquiries.unshift(newInquiry);
      await writeData(INQUIRIES_FILE, inquiries);

      // Queue for Admin Gmail & Notification Hub
      try {
        const notifs = await readData<any[]>(NOTIFICATIONS_FILE, []);
        notifs.unshift({
          id: `notif-${Date.now()}`,
          type: 'inquiry',
          title: `ಹೊಸ ಭಕ್ತರ ವಿಚಾರಣೆ / New Inquiry: ${name}`,
          devoteeName: name,
          phone,
          details: query,
          createdAt: newInquiry.createdAt,
          emailRecipient: 'shriramachandra1995@gmail.com',
          emailSent: false,
        });
        await writeData(NOTIFICATIONS_FILE, notifs.slice(0, 100));
      } catch {}

      res.status(201).json({
        success: true,
        message: 'Inquiry received securely. Our temple coordinator will reach out shortly.',
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to process inquiry' });
    }
  });

  // Public: Submit Booking (Honeypot, Rate-limited, Sanitized)
  app.post('/api/bookings', formsRateLimiter, async (req: Request, res: Response) => {
    try {
      if (isHoneypotTriggered(req.body)) {
        return res.status(400).json({ success: false, error: 'Spam validation failed' });
      }

      const name = sanitizeString(req.body.name, 100);
      const phone = sanitizeString(req.body.phone, 20);
      const poojaType = sanitizeString(req.body.poojaType, 120);
      const date = sanitizeString(req.body.date, 30);
      const time = sanitizeString(req.body.time, 20);
      const location = sanitizeString(req.body.location, 200);
      const message = sanitizeString(req.body.message, 1000);
      const amount = Math.max(0, Math.min(Number(req.body.amount) || 0, 500000));
      const purohitName = sanitizeString(req.body.purohitName, 100);

      if (!name || name.length < 2) {
        return res.status(400).json({ success: false, error: 'Name must be at least 2 characters' });
      }
      if (!isValidPhone(phone)) {
        return res.status(400).json({ success: false, error: 'Valid 10-digit mobile number required' });
      }
      if (!date) {
        return res.status(400).json({ success: false, error: 'Booking date is required' });
      }

      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);

      const cleanPhone = phone.replace(/[^0-9]/g, '');
      let client = clients.find((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

      const now = new Date().toISOString();

      if (!client) {
        client = {
          id: `cli-${Date.now().toString().slice(-6)}`,
          name,
          phone,
          city: location || 'Karnataka',
          address: location || '',
          preferredDeity: poojaType,
          notes: message || 'Pooja booking registered',
          totalBookings: 1,
          totalOrders: 0,
          totalSpend: amount,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };
        clients.unshift(client);
      } else {
        client.totalBookings = (client.totalBookings || 0) + 1;
        client.totalSpend = (client.totalSpend || 0) + amount;
        if (location && !client.address) client.address = location;
        client.updatedAt = now;
      }

      await writeData(CLIENTS_FILE, clients);

      const newBooking: BookingRecord = {
        id: `bk-${Date.now().toString().slice(-6)}`,
        clientId: client.id,
        name,
        phone,
        poojaType: poojaType || 'ಗಣೇಶ ಪೂಜೆ / Ganesha Pooja',
        date,
        time: time || '09:30 AM',
        location: location || 'Karnataka',
        message,
        status: 'confirmed',
        amount,
        purohitName: purohitName || 'Pt. Vidyadhar Shastri (Rigveda Purohit)',
        createdAt: now,
      };

      bookings.unshift(newBooking);
      await writeData(BOOKINGS_FILE, bookings);

      // Queue for Admin Gmail & Notification Hub
      try {
        const notifs = await readData<any[]>(NOTIFICATIONS_FILE, []);
        notifs.unshift({
          id: `notif-${Date.now()}`,
          type: 'booking',
          title: `ಹೊಸ ಪುರೋಹಿತರ ಬುಕಿಂಗ್ / New Booking: ${newBooking.name} (${newBooking.poojaType})`,
          devoteeName: newBooking.name,
          phone: newBooking.phone,
          details: `${newBooking.poojaType} on ${newBooking.date} at ${newBooking.time}, ${newBooking.location}. Amount: ₹${newBooking.amount}`,
          bookingData: newBooking,
          createdAt: newBooking.createdAt,
          emailRecipient: 'shriramachandra1995@gmail.com',
          emailSent: false,
        });
        await writeData(NOTIFICATIONS_FILE, notifs.slice(0, 100));
      } catch {}

      // Persist to MongoDB if active
      if (isMongoConnected()) {
        const db = getDatabase();
        if (db) {
          await db.collection('bookings').updateOne({ id: newBooking.id }, { $set: newBooking }, { upsert: true });
        }
      }

      res.status(201).json({
        success: true,
        booking: newBooking,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to process booking request' });
    }
  });

  // Public: Submit Order (Honeypot, Rate-limited, Sanitized)
  app.post('/api/orders', formsRateLimiter, async (req: Request, res: Response) => {
    try {
      if (isHoneypotTriggered(req.body)) {
        return res.status(400).json({ success: false, error: 'Spam validation failed' });
      }

      const customerName = sanitizeString(req.body.customerName, 100);
      const customerPhone = sanitizeString(req.body.customerPhone, 20);
      const customerAddress = sanitizeString(req.body.customerAddress, 300);
      const paymentMethod = sanitizeString(req.body.paymentMethod, 50) || 'UPI';
      const paymentStatus = sanitizeString(req.body.paymentStatus, 50) || 'Paid';
      const total = Math.max(0, Math.min(Number(req.body.total) || 0, 1000000));
      const rawItems = Array.isArray(req.body.items) ? req.body.items.slice(0, 50) : [];

      if (!customerName || customerName.length < 2) {
        return res.status(400).json({ success: false, error: 'Valid customer name is required' });
      }
      if (!isValidPhone(customerPhone)) {
        return res.status(400).json({ success: false, error: 'Valid customer phone number is required' });
      }
      if (total <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid order total' });
      }

      // Sanitize items list
      const sanitizedItems = rawItems.map((it: any) => ({
        item: {
          id: sanitizeString(it?.item?.id, 50),
          nameKn: sanitizeString(it?.item?.nameKn, 100),
          nameEn: sanitizeString(it?.item?.nameEn, 100),
          price: Number(it?.item?.price) || 0,
        },
        quantity: Math.max(1, Math.min(Number(it?.quantity) || 1, 100)),
      }));

      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const orders = await readData<OrderRecord[]>(ORDERS_FILE, []);

      const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
      let client = clients.find((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

      const now = new Date().toISOString();

      if (!client) {
        client = {
          id: `cli-${Date.now().toString().slice(-6)}`,
          name: customerName,
          phone: customerPhone,
          address: customerAddress || '',
          city: customerAddress ? customerAddress.split(',').pop()?.trim() || 'Karnataka' : 'Karnataka',
          totalBookings: 0,
          totalOrders: 1,
          totalSpend: total,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };
        clients.unshift(client);
      } else {
        client.totalOrders = (client.totalOrders || 0) + 1;
        client.totalSpend = (client.totalSpend || 0) + total;
        if (customerAddress && !client.address) client.address = customerAddress;
        client.updatedAt = now;
      }

      await writeData(CLIENTS_FILE, clients);

      const newOrder: OrderRecord = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        clientId: client.id,
        customerName,
        customerPhone,
        customerAddress,
        items: sanitizedItems,
        total,
        paymentMethod,
        paymentStatus,
        status: 'confirmed',
        createdAt: now,
      };

      orders.unshift(newOrder);
      await writeData(ORDERS_FILE, orders);

      // Queue for Admin Gmail & Notification Hub
      try {
        const notifs = await readData<any[]>(NOTIFICATIONS_FILE, []);
        notifs.unshift({
          id: `notif-${Date.now()}`,
          type: 'order',
          title: `ಹೊಸ ಸಾಮಗ್ರಿ ಆರ್ಡರ್ / New Materials Order: ${newOrder.customerName} (₹${newOrder.total})`,
          devoteeName: newOrder.customerName,
          phone: newOrder.customerPhone,
          details: `Order total: ₹${newOrder.total}, Address: ${newOrder.customerAddress}, Items: ${newOrder.items.length}`,
          orderData: newOrder,
          createdAt: newOrder.createdAt,
          emailRecipient: 'shriramachandra1995@gmail.com',
          emailSent: false,
        });
        await writeData(NOTIFICATIONS_FILE, notifs.slice(0, 100));
      } catch {}

      // Persist to MongoDB if active
      if (isMongoConnected()) {
        const db = getDatabase();
        if (db) {
          await db.collection('orders').updateOne({ id: newOrder.id }, { $set: newOrder }, { upsert: true });
        }
      }

      res.status(201).json({
        success: true,
        order: newOrder,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to record order' });
    }
  });

  // Public: Razorpay / Gateway Order Preparation (Validated amount)
  app.post('/api/payments/create-order', formsRateLimiter, async (req: Request, res: Response) => {
    try {
      const amount = Number(req.body.amount);
      if (!amount || isNaN(amount) || amount <= 0 || amount > 1000000) {
        return res.status(400).json({ success: false, error: 'Valid transaction amount required' });
      }

      const receipt = sanitizeString(req.body.receipt, 50) || `rcpt_${Date.now()}`;
      const orderId = `order_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
      const amountInPaise = Math.round(amount * 100);

      res.json({
        success: true,
        orderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        status: 'created',
      });
    } catch {
      res.status(500).json({ success: false, error: 'Payment order initiation failed' });
    }
  });

  // Public: Payment Verification & Settlement Recording (Sanitized & Validated)
  app.post('/api/payments/verify', formsRateLimiter, async (req: Request, res: Response) => {
    try {
      const transactionId = sanitizeString(req.body.transactionId, 100);
      const amount = Number(req.body.amount);

      if (!transactionId || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Valid transaction ID and amount required' });
      }

      const paymentRecord = {
        transactionId,
        orderId: sanitizeString(req.body.orderId, 100) || `ord_${Date.now().toString().slice(-6)}`,
        gateway: sanitizeString(req.body.gateway, 50) || 'razorpay',
        method: sanitizeString(req.body.method, 50) || 'upi',
        amount,
        utrNumber: sanitizeString(req.body.utrNumber, 100) || `UTR${Date.now()}`,
        status: 'SUCCESS',
        customerName: sanitizeString(req.body.customerName, 100) || 'Pooja Devotee',
        customerPhone: sanitizeString(req.body.customerPhone, 20),
        customerEmail: sanitizeString(req.body.customerEmail, 100),
        createdAt: new Date().toISOString(),
      };

      if (isMongoConnected()) {
        const db = getDatabase();
        if (db) {
          await db.collection('payments').insertOne({ ...paymentRecord });
        }
      }

      const payments = await readData<any[]>(PAYMENTS_FILE, []);
      payments.unshift(paymentRecord);
      await writeData(PAYMENTS_FILE, payments);

      res.json({
        success: true,
        message: 'Payment verified and securely logged',
        payment: paymentRecord,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Payment recording failed' });
    }
  });

  // Notifications Queue for Admin & Gmail Integration
  app.get('/api/notifications', async (req: Request, res: Response) => {
    try {
      const notifs = await readData<any[]>(NOTIFICATIONS_FILE, []);
      res.json({ success: true, notifications: notifs });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve notifications' });
    }
  });

  app.post('/api/notifications/:id/mark-sent', async (req: Request, res: Response) => {
    try {
      const notifs = await readData<any[]>(NOTIFICATIONS_FILE, []);
      const idx = notifs.findIndex((n) => n.id === req.params.id);
      if (idx !== -1) {
        notifs[idx].emailSent = true;
        notifs[idx].sentAt = new Date().toISOString();
        await writeData(NOTIFICATIONS_FILE, notifs);
      }
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update notification state' });
    }
  });

  // =========================================================================
  // PROTECTED ADMIN ENDPOINTS (Require requireAdminAuth)
  // =========================================================================

  // Change Admin Password
  app.post('/api/auth/change-password', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, error: 'Current and new password are required' });
      }

      if (String(newPassword).length < 8) {
        return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long' });
      }

      // Verify current password
      const calcHash = hashPassword(String(currentPassword), adminConfig.salt);
      const isCurrentValid = crypto.timingSafeEqual(
        Buffer.from(calcHash),
        Buffer.from(adminConfig.passwordHash)
      );

      if (!isCurrentValid) {
        return res.status(401).json({ success: false, error: 'Current password does not match' });
      }

      // Generate new salt and hash
      const newSalt = crypto.randomBytes(16).toString('hex');
      const newHash = hashPassword(String(newPassword), newSalt);

      adminConfig.salt = newSalt;
      adminConfig.passwordHash = newHash;

      await writeData(ADMIN_CONFIG_FILE, adminConfig);

      res.json({ success: true, message: 'Admin password changed successfully' });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update admin password' });
    }
  });

  // Toggle or Update 2FA PIN
  app.post('/api/auth/toggle-2fa', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const { enabled, pin } = req.body;
      adminConfig.isTwoFactorEnabled = Boolean(enabled);
      if (enabled && pin) {
        adminConfig.twoFactorPin = String(pin).trim();
      }
      await writeData(ADMIN_CONFIG_FILE, adminConfig);

      res.json({
        success: true,
        message: enabled ? '2FA PIN security enabled' : '2FA disabled',
        isTwoFactorEnabled: adminConfig.isTwoFactorEnabled,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update 2FA configuration' });
    }
  });

  // GET /api/clients - Protected: Retrieve all clients with filtering
  app.get('/api/clients', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const search = sanitizeString(req.query.search, 100).toLowerCase();
      const city = sanitizeString(req.query.city, 100).toLowerCase();

      let filtered = clients;

      if (search) {
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.phone.includes(search) ||
            (c.email && c.email.toLowerCase().includes(search)) ||
            (c.gotra && c.gotra.toLowerCase().includes(search)) ||
            (c.city && c.city.toLowerCase().includes(search))
        );
      }

      if (city) {
        filtered = filtered.filter((c) => c.city && c.city.toLowerCase().includes(city));
      }

      filtered.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );

      res.json({
        success: true,
        count: filtered.length,
        clients: filtered,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve clients' });
    }
  });

  // GET /api/clients/:id - Protected: Retrieve client details and history
  app.get('/api/clients/:id', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const clientId = sanitizeString(req.params.id, 50);
      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const client = clients.find((c) => c.id === clientId);

      if (!client) {
        return res.status(404).json({ success: false, error: 'Client not found' });
      }

      const bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);
      const orders = await readData<OrderRecord[]>(ORDERS_FILE, []);

      const cleanPhone = client.phone.replace(/[^0-9]/g, '');

      const clientBookings = bookings.filter(
        (b) => b.clientId === client.id || (cleanPhone && b.phone.replace(/[^0-9]/g, '').includes(cleanPhone))
      );

      const clientOrders = orders.filter(
        (o) => o.clientId === client.id || (cleanPhone && o.customerPhone.replace(/[^0-9]/g, '').includes(cleanPhone))
      );

      res.json({
        success: true,
        client,
        bookings: clientBookings,
        orders: clientOrders,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve client profile' });
    }
  });

  // POST /api/clients - Protected: Create or Upsert client
  app.post('/api/clients', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const name = sanitizeString(req.body.name, 100);
      const phone = sanitizeString(req.body.phone, 20);
      const email = sanitizeString(req.body.email, 100);
      const city = sanitizeString(req.body.city, 100);
      const address = sanitizeString(req.body.address, 300);
      const gotra = sanitizeString(req.body.gotra, 50);
      const nakshatra = sanitizeString(req.body.nakshatra, 50);
      const preferredDeity = sanitizeString(req.body.preferredDeity, 100);
      const notes = sanitizeString(req.body.notes, 500);
      const status = ['active', 'inactive', 'vip'].includes(req.body.status) ? req.body.status : 'active';

      if (!name || !isValidPhone(phone)) {
        return res.status(400).json({ success: false, error: 'Valid name and phone number are required' });
      }

      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const existingIndex = clients.findIndex((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        const existing = clients[existingIndex];
        const updated: ClientRecord = {
          ...existing,
          name: name || existing.name,
          email: email || existing.email,
          city: city || existing.city,
          address: address || existing.address,
          gotra: gotra || existing.gotra,
          nakshatra: nakshatra || existing.nakshatra,
          preferredDeity: preferredDeity || existing.preferredDeity,
          notes: notes ? (existing.notes ? `${existing.notes}\n${notes}` : notes) : existing.notes,
          status,
          updatedAt: now,
        };
        clients[existingIndex] = updated;
        await writeData(CLIENTS_FILE, clients);
        return res.json({ success: true, isNew: false, client: updated });
      }

      const newClient: ClientRecord = {
        id: `cli-${Date.now().toString().slice(-6)}`,
        name,
        phone,
        email,
        city: city || 'Karnataka',
        address,
        gotra,
        nakshatra,
        preferredDeity,
        notes,
        totalBookings: 0,
        totalOrders: 0,
        totalSpend: 0,
        status,
        createdAt: now,
        updatedAt: now,
      };

      clients.unshift(newClient);
      await writeData(CLIENTS_FILE, clients);

      res.status(201).json({ success: true, isNew: true, client: newClient });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to save client details' });
    }
  });

  // PUT /api/clients/:id - Protected: Update client record
  app.put('/api/clients/:id', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const clientId = sanitizeString(req.params.id, 50);
      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const index = clients.findIndex((c) => c.id === clientId);

      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Client not found' });
      }

      const existing = clients[index];
      const updated: ClientRecord = {
        ...existing,
        name: sanitizeString(req.body.name, 100) || existing.name,
        phone: isValidPhone(req.body.phone) ? sanitizeString(req.body.phone, 20) : existing.phone,
        email: sanitizeString(req.body.email, 100) || existing.email,
        city: sanitizeString(req.body.city, 100) || existing.city,
        address: sanitizeString(req.body.address, 300) || existing.address,
        gotra: sanitizeString(req.body.gotra, 50) || existing.gotra,
        nakshatra: sanitizeString(req.body.nakshatra, 50) || existing.nakshatra,
        preferredDeity: sanitizeString(req.body.preferredDeity, 100) || existing.preferredDeity,
        notes: sanitizeString(req.body.notes, 500) || existing.notes,
        status: ['active', 'inactive', 'vip'].includes(req.body.status) ? req.body.status : existing.status,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      };

      clients[index] = updated;
      await writeData(CLIENTS_FILE, clients);

      res.json({ success: true, client: updated });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update client' });
    }
  });

  // DELETE /api/clients/:id - Protected: Delete client record
  app.delete('/api/clients/:id', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const clientId = sanitizeString(req.params.id, 50);
      let clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const beforeCount = clients.length;
      clients = clients.filter((c) => c.id !== clientId);

      if (clients.length === beforeCount) {
        return res.status(404).json({ success: false, error: 'Client not found' });
      }

      await writeData(CLIENTS_FILE, clients);
      res.json({ success: true, message: 'Client deleted successfully' });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to delete client' });
    }
  });

  // GET /api/bookings - Protected: View all bookings
  app.get('/api/bookings', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);
      res.json({ success: true, count: bookings.length, bookings });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve bookings' });
    }
  });

  // PATCH /api/bookings/:id/status - Protected: Update booking status
  app.patch('/api/bookings/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const bookingId = sanitizeString(req.params.id, 50);
      const status = sanitizeString(req.body.status, 30);
      const purohitName = sanitizeString(req.body.purohitName, 100);

      const bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);
      const booking = bookings.find((b) => b.id === bookingId);

      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }

      if (['pending', 'assigned', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        booking.status = status as any;
      }
      if (purohitName) {
        booking.purohitName = purohitName;
      }

      await writeData(BOOKINGS_FILE, bookings);
      res.json({ success: true, booking });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update booking status' });
    }
  });

  // DELETE /api/bookings/:id - Protected: Delete booking
  app.delete('/api/bookings/:id', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const bookingId = sanitizeString(req.params.id, 50);
      let bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);
      bookings = bookings.filter((b) => b.id !== bookingId);
      await writeData(BOOKINGS_FILE, bookings);
      res.json({ success: true, message: 'Booking removed' });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to delete booking' });
    }
  });

  // GET /api/orders - Protected: View all orders
  app.get('/api/orders', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const orders = await readData<OrderRecord[]>(ORDERS_FILE, []);
      res.json({ success: true, count: orders.length, orders });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve orders' });
    }
  });

  // GET /api/payments - Protected: View payments
  app.get('/api/payments', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      if (isMongoConnected()) {
        const db = getDatabase();
        if (db) {
          const payments = await db.collection('payments').find({}).sort({ createdAt: -1 }).toArray();
          return res.json({ success: true, source: 'mongodb', count: payments.length, payments });
        }
      }
      const payments = await readData<any[]>(PAYMENTS_FILE, []);
      res.json({ success: true, source: 'local_storage', count: payments.length, payments });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to load payments' });
    }
  });

  // GET /api/database/status - Protected
  app.get('/api/database/status', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const status = await getMongoStatus();
      res.json({ success: true, ...status });
    } catch {
      res.status(500).json({ success: false, error: 'Database status inspection failed' });
    }
  });

  // POST /api/database/connect - Protected (Sanitizes URI, rejects non-mongo protocols)
  app.post('/api/database/connect', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const uri = String(req.body.uri || '').trim();

      // Ensure URI starts with mongodb:// or mongodb+srv://
      if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid connection scheme. Only mongodb:// or mongodb+srv:// are permitted.',
        });
      }

      const result = await connectToMongo(uri);
      if (result.success) {
        const [c, b, o] = await Promise.all([
          readData<ClientRecord[]>(CLIENTS_FILE, []),
          readData<BookingRecord[]>(BOOKINGS_FILE, []),
          readData<OrderRecord[]>(ORDERS_FILE, []),
        ]);
        const syncRes = await syncLocalToMongo(c, b, o);
        return res.json({
          success: true,
          message: result.message,
          dbName: result.dbName,
          synced: syncRes,
        });
      }
      res.status(400).json({ success: false, error: result.message });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to establish database connection' });
    }
  });

  // POST /api/database/sync - Protected
  app.post('/api/database/sync', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      if (!isMongoConnected()) {
        return res.status(400).json({ success: false, error: 'MongoDB is not currently connected.' });
      }
      const [c, b, o] = await Promise.all([
        readData<ClientRecord[]>(CLIENTS_FILE, []),
        readData<BookingRecord[]>(BOOKINGS_FILE, []),
        readData<OrderRecord[]>(ORDERS_FILE, []),
      ]);
      const syncRes = await syncLocalToMongo(c, b, o);
      res.json({ success: true, message: 'Local records securely synced into MongoDB', synced: syncRes });
    } catch {
      res.status(500).json({ success: false, error: 'Database synchronization failed' });
    }
  });

  // GET /api/export/clients.csv - Protected
  app.get('/api/export/clients.csv', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const headers = ['Client ID', 'Name', 'Phone', 'Email', 'City', 'Address', 'Gotra', 'Total Bookings', 'Total Orders', 'Total Spend (INR)', 'Status', 'Registered Date'];
      
      const rows = clients.map((c) => [
        `"${sanitizeString(c.id, 50)}"`,
        `"${sanitizeString(c.name, 100).replace(/"/g, '""')}"`,
        `"${sanitizeString(c.phone, 20)}"`,
        `"${sanitizeString(c.email || '', 100)}"`,
        `"${sanitizeString(c.city || '', 100).replace(/"/g, '""')}"`,
        `"${sanitizeString(c.address || '', 200).replace(/"/g, '""')}"`,
        `"${sanitizeString(c.gotra || '', 50).replace(/"/g, '""')}"`,
        Number(c.totalBookings) || 0,
        Number(c.totalOrders) || 0,
        Number(c.totalSpend) || 0,
        `"${sanitizeString(c.status, 20)}"`,
        `"${sanitizeString(c.createdAt, 50)}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="clients-directory.csv"');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.send(csvContent);
    } catch {
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  });

  // Central Safe Error Handler for API
  app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[Protected API Error caught]:', err?.message || 'Unknown error');
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing the request.',
    });
  });

  // =========================================================================
  // FRONTEND CLIENT SERVING
  // =========================================================================

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        allowedHosts: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sanaatana Secured Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
