import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";

export const sendFriendRequest = async (sender_id, receiver_id) => {
  return await FriendRequest.create({
    sender_id,
    receiver_id,
  });
};

export const acceptFriendRequest = async (id) => {
  const request = await FriendRequest.findById(id);
  if (!request) return null;

  request.status = "accepted";
  await request.save();

  await Friend.create({ user_id: request.sender_id, friend_id: request.receiver_id });
  await Friend.create({ user_id: request.receiver_id, friend_id: request.sender_id });

  return request;
};

export const getFriends = async (user_id) => {
  return await Friend.find({ user_id })
    .populate("friend_id", "name username profile_picture");
};
