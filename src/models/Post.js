import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "" },
  image_url: { type: String, default: "" },
  video_url: { type: String, default: "" },
  visibility: { type: String, enum: ["public", "friends", "private"], default: "public" },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
