import { MongoClient, type MongoClientOptions, type Db } from 'mongodb';
import { envConfig } from '../config/env.config';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB() {
  const uri = envConfig.MONGO_URI;

  const options: MongoClientOptions = {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  // Tránh lỗi SSL trên môi trường dev/Windows với MongoDB Atlas
  if (uri.startsWith('mongodb+srv://') && envConfig.NODE_ENV !== 'production') {
    options.tls = true;
    options.tlsAllowInvalidCertificates = true;
  }

  if (!client) {
    client = new MongoClient(uri, options);
  }

  try {
    await client.connect();
    db = client.db(envConfig.DB_NAME);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    // Không exit ngay để dễ debug trong môi trường dev
    if (envConfig.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
}

export const getDb = (): Db => {
  if (!db) throw new Error('Database not initialized. Call connectDB first.');
  return db;
};
