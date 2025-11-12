import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  comment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, default: "" },
  image_url: { type: String, default: "" },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Reply", replySchema);
