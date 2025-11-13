
// import fs from "fs";
// import path from "path";
// import User from "../models/User.js";

// // ✅ Get own profile
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json({ success: true, user });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Update profile info
// export const updateProfile = async (req, res) => {
//   try {
//     const data = req.body;
//     const user = await User.findByIdAndUpdate(req.user.id, data, { new: true }).select("-password");

//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       user,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Search users
// export const searchUsers = async (req, res) => {
//   try {
//     const q = req.query.q || "";
//     const users = await User.find({
//       $or: [
//         { username: { $regex: q, $options: "i" } },
//         { name: { $regex: q, $options: "i" } },
//       ],
//     }).select("name username profile_picture");

//     res.json({ success: true, users });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Get all users (for admin or debugging)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json({ success: true, users });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ============================================================
// // ✅ Upload or Replace Profile Picture
// // ============================================================
// export const uploadProfilePicture = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // 🧹 Delete old profile picture if exists
//     if (user.profile_picture) {
//       const oldPath = path.join(process.cwd(), user.profile_picture);
//       if (fs.existsSync(oldPath)) {
//         fs.unlinkSync(oldPath);
//       }
//     }

//     // ✅ Save new image path (uploads/users)
//     const imagePath = `/uploads/users/${req.file.filename}`;
//     user.profile_picture = imagePath;
//     await user.save();

//     res.json({
//       success: true,
//       message: "Profile picture updated successfully",
//       user: {
//         name: user.name,
//         profile_picture: user.profile_picture,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating profile picture:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ============================================================
// // ✅ Upload or Replace Cover Photo
// // ============================================================
// export const uploadCoverPhoto = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // 🧹 Delete old cover photo if exists
//     if (user.cover_photo) {
//       const oldPath = path.join(process.cwd(), user.cover_photo);
//       if (fs.existsSync(oldPath)) {
//         fs.unlinkSync(oldPath);
//       }
//     }

//     // ✅ Save new image path (uploads/users)
//     const imagePath = `/uploads/users/${req.file.filename}`;
//     user.cover_photo = imagePath;
//     await user.save();

//     res.json({
//       success: true,
//       message: "Cover photo updated successfully",
//       user: {
//         name: user.name,
//         cover_photo: user.cover_photo,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating cover photo:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// src/controllers/user.controller.js
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import { logError } from "../utils/logger.js";

// ============================================================
// ✅ Get own profile (soft delete safe)
// ============================================================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      is_deleted: false
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Account not found or deleted" });
    }

    res.json({ success: true, user });
  } catch (err) {
    logError({ error_code: "USER_PROFILE_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ Update profile info (only if not deleted)
// ============================================================
export const updateProfile = async (req, res) => {
  try {
    const data = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user.id, is_deleted: false },
      data,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Account is deleted" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    logError({ error_code: "UPDATE_PROFILE_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ Soft delete user account
// ============================================================
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, is_deleted: false },
      { is_deleted: true, deleted_at: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account already deleted",
      });
    }

    // ⚠️ Files preserved (not removed)
    // If you want to delete files also, uncomment lines below:

    /*
    if (user.profile_picture) {
      const filepath = path.join(process.cwd(), user.profile_picture);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
    if (user.cover_photo) {
      const filepath = path.join(process.cwd(), user.cover_photo);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
    */

    res.json({
      success: true,
      message: "Account deleted (soft delete)",
    });
  } catch (err) {
    logError({ error_code: "DELETE_ACCOUNT_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ Search users (exclude deleted)
// ============================================================
export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q || "";

    const users = await User.find({
      is_deleted: false,
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    }).select("name username profile_picture");

    res.json({ success: true, users });
  } catch (err) {
    logError({ error_code: "SEARCH_USER_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ Get all users (hidden deleted users)
// ============================================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ is_deleted: false }).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    logError({ error_code: "GET_ALL_USERS_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// Upload Profile Picture / Cover Photo (unchanged except soft-delete check)
// ============================================================
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const user = await User.findOne({
      _id: req.user.id,
      is_deleted: false
    });

    if (!user) return res.status(404).json({ success: false, message: "Account deleted" });

    // Delete old picture (optional)
    if (user.profile_picture) {
      const oldPath = path.join(process.cwd(), user.profile_picture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const imagePath = `/uploads/users/${req.file.filename}`;
    user.profile_picture = imagePath;
    await user.save();

    res.json({
      success: true,
      message: "Profile picture updated",
      user: {
        name: user.name,
        profile_picture: user.profile_picture,
      },
    });

  } catch (error) {
    logError({ error_code: "UPLOAD_PROFILE_PIC_ERR", message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const user = await User.findOne({
      _id: req.user.id,
      is_deleted: false
    });

    if (!user) return res.status(404).json({ success: false, message: "Account deleted" });

    if (user.cover_photo) {
      const oldPath = path.join(process.cwd(), user.cover_photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const imagePath = `/uploads/users/${req.file.filename}`;
    user.cover_photo = imagePath;
    await user.save();

    res.json({
      success: true,
      message: "Cover photo updated",
      user: {
        name: user.name,
        cover_photo: user.cover_photo,
      },
    });

  } catch (error) {
    logError({ error_code: "UPLOAD_COVER_ERR", message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// ✅ RESTORE USER ACCOUNT
// ============================================================
export const restoreAccount = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      is_deleted: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No deleted account found to restore",
      });
    }

    user.is_deleted = false;
    user.deleted_at = null;
    await user.save();

    return res.json({
      success: true,
      message: "Account restored successfully",
    });

  } catch (err) {
    logError({ error_code: "RESTORE_ACCOUNT_ERROR", message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
};
