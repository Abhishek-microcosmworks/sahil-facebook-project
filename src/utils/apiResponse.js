export const success = (res, message, data = {}) => {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  };
  
  export const created = (res, message, data = {}) => {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  };
  
  export const error = (res, message, status = 500) => {
    return res.status(status).json({
      success: false,
      message,
    });
  };
  