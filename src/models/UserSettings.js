import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  post_visibility_default: { type: String, enum: ["public", "friends", "private"], default: "public" },
  friend_request_permission: { type: String, enum: ["everyone", "friends_of_friends", "no_one"], default: "everyone" },
  allow_tagging: { type: Boolean, default: true },
  language: { type: String, default: "en" },
  country: { type: String, default: "" }
});

export default mongoose.model("UserSettings", userSettingsSchema);
