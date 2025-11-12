import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import commentRoutes from "./comment.routes.js";
import friendRoutes from "./friend.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/friends", friendRoutes);

router.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Facebook Backend API is running 🚀",
      docs: "/docs",
      health: "/api/health",
    });
  });

router.get("/health", (req, res) => {
    res.json({
      success: true,
      message: "API is running ✅"
    });
  });

export default router;
