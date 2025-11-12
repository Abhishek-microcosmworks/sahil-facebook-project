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

// // ✅ Get all users (admin or debugging)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json({ success: true, users });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Upload profile picture
// export const uploadProfilePicture = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // ✅ Delete old profile picture if exists
//     if (user.profile_picture) {
//       const oldPath = path.join(process.cwd(), user.profile_picture);
//       if (fs.existsSync(oldPath)) {
//         fs.unlinkSync(oldPath);
//       }
//     }

//     // ✅ Save new image path
//     const imagePath = `/uploads/profiles/${req.file.filename}`;
//     user.profile_picture = imagePath;
//     await user.save();

//     res.json({
//       success: true,
//       message: "Profile picture updated successfully",
//       profile_picture: imagePath,
//     });
//   } catch (error) {
//     console.error("Error updating profile picture:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ Upload cover photo
// export const uploadCoverPhoto = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // ✅ Delete old cover photo if exists
//     if (user.cover_photo) {
//       const oldPath = path.join(process.cwd(), user.cover_photo);
//       if (fs.existsSync(oldPath)) {
//         fs.unlinkSync(oldPath);
//       }
//     }

//     // ✅ Save new image path
//     const imagePath = `/uploads/covers/${req.file.filename}`;
//     user.cover_photo = imagePath;
//     await user.save();

//     res.json({
//       success: true,
//       message: "Cover photo updated successfully",
//       cover_photo: imagePath,
//     });
//   } catch (error) {
//     console.error("Error updating cover photo:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import fs from "fs";
import path from "path";
import User from "../models/User.js";

// ✅ Get own profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update profile info
export const updateProfile = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, data, { new: true }).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Search users
export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q || "";
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    }).select("name username profile_picture");

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all users (for admin or debugging)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ✅ Upload or Replace Profile Picture
// ============================================================
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🧹 Delete old profile picture if exists
    if (user.profile_picture) {
      const oldPath = path.join(process.cwd(), user.profile_picture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // ✅ Save new image path (uploads/users)
    const imagePath = `/uploads/users/${req.file.filename}`;
    user.profile_picture = imagePath;
    await user.save();

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      user: {
        name: user.name,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// ✅ Upload or Replace Cover Photo
// ============================================================
export const uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🧹 Delete old cover photo if exists
    if (user.cover_photo) {
      const oldPath = path.join(process.cwd(), user.cover_photo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // ✅ Save new image path (uploads/users)
    const imagePath = `/uploads/users/${req.file.filename}`;
    user.cover_photo = imagePath;
    await user.save();

    res.json({
      success: true,
      message: "Cover photo updated successfully",
      user: {
        name: user.name,
        cover_photo: user.cover_photo,
      },
    });
  } catch (error) {
    console.error("Error updating cover photo:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
