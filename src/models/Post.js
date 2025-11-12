// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema({
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   content: { type: String, default: "" },
//   image_url: { type: String, default: "" },
//   video_url: { type: String, default: "" },
//   visibility: { type: String, enum: ["public", "friends", "private"], default: "public" },
//   created_at: { type: Date, default: Date.now }
// });

// export default mongoose.model("Post", postSchema);


// import mongoose from "mongoose";

// const PostSchema = new mongoose.Schema({
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   content: { type: String, trim: true },
//   image_url: { type: String, default: "" },
//   video_url: { type: String, default: "" }, // ✅ New field
//   visibility: { type: String, enum: ["public", "friends", "private"], default: "public" },
//   created_at: { type: Date, default: Date.now },
// });

// export default mongoose.model("Post", PostSchema);


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
    image_url: {
      type: String,
      default: "",
    },
    video_url: {
      type: String,
      default: "",
    },
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// ✅ Keep schema flexible for both image/video use cases
PostSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
