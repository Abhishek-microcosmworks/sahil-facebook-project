import multer from "multer";
import path from "path";
import fs from "fs";

// Dynamic storage based on upload type
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (req.originalUrl.includes("/users/upload/profile")) {
      uploadPath = "uploads/profiles";
    } else if (req.originalUrl.includes("/users/upload/cover")) {
      uploadPath = "uploads/covers";
    } else if (req.originalUrl.includes("/posts/upload")) {
      uploadPath = "uploads/posts";
    } else {
      uploadPath = "uploads/others";
    }

    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpg, jpeg, png, gif)"));
    }
  },
});

export default upload;
