import { logError } from "../utils/logger.js";
import { generateErrorId } from "../utils/errorId.js";

export const notFound = (req, res) => {
  const error_id = generateErrorId();
  const error_code = "404 Not Found";

  logError({
    error_id,
    error_code,
    message: "Route not found",
    method: req.method,
    route: req.originalUrl,
    status: 404
  });

  return res.status(404).json({
    success: false,
    error_id,
    error_code,
    message: "Route not found"
  });
};
