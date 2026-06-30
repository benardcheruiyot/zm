import dotenv from 'dotenv';

dotenv.config();

const rawOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173,https://ecocashverification.vercel.app';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  corsOrigin: rawOrigin.includes(',') ? rawOrigin.split(',').map((o) => o.trim()) : rawOrigin
};
