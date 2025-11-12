import Comment from "../models/Comment.js";
import Reply from "../models/Reply.js";
import CommentLike from "../models/CommentLike.js";

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
