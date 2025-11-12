import express from "express";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { updateUserValidation } from "../validations/user.validation.js";
import {
  getProfile,
  updateProfile,
  searchUsers,
  getAllUsers,
  uploadProfilePicture,
  uploadCoverPhoto,
} from "../controllers/user.controller.js";

const router = express.Router();

// ✅ List all users
router.get("/", getAllUsers);

// ✅ Get my profile
router.get("/me", auth, getProfile);

// ✅ Update profile info
router.put("/update", auth, validate(updateUserValidation), updateProfile);

// ✅ Search users
router.get("/search", auth, searchUsers);

// ✅ Upload profile picture
router.post("/upload/profile", auth, upload.single("file"), uploadProfilePicture);

// ✅ Upload cover photo
router.post("/upload/cover", auth, upload.single("file"), uploadCoverPhoto);

export default router;
