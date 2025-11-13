import { logError } from "../utils/logger.js";
import { generateErrorId } from "../utils/errorId.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  const error_id = generateErrorId();
  const error_code = `${status} ${errorMessage}`;

  const payload = {
    error_id,
    error_code,
    message: errorMessage,
    method: req.method,
    route: req.originalUrl,
    status,
    user: req.user?.id || null,
    body: req.body,
    stack: status >= 500 ? err.stack : undefined
  };

  logError(payload);

  return res.status(status).json({
    success: false,
    error_id,
    error_code,
    message: errorMessage,
  });
};
