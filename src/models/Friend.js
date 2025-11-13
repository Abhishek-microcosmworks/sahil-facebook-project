// import mongoose from "mongoose";

// const friendSchema = new mongoose.Schema({
//   user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   friend_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   created_at: { type: Date, default: Date.now }
// });

// export default mongoose.model("Friend", friendSchema);

import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  friend_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null },

  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Friend", friendSchema);
