import dotenv from 'dotenv';
dotenv.config();

export default () => ({
  port: process.env.PORT,
  db: process.env.DB,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  EMAIL: process.env.EMAIL,
  PASS: process.env.PASS,
});
