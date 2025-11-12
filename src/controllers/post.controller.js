
// import fs from "fs";
// import path from "path";
// import Post from "../models/Post.js";
// import PostLike from "../models/PostLike.js";
// import Share from "../models/Share.js";
// import Friend from "../models/Friend.js";
// import User from "../models/User.js";

// // ✅ Create post (image/video + text in one go)
// export const createPost = async (req, res) => {
//   try {
//     const { content = "", visibility = "public" } = req.body;

//     // Reject empty posts
//     if (!req.file && !content.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Either content or a file (image/video) is required",
//       });
//     }

//     let media_type = null;
//     let media_url = "";

//     if (req.file) {
//       const ext = path.extname(req.file.originalname).toLowerCase();
//       if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
//         media_type = "video";
//         media_url = `/uploads/videos/${req.file.filename}`;
//       } else {
//         media_type = "image";
//         media_url = `/uploads/posts/${req.file.filename}`;
//       }
//     }

//     const fullMediaUrl = media_url
//       ? `${req.protocol}://${req.get("host")}${media_url}`
//       : "";

//     const post = await Post.create({
//       user_id: req.user.id,
//       content_text: content,
//       media_type,
//       media_url: fullMediaUrl,
//       visibility,
//       created_at: new Date(),
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post,
//     });
//   } catch (err) {
//     console.error("Error creating post:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Get feed (logged-in user + friends)
// export const getPosts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const visibility = req.query.visibility;

//     const friends = await Friend.find({
//       $or: [{ user_id: req.user.id }, { friend_id: req.user.id }],
//     });

//     const friendIds = friends.map(f =>
//       f.user_id.toString() === req.user.id ? f.friend_id : f.user_id
//     );

//     const query = { user_id: { $in: [req.user.id, ...friendIds] } };
//     if (visibility) query.visibility = visibility;

//     const totalPosts = await Post.countDocuments(query);
//     const posts = await Post.find(query)
//       .populate("user_id", "name username profile_picture")
//       .sort({ created_at: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.json({
//       success: true,
//       total: totalPosts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalPosts / limit),
//       posts,
//     });
//   } catch (err) {
//     console.error("Error fetching feed:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Get my posts
// export const getMyPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({ user_id: req.user.id })
//       .populate("user_id", "name username profile_picture")
//       .sort({ created_at: -1 });

//     res.json({ success: true, posts });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Posts of specific user
// export const getUserPosts = async (req, res) => {
//   try {
//     const { identifier } = req.params;
//     let user = await User.findOne({ username: identifier });
//     if (!user && identifier.match(/^[0-9a-fA-F]{24}$/)) {
//       user = await User.findById(identifier);
//     }
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const posts = await Post.find({ user_id: user._id })
//       .populate("user_id", "name username profile_picture")
//       .sort({ created_at: -1 });

//     res.json({
//       success: true,
//       user: { _id: user._id, username: user.username, name: user.name },
//       posts,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Like, Share, Delete remain same
// export const likePost = async (req, res) => {
//   try {
//     await PostLike.create({ post_id: req.params.id, user_id: req.user.id });
//     res.json({ success: true, message: "Post liked" });
//   } catch (err) {
//     if (err.code === 11000)
//       return res.status(400).json({ success: false, message: "Already liked" });
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const sharePost = async (req, res) => {
//   try {
//     await Share.create({ post_id: req.params.id, user_id: req.user.id });
//     res.json({ success: true, message: "Post shared" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ success: false, message: "Post not found" });
//     if (post.user_id.toString() !== req.user.id)
//       return res.status(403).json({ success: false, message: "Unauthorized" });

//     // Delete local media file if exists
//     if (post.media_url) {
//       const localPath = post.media_url.replace(`${req.protocol}://${req.get("host")}`, "");
//       const filePath = path.join(process.cwd(), "src", localPath);
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     }

//     await PostLike.deleteMany({ post_id: post._id });
//     await Share.deleteMany({ post_id: post._id });
//     await Post.findByIdAndDelete(post._id);

//     res.json({ success: true, message: "Post deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// import fs from "fs";
// import path from "path";
// import Post from "../models/Post.js";
// import PostLike from "../models/PostLike.js";
// import Share from "../models/Share.js";
// import Friend from "../models/Friend.js";
// import User from "../models/User.js";

// // ✅ Create post (image/video + text in one go)
// export const createPost = async (req, res) => {
//   try {
//     const { content = "", visibility = "public" } = req.body;

//     // Reject empty posts (no text and no file)
//     if (!req.file && !content.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Either content or a file (image/video) is required",
//       });
//     }

//     let media_type = null;
//     let media_url = "";

//     // ✅ If file exists — determine file type and set path
//     if (req.file) {
//       const ext = path.extname(req.file.originalname).toLowerCase();

//       if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
//         media_type = "video";
//         media_url = `/uploads/videos/${req.file.filename}`;
//       } else {
//         media_type = "image";
//         media_url = `/uploads/posts/${req.file.filename}`;
//       }
//     }

//     // ✅ Create full accessible URL
//     const fullMediaUrl = media_url
//       ? `${req.protocol}://${req.get("host")}${media_url}`
//       : "";

//     // ✅ Save in database
//     const post = await Post.create({
//       user_id: req.user.id,
//       content_text: content,
//       media_type,
//       media_url: fullMediaUrl,
//       visibility,
//       created_at: new Date(),
//     });

//     return res.status(201).json({
//       success: true,
//       message: `${media_type === "video" ? "Video" : "Image"} post created successfully`,
//       post,
//     });
//   } catch (err) {
//     console.error("❌ Error creating post:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Get feed (logged-in user + friends)
// export const getPosts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const visibility = req.query.visibility;

//     const friends = await Friend.find({
//       $or: [{ user_id: req.user.id }, { friend_id: req.user.id }],
//     });

//     const friendIds = friends.map(f =>
//       f.user_id.toString() === req.user.id ? f.friend_id : f.user_id
//     );

//     const query = { user_id: { $in: [req.user.id, ...friendIds] } };
//     if (visibility) query.visibility = visibility;

//     const totalPosts = await Post.countDocuments(query);
//     const posts = await Post.find(query)
//       .populate("user_id", "name username profile_picture")
//       .sort({ created_at: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.json({
//       success: true,
//       total: totalPosts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalPosts / limit),
//       posts,
//     });
//   } catch (err) {
//     console.error("Error fetching feed:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Get my posts
// export const getMyPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({ user_id: req.user.id })
//       .populate("user_id", "name username profile_picture")
//       .sort({ created_at: -1 });

//     res.json({ success: true, posts });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Posts of a specific user
// export const getUserPosts = async (req, res) => {
//   try {
//     const { identifier } = req.params;
//     let user = await User.findOne({ username: identifier });

//     if (!user && identifier.match(/^[0-9a-fA-F]{24}$/)) {
//       user = await User.findById(identifier);
//     }

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const posts = await Post.find({ user_id: user._id })
//       .populate("user_id", "name username profile_picture")
//       .sort({ created_at: -1 });

//     res.json({
//       success: true,
//       user: { _id: user._id, username: user.username, name: user.name },
//       posts,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Like post
// export const likePost = async (req, res) => {
//   try {
//     await PostLike.create({ post_id: req.params.id, user_id: req.user.id });
//     res.json({ success: true, message: "Post liked" });
//   } catch (err) {
//     if (err.code === 11000)
//       return res.status(400).json({ success: false, message: "Already liked" });
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Share post
// export const sharePost = async (req, res) => {
//   try {
//     await Share.create({ post_id: req.params.id, user_id: req.user.id });
//     res.json({ success: true, message: "Post shared" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Delete post (removes file too)
// export const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ success: false, message: "Post not found" });

//     if (post.user_id.toString() !== req.user.id)
//       return res.status(403).json({ success: false, message: "Unauthorized" });

//     // ✅ Delete file if it exists locally
//     if (post.media_url) {
//       const localPath = post.media_url.replace(`${req.protocol}://${req.get("host")}`, "");
//       const filePath = path.join(process.cwd(), localPath);
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     }

//     await PostLike.deleteMany({ post_id: post._id });
//     await Share.deleteMany({ post_id: post._id });
//     await Post.findByIdAndDelete(post._id);

//     res.json({ success: true, message: "Post deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



import fs from "fs";
import path from "path";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import Share from "../models/Share.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";

// ============================================================
// ✅ CREATE POST (Image / Video / Text)
// ============================================================
export const createPost = async (req, res) => {
  try {
    const { content = "", visibility = "public" } = req.body;

    // ❌ Reject if no content and no file
    if (!req.file && !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Either content or a file (image/video) is required",
      });
    }

    let media_type = null;
    let image_url = "";
    let video_url = "";

    // ✅ Handle uploaded file
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();

      // ✅ Determine media type and file path
      if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
        media_type = "video";
        video_url = `/uploads/videos/${req.file.filename}`;
      } else {
        media_type = "image";
        image_url = `/uploads/posts/${req.file.filename}`;
      }
    }

    // ✅ Full absolute URL
    if (image_url) {
      image_url = `${req.protocol}://${req.get("host")}${image_url}`;
    }
    if (video_url) {
      video_url = `${req.protocol}://${req.get("host")}${video_url}`;
    }

    // ✅ Save to database
    const post = await Post.create({
      user_id: req.user.id,
      content_text: content,
      media_type,
      image_url,
      video_url,
      visibility,
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: `${media_type === "video" ? "Video" : "Image"} post created successfully`,
      post,
    });
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ GET FEED (Logged-in user + Friends)
// ============================================================
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const visibility = req.query.visibility;

    const friends = await Friend.find({
      $or: [{ user_id: req.user.id }, { friend_id: req.user.id }],
    });

    const friendIds = friends.map(f =>
      f.user_id.toString() === req.user.id ? f.friend_id : f.user_id
    );

    const query = { user_id: { $in: [req.user.id, ...friendIds] } };
    if (visibility) query.visibility = visibility;

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate("user_id", "name username profile_picture")
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      total: totalPosts,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (err) {
    console.error("❌ Error fetching feed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ GET MY POSTS
// ============================================================
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.user.id })
      .populate("user_id", "name username profile_picture")
      .sort({ created_at: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ GET USER POSTS (by username or ID)
// ============================================================
export const getUserPosts = async (req, res) => {
  try {
    const { identifier } = req.params;

    let user = await User.findOne({ username: identifier });
    if (!user && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const posts = await Post.find({ user_id: user._id })
      .populate("user_id", "name username profile_picture")
      .sort({ created_at: -1 });

    res.json({
      success: true,
      user: { _id: user._id, username: user.username, name: user.name },
      posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ LIKE POST
// ============================================================
export const likePost = async (req, res) => {
  try {
    await PostLike.create({ post_id: req.params.id, user_id: req.user.id });
    res.json({ success: true, message: "Post liked" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: "Already liked" });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ SHARE POST
// ============================================================
export const sharePost = async (req, res) => {
  try {
    await Share.create({ post_id: req.params.id, user_id: req.user.id });
    res.json({ success: true, message: "Post shared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ DELETE POST
// ============================================================
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.user_id.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    // ✅ Delete local file if exists
    const fileUrl = post.image_url || post.video_url;
    if (fileUrl) {
      const relativePath = fileUrl.replace(`${req.protocol}://${req.get("host")}`, "");
      const filePath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await PostLike.deleteMany({ post_id: post._id });
    await Share.deleteMany({ post_id: post._id });
    await Post.findByIdAndDelete(post._id);

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
