// // // src/config/redis.js
// // import { createClient } from "redis";

// // const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// // // Publisher (backend → frontend/microservice)
// // export const redisPub = createClient({ url: redisUrl });

// // // Subscriber (optional, only if backend needs to listen)
// // export const redisSub = createClient({ url: redisUrl });

// // redisPub.on("error", (err) => console.error("Redis Publisher Error:", err));
// // redisSub.on("error", (err) => console.error("Redis Subscriber Error:", err));

// // export const initRedis = async () => {
// //   await redisPub.connect();
// //   await redisSub.connect();
// //   console.log("🔌 Redis connected");
// // };

// // /**
// //  * Publish event to a user's notification channel
// //  */
// // export const publishNotification = async (userId, payload) => {
// //   const channel = `notifications:user:${userId}`;
// //   await redisPub.publish(channel, JSON.stringify(payload));
// // };


// // src/config/redis.js
// import { createClient } from "redis";

// const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// // Publisher
// export const redisPub = createClient({ url: redisUrl });

// // Subscriber (optional)
// export const redisSub = createClient({ url: redisUrl });

// redisPub.on("error", (err) => console.error("Redis Publisher Error:", err));
// redisSub.on("error", (err) => console.error("Redis Subscriber Error:", err));

// export const initRedis = async () => {
//   await redisPub.connect();
//   await redisSub.connect();
//   console.log("🔌 Redis connected");
// };

// // CHANNEL FORMAT → notifications:user:<userId>
// export const publishNotification = async (userId, payload) => {
//   const channel = `notifications:user:${userId}`;
//   await redisPub.publish(channel, JSON.stringify(payload));
// };


// src/config/redis.js
import { createClient } from "redis";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisPub = createClient({ url: redisUrl });
export const redisSub = createClient({ url: redisUrl });

redisPub.on("error", (err) => console.error("Redis Publisher Error:", err));
redisSub.on("error", (err) => console.error("Redis Subscriber Error:", err));

export const initRedis = async () => {
  try {
    await redisPub.connect();
    await redisSub.connect();
    console.log("🔌 Redis connected");
  } catch (e) {
    console.error("Redis connection failed:", e);
  }
};

export const publishNotification = async (userId, payload) => {
  const channel = `notifications:user:${userId}`;
  try {
    console.log(`➡️  Publishing to channel=${channel} payload=${JSON.stringify(payload)}`);
    const res = await redisPub.publish(channel, JSON.stringify(payload));
    console.log(`✅ Publish result: ${res} (number of subscribers that received it)`);
    return res;
  } catch (err) {
    console.error(`❌ Failed to publish to ${channel}:`, err);
    throw err;
  }
};
