import express from "express";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  uploadPostImage,
  createPost,
  getPosts,
  getMyPosts,       // ✅ new import
  getUserPosts,     // ✅ new import
  likePost,
  sharePost,
  deletePost
} from "../controllers/post.controller.js";

const router = express.Router();

// ✅ Upload image for post (use key: "image" in Postman)
router.post("/upload", auth, upload.single("image"), uploadPostImage);

// ✅ Create new post
router.post("/", auth, createPost);

// ✅ Feed: logged-in user + friends
router.get("/", auth, getPosts);

// ✅ Get my own posts
router.get("/me", auth, getMyPosts);

// ✅ Get posts of a specific user (by username or userId)
router.get("/user/:identifier", auth, getUserPosts);

// ✅ Like a post
router.post("/:id/like", auth, likePost);

// ✅ Share a post
router.post("/:id/share", auth, sharePost);

// ✅ Delete a post
router.delete("/:id", auth, deletePost);

export default router;
