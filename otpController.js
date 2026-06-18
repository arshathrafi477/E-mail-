const { createAndSendOtp, verifyOtp } = require("../services/otpService");
const jwt = require("jsonwebtoken");
const sendOtpSchema = require("../validators/sendOtp");
const verifyOtpSchema = require("../validators/verifyOtp");
const { sendSuccess, sendError } = require("../utils/responseHandler");

// In-memory user store: Set of verified emails
const verifiedUsers = new Set();

// POST /api/send-otp
const sendOtp = async (req, res, next) => {
  try {
    const validationError = sendOtpSchema(req.body);
    if (validationError) return sendError(res, validationError, 422);

    const email = req.body.email.trim().toLowerCase();
    await createAndSendOtp(email);

    return sendSuccess(res, "OTP sent successfully. Check your inbox.");
  } catch (err) {
    next(err);
  }
};

// POST /api/verify-otp
const verifyOtpHandler = async (req, res, next) => {
  try {
    const validationError = verifyOtpSchema(req.body);
    if (validationError) return sendError(res, validationError, 422);

    const email = req.body.email.trim().toLowerCase();
    const otp = req.body.otp.trim();

    await verifyOtp(email, otp);

    const isNewUser = !verifiedUsers.has(email);
    verifiedUsers.add(email);

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return sendSuccess(
      res,
      isNewUser ? "Account created successfully." : "Logged in successfully.",
      { token, email }
    );
  } catch (err) {
    if (err.message.includes("OTP") || err.message.includes("expired") || err.message.includes("attempts")) {
      return sendError(res, err.message, 400);
    }
    next(err);
  }
};

module.exports = { sendOtp, verifyOtpHandler };
