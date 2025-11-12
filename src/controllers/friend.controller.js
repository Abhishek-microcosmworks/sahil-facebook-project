import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";

export const sendRequest = async (req, res) => {
  try {
    const { receiver_id } = req.body;

    const request = await FriendRequest.create({
      sender_id: req.user.id,
      receiver_id,
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent",
      request,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const id = req.params.id;

    const request = await FriendRequest.findById(id);

    if (!request)
      return res.status(404).json({ success: false, message: "Not found" });

    request.status = "accepted";
    await request.save();

    // Add both users as friends
    await Friend.create({ user_id: request.sender_id, friend_id: request.receiver_id });
    await Friend.create({ user_id: request.receiver_id, friend_id: request.sender_id });

    res.json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({ user_id: req.user.id })
      .populate("friend_id", "name username profile_picture");

    res.json({ success: true, friends });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
