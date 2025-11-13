// src/controllers/notification.controller.js

import {
    getNotificationsForUser,
    markNotificationRead,
    markAllReadForUser,
    getUnreadCount,
  } from "../services/notification.service.js";
  
  
  // 1️⃣ Get All Notifications
  export const getNotifications = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const data = await getNotificationsForUser(userId, {
        page: req.query.page || 1,
        limit: req.query.limit || 20,
      });
  
      return res.json({
        success: true,
        ...data,
      });
  
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
  
  
  // 1️⃣✨ Required alias for routes
  export const getUserNotifications = getNotifications;
  
  
  // 2️⃣ Mark ONE notification as read
  export const markRead = async (req, res) => {
    try {
      const id = req.params.id;
  
      const updated = await markNotificationRead(id);
  
      return res.json({
        success: true,
        notification: updated,
      });
  
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
  
  // 2️⃣✨ Fix for error: routes expect markAsRead
  export const markAsRead = markRead;
  
  
  // 3️⃣ Mark ALL notifications as read
  export const markAllRead = async (req, res) => {
    try {
      await markAllReadForUser(req.user.id);
  
      return res.json({
        success: true,
        message: "All notifications marked as read",
      });
  
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
  
  
  // 4️⃣ Get unread count
  export const unreadCount = async (req, res) => {
    try {
      const count = await getUnreadCount(req.user.id);
  
      return res.json({
        success: true,
        unread: count,
      });
  
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
  