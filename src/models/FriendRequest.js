// import mongoose from "mongoose";

// const friendRequestSchema = new mongoose.Schema({
//   sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
//   created_at: { type: Date, default: Date.now }
// });

// export default mongoose.model("FriendRequest", friendRequestSchema);


import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null },

  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("FriendRequest", friendRequestSchema);
