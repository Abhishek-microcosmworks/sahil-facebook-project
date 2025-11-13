// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import path from "path";
// import { fileURLToPath } from "url";

// import connectDB from "./config/db.js";
// import routes from "./routes/index.js";

// import { successLogger } from "./middleware/log.middleware.js";
// import { notFound } from "./middleware/notFound.middleware.js";
// import { errorHandler } from "./middleware/error.middleware.js";

// const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// connectDB();

// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.use(express.json());
// app.use(cors());
// app.use(morgan("dev"));

// app.use(successLogger);

// app.use("/api", routes);

// app.use(notFound);

// app.use(errorHandler);

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

import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB Connect
connectDB();

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// API Routes
app.use("/api", routes);

// Route Not Found
app.use(notFound);

// Error Handler
app.use(errorHandler);

export default app;
