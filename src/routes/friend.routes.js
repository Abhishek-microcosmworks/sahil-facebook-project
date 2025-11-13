
// import express from "express";
// import auth from "../middleware/auth.middleware.js";

// import validate from "../middleware/validate.middleware.js";
// import { sendRequest, acceptRequest, getFriends } from "../controllers/friend.controller.js";
// import { friendRequestValidation } from "../validations/friend.validation.js";

// const router = express.Router();

// router.post("/request", auth, validate(friendRequestValidation), sendRequest);
// router.post("/accept/:id", auth, acceptRequest);
// router.get("/", auth, getFriends);

// export default router;


import express from "express";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  sendRequest,
  acceptRequest,
  deleteFriendRequest,
  unfriend,
  getFriends
} from "../controllers/friend.controller.js";

import { friendRequestValidation } from "../validations/friend.validation.js";

const router = express.Router();

// Send request
router.post("/request", auth, validate(friendRequestValidation), sendRequest);

// Accept request
router.post("/accept/:id", auth, acceptRequest);

// Soft delete friend request
router.delete("/request/:id", auth, deleteFriendRequest);

// Unfriend
router.delete("/unfriend/:id", auth, unfriend);

// Get friends list (exclude deleted)
router.get("/", auth, getFriends);

export default router;
