import { MongoClient, Db } from 'mongodb';
import { envConfig } from '../config/env.config';

let client: MongoClient;
let db: Db;

export async function connectDB() {
  const uri = envConfig.MONGO_URI;

  client = new MongoClient(uri, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  try {
    await client.connect();
    db = client.db();
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
}

export const getDb = (): Db => {
  if (!db) throw new Error('Database not initialized. Call connectDB first.');
  return db;
};
