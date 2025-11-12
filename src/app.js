// import dotenv from "dotenv";
// dotenv.config();

// console.log("APP FILE LOADED");
// console.log("Environment:", process.env.NODE_ENV);
// console.log("MONGO_URI:", process.env.MONGO_URI);

// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import path from "path";
// import { fileURLToPath } from "url";
// import connectDB from "./config/db.js";
// import routes from "./routes/index.js";

// const app = express();

// // 🧩 Resolve dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Connect to MongoDB AFTER .env is loaded
// connectDB();

// // ✅ Serve uploaded files BEFORE routes
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ✅ Middlewares
// app.use(express.json());
// app.use(cors());
// app.use(morgan("dev"));

// // ✅ API Routes
// app.use("/api", routes);

// // 🚫 404 Handler (keep this BELOW routes)
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found!",
//   });
// });

// // 💥 Error Handler (keep this LAST)
// app.use((err, req, res, next) => {
//   console.error("💥 Error:", err.message);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// export default app;


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect DB
connectDB();

// ✅ Serve uploaded files from project root
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Core middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// ✅ Routes
app.use("/api", routes);

// 🚫 404 Handler (after routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
  });
});

export default app;
