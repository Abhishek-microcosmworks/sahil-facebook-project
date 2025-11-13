import express from "express";
import auth from "../middleware/auth.middleware.js";

import {
  getUserNotifications,
  markAsRead,
  markAllRead,
  unreadCount
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", auth, getUserNotifications);
router.get("/unread-count", auth, unreadCount);
router.patch("/:id/read", auth, markAsRead);
router.patch("/read-all", auth, markAllRead);

export default router;
