import User from "../models/User.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await User.create({
    ...data,
    password: hashedPassword,
  });
};

export const findUserByEmailOrUsername = async (usernameOrEmail) => {
  return await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  });
};

export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
