import cron from "node-cron";
import fs from "fs";
import path from "path";

// Folder: src/logs/
const baseDir = path.join(process.cwd(), "src/logs");

// Run every day at 12:00 AM
cron.schedule("0 0 * * *", () => {
  console.log("🧹 Running CRON: Cleaning error logs older than 3 days");

  try {
    const files = fs.readdirSync(baseDir);

    const threshold = Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days

    files.forEach((file) => {
      if (file.startsWith("error_logs_") && file.endsWith(".json")) {
        const dateStr = file.replace("error_logs_", "").replace(".json", "");
        const fileDate = new Date(dateStr).getTime();

        if (!isNaN(fileDate) && fileDate < threshold) {
          fs.unlinkSync(path.join(baseDir, file));
          console.log(`🗑 Deleted old log: ${file}`);
        }
      }
    });
  } catch (err) {
    console.error("❌ CRON log cleanup failed:", err);
  }
});
