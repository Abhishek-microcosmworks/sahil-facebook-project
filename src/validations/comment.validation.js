import Joi from "joi";

export const addCommentValidation = Joi.object({
  post_id: Joi.string().required(),
  text: Joi.string().trim().min(1).max(500).required(),
});

export const addReplyValidation = Joi.object({
  comment_id: Joi.string().required(),
  text: Joi.string().trim().min(1).max(500).required(),
});
