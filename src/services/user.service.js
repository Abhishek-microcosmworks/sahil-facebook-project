import User from "../models/User.js";

export const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

export const updateUserProfile = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
  }).select("-password");
};

export const searchUsers = async (query) => {
  return await User.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } },
    ],
  }).select("name username profile_picture");
};
