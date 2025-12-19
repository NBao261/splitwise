import { MongoClient, Db } from 'mongodb';
import { envConfig } from '../config/env.config';

let client: MongoClient;
let db: Db;

/**
 * Kết nối MongoDB với retry logic
 * @param retries - Số lần thử lại (mặc định: 3)
 * @param delay - Thời gian chờ giữa các lần thử (ms, mặc định: 2000)
 */
export async function connectDB(
  retries: number = 3,
  delay: number = 2000
): Promise<Db> {
  if (db) return db;

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Đang kết nối MongoDB... (Lần thử ${i + 1}/${retries})`);
      client = new MongoClient(envConfig.MONGO_URI);
      await client.connect();
      db = client.db(envConfig.DB_NAME);
      console.log('🍃 MongoDB Connected Successfully');
      console.log(`📦 Database: ${envConfig.DB_NAME}`);
      return db;
    } catch (error: any) {
      console.error(
        `❌ MongoDB Connection Error (Lần thử ${i + 1}/${retries}):`,
        error.message
      );

      if (i < retries - 1) {
        console.log(`⏳ Đợi ${delay}ms trước khi thử lại...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('\n❌ Không thể kết nối MongoDB sau', retries, 'lần thử');
        console.error('\n📋 Hướng dẫn khắc phục:');
        console.error('1. Đảm bảo MongoDB đang chạy:');
        console.error('   - Windows: net start MongoDB');
        console.error(
          '   - Mac/Linux: brew services start mongodb-community hoặc sudo systemctl start mongod'
        );
        console.error('   - Hoặc chạy: mongod');
        console.error('\n2. Hoặc sử dụng MongoDB Atlas (cloud):');
        console.error('   - Truy cập: https://www.mongodb.com/cloud/atlas');
        console.error('   - Tạo cluster miễn phí');
        console.error('   - Cập nhật MONGO_URI trong file .env');
        console.error('\n3. Kiểm tra MONGO_URI trong file .env:');
        console.error(`   Hiện tại: ${envConfig.MONGO_URI}`);
        throw new Error(
          `MongoDB connection failed after ${retries} attempts: ${error.message}`
        );
      }
    }
  }

  throw new Error('MongoDB connection failed');
}

export const getDb = (): Db | null => {
  if (!db) {
    console.error(
      'Database chưa được kết nối. Vui lòng gọi connectDB() trước.'
    );
    return null;
  }
  return db;
};
