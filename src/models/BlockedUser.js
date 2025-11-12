import mongoose from "mongoose";

const blockedUserSchema = new mongoose.Schema({
  blocker_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blocked_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("BlockedUser", blockedUserSchema);
