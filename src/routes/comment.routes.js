// import express from "express";
// import { addComment, addReply, likeComment } from "../controllers/comment.controller.js";
// import auth from "../middleware/auth.middleware.js";

// const router = express.Router();

// // Add a comment
// router.post("/", auth, addComment);

// // Add a reply
// router.post("/reply", auth, addReply);

// // Like a comment
// router.post("/:id/like", auth, likeComment);

// export default router;


import express from "express";
// import auth from "../middleware/auth.middleware.js";
// import validate from "../middleware/validate.middleware.js";
// import { addComment, addReply, likeComment } from "../controllers/comment.controller.js";
// import { addCommentValidation, addReplyValidation } from "../validations/comment.validation.js";

// const router = express.Router();

// router.post("/", auth, validate(addCommentValidation), addComment);
// router.post("/reply", auth, validate(addReplyValidation), addReply);
// router.post("/:id/like", auth, likeComment);

// export default router;


import { addComment, addReply, likeComment } from "../controllers/comment.controller.js";
import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { addCommentValidation, addReplyValidation } from "../validations/comment.validation.js";

const router = express.Router();

router.post("/", auth, validate(addCommentValidation), addComment);
router.post("/reply", auth, validate(addReplyValidation), addReply);
router.post("/:id/like", auth, likeComment);

export default router;

