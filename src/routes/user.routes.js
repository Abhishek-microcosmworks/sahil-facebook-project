// import express from "express";
// import auth from "../middleware/auth.middleware.js";
// import validate from "../middleware/validate.middleware.js";
// import upload from "../middleware/upload.middleware.js";
// import { updateUserValidation } from "../validations/user.validation.js";
// import {
//   getProfile,
//   updateProfile,
//   searchUsers,
//   getAllUsers,
//   uploadProfilePicture,
//   uploadCoverPhoto,
// } from "../controllers/user.controller.js";

// const router = express.Router();

// // ✅ List all users
// router.get("/", getAllUsers);

// // ✅ Get my profile
// router.get("/me", auth, getProfile);

// // ✅ Update profile info
// router.put("/update", auth, validate(updateUserValidation), updateProfile);

// // ✅ Search users
// router.get("/search", auth, searchUsers);

// // ✅ Upload profile picture
// router.post("/upload/profile", auth, upload.single("file"), uploadProfilePicture);

// // ✅ Upload cover photo
// router.post("/upload/cover", auth, upload.single("file"), uploadCoverPhoto);

// export default router;


// import express from "express";
// import auth from "../middleware/auth.middleware.js";
// import validate from "../middleware/validate.middleware.js";
// import { uploadUserImage } from "../middleware/upload.middleware.js";  // ✅ CHANGED
// import { updateUserValidation } from "../validations/user.validation.js";
// import {
//   getProfile,
//   updateProfile,
//   searchUsers,
//   getAllUsers,
//   uploadProfilePicture,
//   uploadCoverPhoto,
// } from "../controllers/user.controller.js";

// const router = express.Router();

// router.get("/", getAllUsers);
// router.get("/me", auth, getProfile);
// router.put("/update", auth, validate(updateUserValidation), updateProfile);
// router.get("/search", auth, searchUsers);

// // ✅ Use user image-specific middleware
// router.post("/upload/profile", auth, uploadUserImage.single("file"), uploadProfilePicture);
// router.post("/upload/cover", auth, uploadUserImage.single("file"), uploadCoverPhoto);

// export default router;
import express from "express";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { uploadUserImage, uploadPostFile } from "../middleware/upload.middleware.js";
import { updateUserValidation } from "../validations/user.validation.js";
import {
  getProfile,
  updateProfile,
  searchUsers,
  getAllUsers,
  uploadProfilePicture,
  uploadCoverPhoto,
} from "../controllers/user.controller.js";
import { restoreAccount } from "../controllers/user.controller.js";



const router = express.Router();

router.get("/", getAllUsers);
router.get("/me", auth, getProfile);
router.put("/update", auth, validate(updateUserValidation), updateProfile);
router.get("/search", auth, searchUsers);
router.patch("/restore", auth, restoreAccount);

// ✅ Profile & Cover uploads (Images only)
router.post("/upload/profile", auth, uploadUserImage.single("file"), uploadProfilePicture);
router.post("/upload/cover", auth, uploadUserImage.single("file"), uploadCoverPhoto);

// ✅ Universal upload (Images or Videos)
router.post("/upload", auth, uploadPostFile.single("file"), (req, res) => {
    console.log("📸 Uploaded File Info:", req.file); // <--- add this line
  
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
  
    const isVideo = req.file.mimetype.startsWith("video");
    const filePath = isVideo
      ? `/uploads/videos/${req.file.filename}`
      : `/uploads/posts/${req.file.filename}`;
  
    res.json({
      success: true,
      message: "File uploaded successfully",
      type: isVideo ? "video" : "image",
      url: filePath,
    });
  });

export default router;