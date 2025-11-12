import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import Share from "../models/Share.js";

export const createPost = async (data) => {
  return await Post.create(data);
};

export const getAllPosts = async () => {
  return await Post.find()
    .populate("user_id", "name username profile_picture")
    .sort({ created_at: -1 });
};

export const likePost = async (post_id, user_id) => {
  return await PostLike.create({
    post_id,
    user_id,
  });
};

export const sharePost = async (post_id, user_id) => {
  return await Share.create({
    post_id,
    user_id,
  });
};
