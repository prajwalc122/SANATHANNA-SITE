# Security Implementation & Architecture Guide

## 1. Overview of Security Features Implemented

This application has been secured following modern web security standards and the principle of defense-in-depth across the frontend, API, server, and database layers:

### A. HTTP & Network Security
- **HTTP Strict Transport Security (HSTS)**: `max-age=31536000; includeSubDomains; preload` enforces secure HTTPS connections in production.
- **Content Security Policy (CSP)**: Strict resource loading policy allowing only trusted origins:
  - Scripts: `'self'`, `'unsafe-inline'`, `https://checkout.razorpay.com`
  - Styles: `'self'`, `'unsafe-inline'`, `https://fonts.googleapis.com`
  - Fonts: `'self'`, `https://fonts.gstatic.com`, `data:`
  - Images: `'self'`, `data:`, `blob:`, `https:`
  - Frame & Ancestor Control: Restricts frame embedding to `'self'` and authorized AI Studio/Google Cloud Run preview hosts to prevent clickjacking.
- **MIME Sniffing Protection**: `X-Content-Type-Options: nosniff` stops browsers from MIME-type sniffing.
- **Referrer-Policy**: `strict-origin-when-cross-origin` protects sensitive URL paths from leaking across external origins.
- **Permissions-Policy**: Restricts access to sensitive hardware (`camera=()`, `microphone=()`, `geolocation=()`, while allowing `payment=(self "https://checkout.razorpay.com")`).
- **Server Fingerprint Cloaking**: Express `X-Powered-By` header is disabled to prevent reconnaissance.

### B. Access Control & Administrative Authentication
- **Cryptographic Session Tokens**: Admin authentication utilizes cryptographically secure 256-bit random tokens (`crypto.randomBytes(32)`), signed and stored in memory with automatic sliding expiration (2-hour active TTL).
- **Salted Password Hashing**: Passwords are never stored in plaintext. They are salted with a 16-byte random salt and hashed using HMAC-SHA256 (`crypto.createHmac('sha256', salt)`).
- **Two-Factor Authentication (2FA / Security PIN)**: Optional 6-digit administrative security PIN protection.
- **Automatic Inactivity Timeout**: The admin portal automatically terminates the session after 30 minutes of user inactivity.
- **Protected Administrative Endpoints**: All devotee lists, booking histories, orders, payments, CSV exports, and database sync endpoints require a valid `Authorization: Bearer <token>` header. Unauthenticated requests are rejected with `401 Unauthorized`.

### C. Rate Limiting & Anti-Abuse
- **Per-IP Sliding Window Rate Limiting**:
  - **Auth Limiter**: Max 5 failed login attempts per 15-minute window; automatically locks out the offending IP with a `429 Too Many Requests` response and a `Retry-After` header.
  - **Forms Limiter**: Max 25 submissions per 15-minute window for bookings, orders, and contact inquiries to prevent bot spamming and database flooding.
  - **Global API Limiter**: Max 200 requests per 15-minute window.
- **Payload Size Clamping**: JSON body parser strictly capped at `100kb` to prevent memory exhaustion DoS attacks.

### D. Input Sanitization & Anti-Spam
- **Server-Side Sanitization**: All user inputs (names, phones, locations, sankalpa notes, inquiries) are stripped of HTML/script tags and control characters before storage.
- **Phone Number Validation**: Server-side validation enforces 10 to 15 digit telephone formats.
- **Anti-Bot Honeypots**: Hidden form fields (`hp_field`) on booking and contact forms silently trap automated spam bots.
- **NoSQL / Parameter Injection Prevention**: MongoDB query parameters are strictly cast and sanitized to prevent operator injection (`$gt`, `$ne`, `$where`, etc.).

### E. Devotee Privacy
- **Isolated Order History**: Devotees can only access their own orders and tracking codes locally; they cannot browse or query other families' records.
- **Directory Privacy**: Devotee names, phone numbers, addresses, and Gotras are restricted strictly to authorized temple administrators.
- **Integrated Privacy Policy & Terms of Service**: Direct links provided in the site footer explaining data minimization, payment security, and sacred service agreements.

---

## 2. Environment Variables & Secrets Configuration

Configure the following environment variables in your deployment environment (e.g. Cloud Run, Vercel, Railway, or VPS `.env`):

| Variable | Description | Recommended Production Setting |
| :--- | :--- | :--- |
| `ADMIN_USERNAME` | Username for the Admin Portal | Set to a custom private username (e.g. `purohit_admin_2026`) |
| `ADMIN_PASSWORD` | Password for the Admin Portal | Strong passphrase with 12+ characters, symbols, and numbers |
| `ADMIN_JWT_SECRET` | Secret key for signing admin session tokens | Random 64-character hex string (e.g. `openssl rand -hex 32`) |
| `ADMIN_2FA_PIN` | Optional 6-digit PIN for Two-Factor Authentication | 6-digit numeric code (e.g. `789123`) |
| `MONGODB_URI` | Connection URI for MongoDB Atlas (Optional) | `mongodb+srv://<user>:<password>@cluster.mongodb.net/pavitram_pooja_db?retryWrites=true&w=majority` |
| `GEMINI_API_KEY` | Injected automatically by AI Studio if AI features are enabled | Keep in user secrets (never commit to git) |
| `APP_URL` | Base public URL of the application | e.g. `https://poojaseve.example.com` |
| `PORT` | Listening port for Express backend | Default `3000` |

---

## 3. Supabase Row Level Security (RLS) Policies

If you migrate data storage from local JSON / MongoDB to a PostgreSQL database such as **Supabase**, run the following SQL schema and RLS policies in your Supabase SQL Editor:

```sql
-- 1. Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 2. Devotees: Can insert their own bookings, but cannot view other devotees' bookings
CREATE POLICY "Public can submit booking"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' = 'admin@poojaseve.org');

CREATE POLICY "Admin can update or delete bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- 3. Orders: Devotees can insert orders
CREATE POLICY "Public can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- 4. Clients Directory: Strictly restricted to Temple Admin
CREATE POLICY "Admin full access to clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- 5. Payments: Public can log completed payments; Only Admin can view all payments
CREATE POLICY "Public can record verified payment"
  ON payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- 6. Inquiries (Contact Form): Public can insert; Admin can view
CREATE POLICY "Public can submit inquiries"
  ON inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 4. Backend Endpoints & Server Functions Created

| Endpoint | Method | Access Level | Protections Applied |
| :--- | :---: | :---: | :--- |
| `/api/auth/login` | `POST` | Public | Rate-limited (5 tries/15 min), brute-force lockout, timing-safe password comparison, 2FA validation |
| `/api/auth/verify` | `GET` | Authenticated | Token validity & expiry check, sliding expiration refresh |
| `/api/auth/logout` | `POST` | Authenticated | Token revocation |
| `/api/auth/change-password` | `POST` | Authenticated | Current password verification, min 8-char validation, salted HMAC-SHA256 update |
| `/api/auth/toggle-2fa` | `POST` | Authenticated | 6-digit PIN configuration update |
| `/api/contact` | `POST` | Public | Rate-limited (25 submissions/15 min), honeypot verification, input sanitization |
| `/api/bookings` | `POST` | Public | Rate-limited, honeypot verification, phone/date validation, input sanitization |
| `/api/bookings` | `GET` | **Admin Only** | Requires Bearer token; prevents public inspection of devotee rituals |
| `/api/bookings/:id/status` | `PATCH`| **Admin Only** | Requires Bearer token; updates status or assigned purohit |
| `/api/orders` | `POST` | Public | Rate-limited, item verification, amount sanity checks |
| `/api/orders` | `GET` | **Admin Only** | Requires Bearer token; prevents competitor/unauthorized order inspection |
| `/api/clients` | `GET` | **Admin Only** | Requires Bearer token; search & city filter sanitization |
| `/api/clients/:id` | `GET` | **Admin Only** | Requires Bearer token; customer history protection |
| `/api/clients` | `POST` | **Admin Only** | Requires Bearer token; validates phone & devotee name |
| `/api/clients/:id` | `PUT` | **Admin Only** | Requires Bearer token; updates record securely |
| `/api/clients/:id` | `DELETE`| **Admin Only** | Requires Bearer token; prevents unauthorized deletion |
| `/api/export/clients.csv` | `GET`| **Admin Only** | Requires Bearer token; CSV injection sanitization, `Cache-Control: no-store` |
| `/api/payments/create-order`| `POST`| Public | Amount validation (1 - 1,000,000 INR), rate-limited |
| `/api/payments/verify` | `POST` | Public | Transaction ID validation, sanitized settlement recording |
| `/api/payments` | `GET` | **Admin Only** | Requires Bearer token |
| `/api/database/status` | `GET` | **Admin Only** | Requires Bearer token |
| `/api/database/connect` | `POST` | **Admin Only** | Scheme verification (`mongodb://` or `mongodb+srv://` only) |
| `/api/database/sync` | `POST` | **Admin Only** | Requires Bearer token |

---

## 5. Deployment & Security Steps to Complete

Before going live in production:

1. **Set Environment Variables**:
   - Set `ADMIN_PASSWORD` to a unique, strong password.
   - Set `ADMIN_JWT_SECRET` to a high-entropy string (e.g., `openssl rand -hex 32`).
   - If using MongoDB Atlas, configure `MONGODB_URI` and restrict Atlas Network Access IP Whitelist to your hosting provider's egress IPs.
2. **Enable HTTPS / SSL Certificate**:
   - Ensure your domain is behind TLS/HTTPS (Cloud Run, Cloudflare, Let's Encrypt, or AWS ACM). The app will automatically emit the `Strict-Transport-Security` header.
3. **Razorpay Live Credentials**:
   - Replace the default test Razorpay Key ID in the Admin Settings with your live production Key ID (`rzp_live_...`).
   - Keep your Razorpay Key Secret server-side only in environment variables; never paste Key Secrets into client-side code.
4. **Git Repository Verification**:
   - Confirm `.env`, `data/admin-config.json`, and certificate files (`*.pem`, `*.key`) are excluded by `.gitignore` (already configured in `.gitignore`).
5. **Periodic Backups**:
   - Set up scheduled backups for `data/` or your cloud database.

---

## 6. What Cannot Be Secured by Frontend-Only HTML/CSS/JS

It is a fundamental principle of web engineering that **client-side code cannot be trusted**:

1. **Secret Keys & API Secrets**: Any key present in HTML or client JavaScript (such as Razorpay Key Secret, database root passwords, or private WhatsApp API bearer tokens) can be inspected by anyone using browser developer tools. These **must always remain on the server**.
2. **Access Control & Authorization**: Hiding an "Admin" button with CSS (`display: none`) or JavaScript logic does not secure data. Anyone can execute `fetch('/api/clients')` in the browser console. Security must be enforced on the server via `requireAdminAuth` checking cryptographic session tokens.
3. **Database Rules & Row-Level Security**: You cannot enforce data access rules in React components. If a database API key allows reads, an attacker can bypass React entirely and fetch the whole database. Row-Level Security (RLS) or server-side endpoint isolation is mandatory.
4. **Rate Limiting & Anti-Brute Force**: A malicious user can bypass frontend rate-limit timers by disabling JavaScript or calling endpoints directly with `curl` or automated scripts. Rate limiting must be enforced by the server or an edge reverse proxy (e.g., Cloudflare / Nginx).
5. **Input Validation**: Frontend validation provides user-friendly UX feedback, but an attacker can send raw POST requests with arbitrary payloads. The server must validate and sanitize every field independently.
