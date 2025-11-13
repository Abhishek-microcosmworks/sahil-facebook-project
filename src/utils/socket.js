import { io } from "../server.js";

export const sendSocketNotification = (userId, payload) => {
  const socketId = global.onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit("notification", payload);
  }
};
