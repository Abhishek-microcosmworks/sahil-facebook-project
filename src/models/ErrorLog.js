import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema({
  error_id: { type: String, required: true },
  error_code: { type: String, required: true },
  message: { type: String, required: true },
  route: String,
  method: String,
  status: Number,
  stack: String,
  time: { type: Date, default: Date.now },

  // SOFT DELETE SUPPORT
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null }
});

export default mongoose.model("ErrorLog", errorLogSchema);
