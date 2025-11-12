import Joi from "joi";

export const friendRequestValidation = Joi.object({
  receiver_id: Joi.string().required(),
});
