/**
 * Global error handler — must be registered LAST in Express.
 * Catches anything passed to next(err).
 */
const errorMiddleware = (err, req, res, next) => {
  console.error("❌ Unhandled error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({ success: false, message: messages[0] });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate entry." });
  }

  // Nodemailer / SMTP error
  if (err.code === "EAUTH" || err.responseCode === 535) {
    return res.status(502).json({
      success: false,
      message: "Email service error. Please contact support.",
    });
  }

  // Generic fallback
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again."
      : err.message;

  res.status(statusCode).json({ success: false, message });
};

module.exports = { errorMiddleware };
