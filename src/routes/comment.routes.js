import express from "express";
import {
  addComment,
  addReply,
  likeComment,
  unlikeComment,
  deleteComment,
  deleteReply
} from "../controllers/comment.controller.js";

import auth from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  addCommentValidation,
  addReplyValidation,
} from "../validations/comment.validation.js";

const router = express.Router();

router.post("/", auth, validate(addCommentValidation), addComment);
router.post("/reply", auth, validate(addReplyValidation), addReply);
router.post("/:id/like", auth, likeComment);
router.delete("/:id/unlike", auth, unlikeComment);

router.delete("/:id", auth, deleteComment);       // Soft delete comment
router.delete("/reply/:id", auth, deleteReply);   // Soft delete reply

export default router;
