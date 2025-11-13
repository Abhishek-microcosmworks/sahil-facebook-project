// import mongoose from "mongoose";

// const postLikeSchema = new mongoose.Schema({
//   post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   created_at: { type: Date, default: Date.now }
// });

// // Prevent duplicate likes
// postLikeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

// export default mongoose.model("PostLike", postLikeSchema);


import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // ⭐ Soft delete fields
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null },

  created_at: { type: Date, default: Date.now }
});

// Prevent duplicate active likes
postLikeSchema.index(
  { post_id: 1, user_id: 1, is_deleted: 1 },
  { unique: true }
);

export default mongoose.model("PostLike", postLikeSchema);
