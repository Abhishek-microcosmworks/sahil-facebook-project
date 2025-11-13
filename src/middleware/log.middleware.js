import { logSuccess } from "../utils/logger.js";

export const successLogger = (req, res, next) => {
  const oldJson = res.json;

  res.json = function (data) {
    // Log only if success = true
    if (data?.success === true) {
      logSuccess({
        method: req.method,
        route: req.originalUrl,
        user: req.user?.id || null,
        status: res.statusCode,
        response: data,
      });
    }

    return oldJson.call(this, data);
  };

  next();
};
