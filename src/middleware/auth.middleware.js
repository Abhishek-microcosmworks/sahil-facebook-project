import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logError } from "../utils/logger.js";
import { generateErrorId } from "../utils/errorId.js";

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // 🚫 Missing Token
    if (!header || !header.startsWith("Bearer ")) {
      const error_id = generateErrorId();
      const error_code = "401 Unauthorized";

      logError({
        error_id,
        error_code,
        message: "Missing Bearer token",
        method: req.method,
        route: req.originalUrl,
        status: 401
      });

      return res.status(401).json({
        success: false,
        error_id,
        error_code,
        message: "Authentication required",
      });
    }

    const token = header.split(" ")[1];

    // 🚫 Invalid Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      const error_id = generateErrorId();
      const error_code = "401 Unauthorized";

      logError({
        error_id,
        error_code,
        message: "Invalid or expired token",
        method: req.method,
        route: req.originalUrl,
        status: 401,
        token
      });

      return res.status(401).json({
        success: false,
        error_id,
        error_code,
        message: "Invalid or expired token",
      });
    }

    // 🚫 User Not Found
    const user = await User.findById(decoded.id);
    if (!user) {
      const error_id = generateErrorId();
      const error_code = "401 Unauthorized";

      logError({
        error_id,
        error_code,
        message: "User not found for token",
        method: req.method,
        route: req.originalUrl,
        status: 401,
        userId: decoded.id
      });

      return res.status(401).json({
        success: false,
        error_id,
        error_code,
        message: "Invalid or expired token",
      });
    }

    // 🎉 Success
    req.user = {
      id: user._id,
      email: user.email,
      username: user.username
    };

    next();

  } catch (err) {
    const error_id = generateErrorId();
    const error_code = "500 Internal Server Error";

    logError({
      error_id,
      error_code,
      message: err.message,
      stack: err.stack,
      method: req.method,
      route: req.originalUrl,
      status: 500
    });

    return res.status(500).json({
      success: false,
      error_id,
      error_code,
      message: "Unauthorized",
    });
  }
};

export default auth;
