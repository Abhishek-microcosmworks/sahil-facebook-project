// import mongoose from "mongoose";

// const PostSchema = new mongoose.Schema(
//   {
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     content_text: {
//       type: String,
//       trim: true,
//     },
//     image_url: {
//       type: String,
//       default: "",
//     },
//     video_url: {
//       type: String,
//       default: "",
//     },
//     media_type: {
//       type: String,
//       enum: ["image", "video", null],
//       default: null,
//     },
//     visibility: {
//       type: String,
//       enum: ["public", "friends", "private"],
//       default: "public",
//     },
//   },
//   {
//     timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
//   }
// );

// // ✅ Keep schema flexible for both image/video use cases
// PostSchema.pre("save", function (next) {
//   this.updated_at = new Date();
//   next();
// });

// const Post = mongoose.model("Post", PostSchema);
// export default Post;

import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content_text: {
      type: String,
      trim: true,
    },
    image_url: { type: String, default: "" },
    video_url: { type: String, default: "" },

    media_type: {
      type: String,
      enum: ["image", "video", null],
      default: null,
    },

    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },

    // Soft delete fields
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

PostSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model("Post", PostSchema);
