const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/responseHandler");

/**
 * Protects routes that require a valid JWT.
 * Attach token in Authorization header: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Access denied. No token provided.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, "Session expired. Please log in again.", 401);
    }
    return sendError(res, "Invalid token.", 401);
  }
};

module.exports = { authMiddleware };
