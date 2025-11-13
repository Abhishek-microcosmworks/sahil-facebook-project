import fs from "fs";
import path from "path";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import Share from "../models/Share.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";
import { logError } from "../utils/logger.js";

// ============================================================
// CREATE POST (unchanged)
// ============================================================
export const createPost = async (req, res) => {
  try {
    const { content = "", visibility = "public" } = req.body;

    if (!req.file && !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Either content or a file is required",
      });
    }

    let media_type = null;
    let image_url = "";
    let video_url = "";

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();

      if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
        media_type = "video";
        video_url = `/uploads/videos/${req.file.filename}`;
      } else {
        media_type = "image";
        image_url = `/uploads/posts/${req.file.filename}`;
      }
    }

    if (image_url) {
      image_url = `${req.protocol}://${req.get("host")}${image_url}`;
    }
    if (video_url) {
      video_url = `${req.protocol}://${req.get("host")}${video_url}`;
    }

    const post = await Post.create({
      user_id: req.user.id,
      content_text: content,
      media_type,
      image_url,
      video_url,
      visibility,
    });

    return res.status(201).json({
      success: true,
      message: `${media_type === "video" ? "Video" : "Image"} post created successfully`,
      post,
    });

  } catch (err) {
    logError({ error_code: "CREATE_POST_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// GET FEED (exclude soft deleted posts)
// ============================================================
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const friends = await Friend.find({
      $or: [{ user_id: req.user.id }, { friend_id: req.user.id }],
    });

    const friendIds = friends.map(f =>
      f.user_id.toString() === req.user.id ? f.friend_id : f.user_id
    );

    const query = {
      user_id: { $in: [req.user.id, ...friendIds] },
      is_deleted: false,
    };

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
    logError({ error_code: "GET_POSTS_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// GET MY POSTS (exclude deleted)
// ============================================================
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user_id: req.user.id,
      is_deleted: false
    })
      .populate("user_id", "name username profile_picture")
      .sort({ created_at: -1 });

    res.json({ success: true, posts });

  } catch (err) {
    logError({ error_code: "MY_POSTS_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// GET USER POSTS (exclude deleted)
// ============================================================
export const getUserPosts = async (req, res) => {
  try {
    const { identifier } = req.params;

    let user = await User.findOne({ username: identifier, is_deleted: false });

    if (!user && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findOne({ _id: identifier, is_deleted: false });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const posts = await Post.find({
      user_id: user._id,
      is_deleted: false
    })
      .populate("user_id", "name username profile_picture")
      .sort({ created_at: -1 });

    res.json({
      success: true,
      user: { _id: user._id, username: user.username, name: user.name },
      posts,
    });

  } catch (err) {
    logError({ error_code: "USER_POSTS_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ LIKE POST
// ============================================================
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
export const likePost = async (req, res) => {
  try {
    const existingLike = await PostLike.findOne({
      post_id: req.params.id,
      user_id: req.user.id,
    });

    if (existingLike && !existingLike.is_deleted) {
      return res.status(400).json({
        success: false,
        message: "Already liked",
      });
    }

    if (existingLike && existingLike.is_deleted) {
      // Restore soft deleted like
      existingLike.is_deleted = false;
      existingLike.deleted_at = null;
      await existingLike.save();

      return res.json({
        success: true,
        message: "Like restored",
      });
    }

    // Create new like
    await PostLike.create({
      post_id: req.params.id,
      user_id: req.user.id,
    });

    return res.json({
      success: true,
      message: "Post liked",
    });

  } catch (err) {
    logError({ error_code: "LIKE_POST_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// unlike a post

export const unlikePost = async (req, res) => {
  try {
    const like = await PostLike.findOne({
      post_id: req.params.id,
      user_id: req.user.id,
      is_deleted: false,
    });

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    like.is_deleted = true;
    like.deleted_at = new Date();
    await like.save();

    return res.json({
      success: true,
      message: "Like removed (soft delete)",
    });

  } catch (err) {
    logError({ error_code: "UNLIKE_POST_ERROR", message: err.message });
    return res.status(500).json({ success: false, message: err.message });
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
// SOFT DELETE POST  (NOT permanent delete)
// ============================================================
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      is_deleted: false,
    });

    if (!post)
      return res.status(404).json({ success: false, message: "Post not found or deleted" });

    if (post.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // SOFT DELETE
    post.is_deleted = true;
    post.deleted_at = new Date();
    await post.save();

    // OPTIONAL: Delete the physical file (your choice)
    /*
    const fileUrl = post.image_url || post.video_url;
    if (fileUrl) {
      const relativePath = fileUrl.replace(`${req.protocol}://${req.get("host")}`, "");
      const filePath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    */

    res.json({ success: true, message: "Post deleted (soft delete)" });

  } catch (err) {
    logError({ error_code: "DELETE_POST_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};


// ============================================================
// ✅ RESTORE POST (Soft deleted)
// ============================================================
export const restorePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user_id: req.user.id,
      is_deleted: true
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No deleted post found to restore",
      });
    }

    post.is_deleted = false;
    post.deleted_at = null;
    await post.save();

    return res.json({
      success: true,
      message: "Post restored successfully",
      post
    });

  } catch (err) {
    logError({ error_code: "RESTORE_POST_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};
