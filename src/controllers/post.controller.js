import fs from "fs";
import path from "path";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import Share from "../models/Share.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js"; // ✅ For username lookup

// ✅ Upload post image
export const uploadPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const imagePath = `/uploads/posts/${req.file.filename}`;
    res.json({
      success: true,
      message: "Post image uploaded successfully",
      url: imagePath,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create post (with optional uploaded image)
export const createPost = async (req, res) => {
  try {
    const { content, visibility = "public", image_url = "" } = req.body;

    const post = await Post.create({
      user_id: req.user.id,
      content,
      image_url,
      visibility,
      created_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get feed (logged-in user + friends) with pagination and optional visibility filter
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const visibility = req.query.visibility;

    // 1️⃣ Get the current user's friends (bidirectional)
    const friends = await Friend.find({
      $or: [
        { user_id: req.user.id },
        { friend_id: req.user.id }
      ]
    });

    // 2️⃣ Extract friend IDs
    const friendIds = friends.map(f =>
      f.user_id.toString() === req.user.id ? f.friend_id : f.user_id
    );

    // 3️⃣ Create query: show posts from current user + friends
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
    console.error("Error fetching feed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all posts by the logged-in user
export const getMyPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const visibility = req.query.visibility;

    const query = { user_id: req.user.id };
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
    console.error("Error fetching my posts:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get posts of a specific user (by username or userId)
export const getUserPosts = async (req, res) => {
  try {
    const { identifier } = req.params; // can be username or userId
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 1️⃣ Try to find user by username first
    let user = await User.findOne({ username: identifier });
    if (!user && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // If not found by username, try as ObjectId
      user = await User.findById(identifier);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2️⃣ Get user's posts
    const totalPosts = await Post.countDocuments({ user_id: user._id });
    const posts = await Post.find({ user_id: user._id })
      .populate("user_id", "name username profile_picture")
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      user: { _id: user._id, username: user.username, name: user.name },
      total: totalPosts,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Like post
export const likePost = async (req, res) => {
  try {
    await PostLike.create({
      post_id: req.params.id,
      user_id: req.user.id,
    });

    res.json({ success: true, message: "Post liked" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Already liked" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Share post
export const sharePost = async (req, res) => {
  try {
    await Share.create({
      post_id: req.params.id,
      user_id: req.user.id,
    });

    res.json({ success: true, message: "Post shared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete a post (and its image)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this post" });
    }

    if (post.image_url) {
      const imagePath = path.join(process.cwd(), post.image_url);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await PostLike.deleteMany({ post_id: id });
    await Share.deleteMany({ post_id: id });
    await Post.findByIdAndDelete(id);

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
