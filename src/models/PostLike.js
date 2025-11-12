import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now }
});

// Prevent duplicate likes
postLikeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model("PostLike", postLikeSchema);
