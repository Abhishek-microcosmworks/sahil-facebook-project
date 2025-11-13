// // import express from "express";
// // import auth from "../middleware/auth.middleware.js";
// // import { uploadPostFile } from "../middleware/upload.middleware.js";
// // import {
// //   createPost,
// //   getPosts,
// //   getMyPosts,
// //   getUserPosts,
// //   likePost,
// //   sharePost,
// //   deletePost
// // } from "../controllers/post.controller.js";

// // const router = express.Router();

// // // ✅ Create post (with image/video directly)
// // router.post("/", auth, uploadPostFile.single("file"), createPost);

// // // ✅ Get feed, own posts, user posts
// // router.get("/", auth, getPosts);
// // router.get("/me", auth, getMyPosts);
// // router.get("/user/:identifier", auth, getUserPosts);

// // // ✅ Like, Share, Delete
// // router.post("/:id/like", auth, likePost);
// // router.post("/:id/share", auth, sharePost);
// // router.delete("/:id", auth, deletePost);

// // export default router;

// import express from "express";
// import auth from "../middleware/auth.middleware.js";
// import { uploadPostFile } from "../middleware/upload.middleware.js";
// import {
//   createPost,
//   getPosts,
//   getMyPosts,
//   getUserPosts,
//   likePost,
//   sharePost,
//   deletePost,
// } from "../controllers/post.controller.js";
// import { restorePost } from "../controllers/post.controller.js";



// const router = express.Router();

// // ✅ Create post with image (uses same controller)
// router.post("/create/image", auth, uploadPostFile.single("file"), createPost);

// // ✅ Create post with video (same controller, detects type automatically)
// router.post("/create/video", auth, uploadPostFile.single("file"), createPost);

// // ✅ Feed and profile routes
// router.get("/", auth, getPosts);
// router.get("/me", auth, getMyPosts);
// router.get("/user/:identifier", auth, getUserPosts);

// // ✅ Like, Share, Delete
// router.post("/:id/like", auth, likePost);
// router.post("/:id/share", auth, sharePost);
// router.delete("/:id", auth, deletePost);

// // Restore post
// router.patch("/:id/restore", auth, restorePost);

// export default router;

import express from "express";
import auth from "../middleware/auth.middleware.js";
import { uploadPostFile } from "../middleware/upload.middleware.js";
import {
  createPost,
  getPosts,
  getMyPosts,
  getUserPosts,
  likePost,
  unlikePost,
  sharePost,
  deletePost,
  restorePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create/image", auth, uploadPostFile.single("file"), createPost);
router.post("/create/video", auth, uploadPostFile.single("file"), createPost);

router.get("/", auth, getPosts);
router.get("/me", auth, getMyPosts);
router.get("/user/:identifier", auth, getUserPosts);

router.post("/:id/like", auth, likePost);
router.delete("/:id/unlike", auth, unlikePost);

router.post("/:id/share", auth, sharePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/restore", auth, restorePost);

export default router;
