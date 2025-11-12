import Comment from "../models/Comment.js";
import Reply from "../models/Reply.js";
import CommentLike from "../models/CommentLike.js";

export const addComment = async (data) => {
  return await Comment.create(data);
};

export const addReply = async (data) => {
  return await Reply.create(data);
};

export const likeComment = async (comment_id, user_id) => {
  return await CommentLike.create({
    comment_id,
    user_id,
  });
};
