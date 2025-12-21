import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  DB_NAME: process.env.DB_NAME || 'splitwise_dev',

  JWT_SECRET:
    process.env.JWT_SECRET ||
    (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'JWT_SECRET phải được thiết lập trong môi trường production'
        );
      }
      return 'your-secret-key-change-in-production';
    })(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
};

if (envConfig.NODE_ENV === 'production') {
  const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missingVars.join(', ')}`
    );
  }
}
