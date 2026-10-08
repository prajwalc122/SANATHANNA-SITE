import { MongoClient } from 'mongodb';
import type { Db, Collection } from 'mongodb';

export interface MongoDatabaseStatus {
  isConnected: boolean;
  uriConfigured: boolean;
  dbName: string;
  counts: {
    clients: number;
    bookings: number;
    orders: number;
    payments: number;
  };
  lastError?: string;
}

let client: MongoClient | null = null;
let db: Db | null = null;
let activeUri: string = process.env.MONGODB_URI || '';
let currentDbName: string = 'pavitram_pooja_db';
let lastConnectionError: string = '';

export async function connectToMongo(uriString?: string): Promise<{ success: boolean; message: string; dbName?: string }> {
  const targetUri = (uriString || activeUri).trim();

  if (!targetUri) {
    return {
      success: false,
      message: 'No MongoDB URI configured. Running in hybrid local mode with MongoDB readiness.'
    };
  }

  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
    }

    client = new MongoClient(targetUri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();

    // Parse DB Name from URI or default
    const parsedUrl = new URL(targetUri.replace('mongodb+srv://', 'http://').replace('mongodb://', 'http://'));
    const pathName = parsedUrl.pathname.replace(/^\//, '');
    currentDbName = pathName || 'pavitram_pooja_db';

    db = client.db(currentDbName);
    activeUri = targetUri;
    lastConnectionError = '';

    console.log(`[MongoDB] Connected successfully to database: ${currentDbName}`);

    // Create indexes for high performance
    try {
      await db.collection('clients').createIndex({ phone: 1 });
      await db.collection('orders').createIndex({ id: 1 }, { unique: true });
      await db.collection('bookings').createIndex({ id: 1 }, { unique: true });
      await db.collection('payments').createIndex({ transactionId: 1 });
    } catch (idxErr) {
      // Indexes already exist or soft error
    }

    return {
      success: true,
      message: `Connected to MongoDB database "${currentDbName}"`,
      dbName: currentDbName,
    };
  } catch (error: any) {
    const errorMsg = error?.message || 'Failed to connect to MongoDB';
    console.error('[MongoDB Connection Error]:', errorMsg);
    lastConnectionError = errorMsg;
    client = null;
    db = null;

    return {
      success: false,
      message: errorMsg,
    };
  }
}

export function isMongoConnected(): boolean {
  return db !== null;
}

export function getDatabase(): Db | null {
  return db;
}

export async function getMongoStatus(): Promise<MongoDatabaseStatus> {
  const isConn = isMongoConnected();
  let counts = { clients: 0, bookings: 0, orders: 0, payments: 0 };

  if (isConn && db) {
    try {
      const [cCount, bCount, oCount, pCount] = await Promise.all([
        db.collection('clients').countDocuments(),
        db.collection('bookings').countDocuments(),
        db.collection('orders').countDocuments(),
        db.collection('payments').countDocuments(),
      ]);
      counts = { clients: cCount, bookings: bCount, orders: oCount, payments: pCount };
    } catch (e) {
      // fallback
    }
  }

  return {
    isConnected: isConn,
    uriConfigured: Boolean(activeUri),
    dbName: isConn ? currentDbName : 'Not connected',
    counts,
    lastError: lastConnectionError || undefined,
  };
}

export async function syncLocalToMongo(
  clientsData: any[],
  bookingsData: any[],
  ordersData: any[]
): Promise<{ syncedClients: number; syncedBookings: number; syncedOrders: number }> {
  if (!db) {
    throw new Error('Cannot sync: MongoDB is not connected.');
  }

  let syncedClients = 0;
  let syncedBookings = 0;
  let syncedOrders = 0;

  const clientsCol = db.collection('clients');
  for (const c of clientsData) {
    const res = await clientsCol.updateOne(
      { id: c.id },
      { $set: c },
      { upsert: true }
    );
    if (res.upsertedCount || res.modifiedCount) syncedClients++;
  }

  const bookingsCol = db.collection('bookings');
  for (const b of bookingsData) {
    const res = await bookingsCol.updateOne(
      { id: b.id },
      { $set: b },
      { upsert: true }
    );
    if (res.upsertedCount || res.modifiedCount) syncedBookings++;
  }

  const ordersCol = db.collection('orders');
  for (const o of ordersData) {
    const res = await ordersCol.updateOne(
      { id: o.id },
      { $set: o },
      { upsert: true }
    );
    if (res.upsertedCount || res.modifiedCount) syncedOrders++;
  }

  return { syncedClients, syncedBookings, syncedOrders };
}
