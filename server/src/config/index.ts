import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiPrefix: process.env.API_PREFIX || '/api',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
};
