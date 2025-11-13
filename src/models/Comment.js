// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema({
//   post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
//   text: { type: String, default: "" },
//   image_url: { type: String, default: "" },
//   created_at: { type: Date, default: Date.now }
// });

// export default mongoose.model("Comment", commentSchema);

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    text: { type: String, default: "" },

    image_url: { type: String, default: "" },

    // 🔥 Soft Delete Fields
    is_deleted: {
      type: Boolean,
      default: false,
    },

    deleted_at: {
      type: Date,
      default: null,
    },

    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model("Comment", commentSchema);
