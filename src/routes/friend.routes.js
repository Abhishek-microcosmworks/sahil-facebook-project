// import express from "express";
// import { sendRequest, acceptRequest, getFriends } from "../controllers/friend.controller.js";
// import auth from "../middleware/auth.middleware.js";

// const router = express.Router();

// // Send friend request
// router.post("/request", auth, sendRequest);

// // Accept a friend request
// router.post("/accept/:id", auth, acceptRequest);

// // Get user's friend list
// router.get("/", auth, getFriends);

// export default router;


import express from "express";
import auth from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";
import { sendRequest, acceptRequest, getFriends } from "../controllers/friend.controller.js";
import { friendRequestValidation } from "../validations/friend.validation.js";

const router = express.Router();

router.post("/request", auth, validate(friendRequestValidation), sendRequest);
router.post("/accept/:id", auth, acceptRequest);
router.get("/", auth, getFriends);

export default router;
