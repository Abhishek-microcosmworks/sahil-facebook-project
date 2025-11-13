// import Comment from "../models/Comment.js";
// import Reply from "../models/Reply.js";
// import CommentLike from "../models/CommentLike.js";

// export const addComment = async (req, res) => {
//   try {
//     const { post_id, text } = req.body;

//     const comment = await Comment.create({
//       post_id,
//       user_id: req.user.id,
//       text,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Comment added",
//       comment,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const addReply = async (req, res) => {
//   try {
//     const { comment_id, text } = req.body;

//     const reply = await Reply.create({
//       comment_id,
//       user_id: req.user.id,
//       text,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Reply added",
//       reply,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const likeComment = async (req, res) => {
//   try {
//     const comment_id = req.params.id;

//     await CommentLike.create({
//       comment_id,
//       user_id: req.user.id,
//     });

//     res.json({ success: true, message: "Comment liked" });
//   } catch (err) {
//     if (err.code === 11000)
//       return res.status(400).json({
//         success: false,
//         message: "Already liked",
//       });

//     res.status(500).json({ success: false, message: err.message });
//   }
// };


import Comment from "../models/Comment.js";
import Reply from "../models/Reply.js";
import CommentLike from "../models/CommentLike.js";
import fs from "fs";
import path from "path";

/* ============================================================
   ADD COMMENT
============================================================ */
export const addComment = async (req, res) => {
  try {
    const { post_id, text } = req.body;

    const comment = await Comment.create({
      post_id,
      user_id: req.user.id,
      text,
    });

    res.status(201).json({
      success: true,
      message: "Comment added",
      comment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   ADD REPLY
============================================================ */
export const addReply = async (req, res) => {
  try {
    const { comment_id, text } = req.body;

    const reply = await Reply.create({
      comment_id,
      user_id: req.user.id,
      text,
    });

    res.status(201).json({
      success: true,
      message: "Reply added",
      reply,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   LIKE COMMENT
============================================================ */
export const likeComment = async (req, res) => {
  try {
    const comment_id = req.params.id;

    await CommentLike.create({
      comment_id,
      user_id: req.user.id,
    });

    res.json({ success: true, message: "Comment liked" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({
        success: false,
        message: "Already liked",
      });

    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   REMOVE / UNLIKE COMMENT (SOFT DELETE LIKE)
============================================================ */
export const unlikeComment = async (req, res) => {
  try {
    const comment_id = req.params.id;

    const like = await CommentLike.findOneAndDelete({
      comment_id,
      user_id: req.user.id,
    });

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    res.json({
      success: true,
      message: "Comment unliked",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   SOFT DELETE COMMENT
============================================================ */
export const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;

    const comment = await Comment.findById(id);
    if (!comment)
      return res.status(404).json({ success: false, message: "Comment not found" });

    if (comment.user_id.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    // Soft delete
    comment.is_deleted = true;
    comment.deleted_at = new Date();
    comment.deleted_by = req.user.id;
    await comment.save();

    return res.json({
      success: true,
      message: "Comment deleted (soft delete)",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   SOFT DELETE REPLY
============================================================ */
export const deleteReply = async (req, res) => {
  try {
    const id = req.params.id;

    const reply = await Reply.findById(id);
    if (!reply)
      return res.status(404).json({ success: false, message: "Reply not found" });

    if (reply.user_id.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    // Soft delete
    reply.is_deleted = true;
    reply.deleted_at = new Date();
    reply.deleted_by = req.user.id;
    await reply.save();

    return res.json({
      success: true,
      message: "Reply deleted (soft delete)",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
