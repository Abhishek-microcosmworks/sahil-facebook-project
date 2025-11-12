import Joi from "joi";

export const updateUserValidation = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  profile_picture: Joi.string().optional(),
  cover_photo: Joi.string().optional(),
});
