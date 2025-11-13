
// import fs from "fs";
// import path from "path";

// // Base logs folder (inside src/logs)
// const baseDir = path.join(process.cwd(), "src/logs");
// if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

// // Generate YYYY-MM-DD filename
// const dailyLogFile = () => {
//   const date = new Date().toISOString().split("T")[0];
//   return path.join(baseDir, `error_logs_${date}.json`);
// };

// // Write JSON line to log file
// const writeLog = (data) => {
//   const file = dailyLogFile();
//   fs.appendFile(file, JSON.stringify(data) + "\n", (err) => {
//     if (err) console.error("Logging Failed:", err);
//   });
// };

// // Auto delete logs older than 3 days
// export const cleanupOldLogs = () => {
//   const files = fs.readdirSync(baseDir);

//    const threshold = Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days



//   files.forEach((file) => {
//     if (file.startsWith("error_logs_") && file.endsWith(".json")) {
//       const dateStr = file.replace("error_logs_", "").replace(".json", "");
//       const fileDate = new Date(dateStr).getTime();

//       if (!isNaN(fileDate) && fileDate < threshold) {
//         fs.unlinkSync(path.join(baseDir, file));
//       }
//     }
//   });
// };

// // EXPORT ONLY ERROR LOGGING
// export const logError = (info) => {
//   writeLog({
//     time: new Date().toISOString(),
//     ...info,
//   });

//   cleanupOldLogs(); // Clean old logs each time new log is written
// };


// src/utils/logger.js
import fs from "fs";
import path from "path";
import ErrorLog from "../models/ErrorLog.js";

// Base logs folder (inside src/logs)
const baseDir = path.join(process.cwd(), "src/logs");
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

// Generate YYYY-MM-DD filename
const dailyLogFile = () => {
  const date = new Date().toISOString().split("T")[0];
  return path.join(baseDir, `error_logs_${date}.json`);
};

// Write JSON line to log file
const writeLogToFile = (data) => {
  const file = dailyLogFile();
  fs.appendFile(file, JSON.stringify(data) + "\n", (err) => {
    if (err) console.error("Logging Failed:", err);
  });
};

// Auto delete logs older than 3 days (file only)
export const cleanupOldLogs = () => {
  const files = fs.readdirSync(baseDir);
  const threshold = Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days

  files.forEach((file) => {
    if (file.startsWith("error_logs_") && file.endsWith(".json")) {
      const dateStr = file.replace("error_logs_", "").replace(".json", "");
      const fileDate = new Date(dateStr).getTime();

      if (!isNaN(fileDate) && fileDate < threshold) {
        fs.unlinkSync(path.join(baseDir, file));
        console.log("🗑 Deleted log file:", file);
      }
    }
  });
};

// EXPORT ONLY ERROR LOGGING
export const logError = async (info) => {
  const entry = {
    time: new Date().toISOString(),
    is_deleted: false,       // soft delete field
    ...info,
  };

  // Save in DB permanently
  await ErrorLog.create(entry);

  // Save to file (temp)
  writeLogToFile(entry);

  // Delete expired files
  cleanupOldLogs();
};
