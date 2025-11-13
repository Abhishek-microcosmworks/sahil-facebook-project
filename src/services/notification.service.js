// src/services/notification.service.js

import Notification from "../models/Notification.js";
import { publishNotification } from "../config/redis.js";

/**
 * Create notification + publish via Redis
 */
export const createNotification = async (data) => {
  const notif = await Notification.create({
    user_id: data.user_id,
    sender_id: data.sender_id,
    type: data.type,
    message: data.message,
  });

  // Publish real-time notification
  await publishNotification(data.user_id, {
    id: notif._id,
    sender_id: data.sender_id,
    type: data.type,
    message: data.message,
    created_at: notif.created_at,
  });

  return notif;
};

/**
 * Get notifications for user (paginated)
 */
export const getNotificationsForUser = async (
  userId,
  { page = 1, limit = 20 } = {}
) => {
  const skip = (page - 1) * limit;

  const total = await Notification.countDocuments({ user_id: userId });

  const list = await Notification.find({ user_id: userId })
    .populate("sender_id", "name username profile_picture")
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    notifications: list,
  };
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(
    notificationId,
    { is_read: true },
    { new: true }
  );
};

/**
 * Mark all notifications as read for user
 */
export const markAllReadForUser = async (userId) => {
  return Notification.updateMany(
    { user_id: userId },
    { is_read: true }
  );
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({
    user_id: userId,
    is_read: false,
  });
};
