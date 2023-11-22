import { config } from 'dotenv';

config();

export default () => ({
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  email: process.env.EMAIL,
  pass: process.env.PASS,
});
