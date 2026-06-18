/**
 * Standardised JSON response helpers.
 * All API responses follow: { success, message, data? }
 */

const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(Object.keys(data).length > 0 && { data }),
  });
};

const sendError = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { sendSuccess, sendError };
