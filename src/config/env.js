import dotenv from "dotenv";

dotenv.config();

const requiredVars = ["MONGO_URI", "JWT_SECRET", "PORT"];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Warning: Missing environment variable → ${key}`);
  }
});

export default {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};
