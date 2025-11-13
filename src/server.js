import http from "http";
import app from "./app.js";
import { initRedis } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Start Redis
initRedis();

server.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});
