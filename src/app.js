import dotenv from "dotenv";
dotenv.config();

console.log("APP FILE LOADED");
console.log("Environment:", process.env.NODE_ENV);
console.log("MONGO_URI:", process.env.MONGO_URI);

import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

// Connect to MongoDB AFTER .env is loaded
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// API Routes
app.use("/api", routes);

// Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//Upload Images
app.use("/uploads", express.static("uploads"));


export default app;
