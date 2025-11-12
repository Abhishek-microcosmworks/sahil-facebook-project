import mongoose from "mongoose";

const commentLikeSchema = new mongoose.Schema({
  comment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now }
});

// Prevent duplicate likes
commentLikeSchema.index({ comment_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model("CommentLike", commentLikeSchema);
