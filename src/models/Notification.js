import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Who receives it
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who triggered it
  type: { type: String, enum: ["friend_request", "friend_accept"], required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
