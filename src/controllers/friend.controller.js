
// // src/controllers/friend.controller.js

// import FriendRequest from "../models/FriendRequest.js";
// import Friend from "../models/Friend.js";
// import { createNotification } from "../services/notification.service.js";

// /**
//  * SEND FRIEND REQUEST
//  */
// export const sendRequest = async (req, res) => {
//   try {
//     const { receiver_id } = req.body;

//     console.log("➡️ Sending friend request...");
//     console.log("Sender:", req.user.id);
//     console.log("Receiver:", receiver_id);

//     const request = await FriendRequest.create({
//       sender_id: req.user.id,
//       receiver_id,
//     });

//     console.log("📨 FriendRequest created:", request._id.toString());

//     // Create notification (DB + Redis publish happens INSIDE createNotification)
//     const notification = await createNotification({
//       user_id: receiver_id,
//       sender_id: req.user.id,
//       type: "friend_request",
//       message: "sent you a friend request",
//     });

//     console.log("📨 Notification saved:", notification._id.toString());
//     console.log("📣 Redis publish done automatically by createNotification()");

//     return res.status(201).json({
//       success: true,
//       message: "Friend request sent",
//       request,
//     });

//   } catch (err) {
//     console.error("❌ Error in sendRequest:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * ACCEPT FRIEND REQUEST
//  */
// export const acceptRequest = async (req, res) => {
//   try {
//     const id = req.params.id;

//     console.log("➡️ Accepting friend request:", id);

//     const request = await FriendRequest.findById(id);
//     if (!request) {
//       console.log("❌ FriendRequest not found");
//       return res.status(404).json({ success: false, message: "Not found" });
//     }

//     request.status = "accepted";
//     await request.save();

//     console.log("✔️ FriendRequest accepted");

//     await Friend.create({ user_id: request.sender_id, friend_id: request.receiver_id });
//     await Friend.create({ user_id: request.receiver_id, friend_id: request.sender_id });

//     console.log("✔️ Both users added to Friend list");

//     // Create notification (DB + Redis publish INSIDE createNotification)
//     const notification = await createNotification({
//       user_id: request.sender_id,
//       sender_id: request.receiver_id,
//       type: "friend_accept",
//       message: "accepted your friend request",
//     });

//     console.log("📨 Notification saved:", notification._id.toString());
//     console.log("📣 Redis publish done automatically by createNotification()");

//     return res.json({
//       success: true,
//       message: "Friend request accepted",
//     });

//   } catch (err) {
//     console.error("❌ Error in acceptRequest:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * GET FRIEND LIST
//  */
// export const getFriends = async (req, res) => {
//   try {
//     console.log("➡️ Fetching friends for:", req.user.id);

//     const friends = await Friend.find({ user_id: req.user.id })
//       .populate("friend_id", "name username profile_picture");

//     return res.json({ success: true, friends });

//   } catch (err) {
//     console.error("❌ Error in getFriends:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };


import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";
import { createNotification } from "../services/notification.service.js";

/**
 * SEND FRIEND REQUEST
 */
export const sendRequest = async (req, res) => {
  try {
    const { receiver_id } = req.body;

    const existing = await FriendRequest.findOne({
      sender_id: req.user.id,
      receiver_id,
      is_deleted: false,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Request already sent"
      });
    }

    const request = await FriendRequest.create({
      sender_id: req.user.id,
      receiver_id
    });

    await createNotification({
      user_id: receiver_id,
      sender_id: req.user.id,
      type: "friend_request",
      message: "sent you a friend request"
    });

    return res.status(201).json({
      success: true,
      message: "Friend request sent",
      request
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * ACCEPT FRIEND REQUEST
 */
export const acceptRequest = async (req, res) => {
  try {
    const id = req.params.id;

    const request = await FriendRequest.findOne({
      _id: id,
      is_deleted: false,
      status: "pending"
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    await Friend.create({
      user_id: request.sender_id,
      friend_id: request.receiver_id
    });

    await Friend.create({
      user_id: request.receiver_id,
      friend_id: request.sender_id
    });

    await createNotification({
      user_id: request.sender_id,
      sender_id: request.receiver_id,
      type: "friend_accept",
      message: "accepted your friend request"
    });

    return res.json({
      success: true,
      message: "Friend request accepted"
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * SOFT DELETE FRIEND REQUEST (cancel or reject)
 */
export const deleteFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findOne({
      _id: req.params.id,
      is_deleted: false
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found"
      });
    }

    if (
      request.sender_id.toString() !== req.user.id &&
      request.receiver_id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    request.is_deleted = true;
    request.deleted_at = new Date();
    request.status = "rejected";

    await request.save();

    return res.json({
      success: true,
      message: "Friend request deleted (soft delete)"
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * UNFRIEND (soft delete)
 */
export const unfriend = async (req, res) => {
  try {
    const { id } = req.params;

    const relation = await Friend.findOne({
      user_id: req.user.id,
      friend_id: id,
      is_deleted: false
    });

    if (!relation) {
      return res.status(404).json({
        success: false,
        message: "Friend not found"
      });
    }

    relation.is_deleted = true;
    relation.deleted_at = new Date();

    await relation.save();

    // Also delete reverse relation
    const reverse = await Friend.findOne({
      user_id: id,
      friend_id: req.user.id,
      is_deleted: false
    });

    if (reverse) {
      reverse.is_deleted = true;
      reverse.deleted_at = new Date();
      await reverse.save();
    }

    return res.json({
      success: true,
      message: "Unfriended successfully (soft delete)"
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * GET FRIEND LIST (exclude deleted)
 */
export const getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({
      user_id: req.user.id,
      is_deleted: false
    })
      .populate("friend_id", "name username profile_picture");

    return res.json({ success: true, friends });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
