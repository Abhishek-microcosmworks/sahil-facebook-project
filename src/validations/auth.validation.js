import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

export const loginValidation = Joi.object({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required(),
});
