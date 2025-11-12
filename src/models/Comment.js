import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  text: { type: String, default: "" },
  image_url: { type: String, default: "" },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", commentSchema);
