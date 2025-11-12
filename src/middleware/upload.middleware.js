// // import multer from "multer";
// // import path from "path";
// // import fs from "fs";

// // // ✅ Ensure the folder exists before saving files
// // const ensureFolder = (folder) => {
// //   if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
// // };

// // // =============================================================
// // // 1️⃣ USER IMAGE UPLOAD (Profile, Cover) — Only Images
// // // =============================================================
// // const userImageStorage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const folder = "uploads/users";
// //     ensureFolder(folder);
// //     cb(null, folder);
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// //     cb(null, uniqueSuffix + path.extname(file.originalname));
// //   },
// // });

// // const userImageFilter = (req, file, cb) => {
// //   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
// //   if (allowed.includes(file.mimetype)) cb(null, true);
// //   else cb(new Error("Only image files are allowed for profile/cover"), false);
// // };

// // // ✅ Named export for user image upload
// // export const uploadUserImage = multer({
// //   storage: userImageStorage,
// //   fileFilter: userImageFilter,
// // });

// // // =============================================================
// // // 2️⃣ POST FILE UPLOAD (Images + Videos)
// // // =============================================================
// // const postFileStorage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const ext = path.extname(file.originalname).toLowerCase();
// //     let folder = "uploads/posts";
// //     if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) folder = "uploads/videos";
// //     ensureFolder(folder);
// //     cb(null, folder);
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// //     cb(null, uniqueSuffix + path.extname(file.originalname));
// //   },
// // });

// // const postFileFilter = (req, file, cb) => {
// //   const allowed = [
// //     "image/jpeg", "image/png", "image/jpg", "image/webp",
// //     "video/mp4", "video/mov", "video/avi", "video/mkv",
// //   ];
// //   if (allowed.includes(file.mimetype)) cb(null, true);
// //   else cb(new Error("Only image or video files are allowed for posts"), false);
// // };

// // // ✅ Named export for post (image/video) upload
// // export const uploadPostFile = multer({
// //   storage: postFileStorage,
// //   fileFilter: postFileFilter,
// //   limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
// // });

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // 🧩 Helper: ensure directory exists
// const ensureDir = (folder) => fs.mkdirSync(folder, { recursive: true });

// // =============================================================
// // ✅ 1. For USER uploads (profile & cover) — Images only
// // =============================================================
// const userStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = "uploads/users";
//     ensureDir(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

// const userFileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only image files are allowed for profile/cover uploads"), false);
// };

// export const uploadUserImage = multer({
//   storage: userStorage,
//   fileFilter: userFileFilter,
// });

// // =============================================================
// // ✅ 2. For POST uploads (image or video)
// // =============================================================
// const postStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let folder = "uploads/posts";
//     const ext = path.extname(file.originalname).toLowerCase();
//     if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) folder = "uploads/videos";
//     ensureDir(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

// const postFileFilter = (req, file, cb) => {
//   const allowed = [
//     "image/jpeg", "image/png", "image/jpg", "image/webp",
//     "video/mp4", "video/mov", "video/avi", "video/mkv"
//   ];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only image or video files are allowed for posts"), false);
// };

// export const uploadPostFile = multer({
//   storage: postStorage,
//   fileFilter: postFileFilter,
//   limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
// });


import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧩 Helper to ensure directory exists
const ensureDir = (folder) => fs.mkdirSync(folder, { recursive: true });

// // ✅ Base upload folder (inside src)
// const BASE_UPLOAD_DIR = path.join(__dirname, "../../uploads");

// 🧩 Base upload directory → OUTSIDE src
const BASE_UPLOAD_DIR = path.join(__dirname, "../../uploads");

// =============================================================
// 1️⃣ USER UPLOADS (profile / cover) — Only Images
// =============================================================
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(BASE_UPLOAD_DIR, "users");
    ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const userFileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed for profile/cover uploads"), false);
};

export const uploadUserImage = multer({
  storage: userStorage,
  fileFilter: userFileFilter,
});

// =============================================================
// 2️⃣ POST UPLOADS (image or video)
// =============================================================
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let folder = path.join(BASE_UPLOAD_DIR, "posts");

    if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
      folder = path.join(BASE_UPLOAD_DIR, "videos");
    }

    ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const postFileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg", "image/png", "image/jpg", "image/webp",
    "video/mp4", "video/mov", "video/avi", "video/mkv",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image or video files are allowed for posts"), false);
};

export const uploadPostFile = multer({
  storage: postStorage,
  fileFilter: postFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
