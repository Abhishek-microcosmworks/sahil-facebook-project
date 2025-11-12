import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  profile_picture: { type: String, default: "" },
  cover_photo: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date }
});

export default mongoose.model("User", userSchema);
