import dotenv from 'dotenv';
dotenv.config();

export default () => ({
  PORT: process.env.PORT || 4000,
  mongo_uri: process.env.MONGO_DB || 'mongodb://127.0.0.1:27017/hw',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || '123',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '123',
  EMAIL: process.env.EMAIL,
  PASS: process.env.PASS,
});
