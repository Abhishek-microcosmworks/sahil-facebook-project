import UserSettings from "../models/UserSettings.js";

export const getSettings = async (user_id) => {
  return await UserSettings.findOne({ user_id });
};

export const updateSettings = async (user_id, data) => {
  return await UserSettings.findOneAndUpdate(
    { user_id },
    data,
    { new: true, upsert: true }
  );
};
