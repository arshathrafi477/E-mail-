/**
 * Generates a cryptographically safe 6-digit OTP.
 * Falls back to Math.random() in environments without crypto.
 */
const generateOtp = () => {
  try {
    const { randomInt } = require("crypto");
    // randomInt(min, max) — max is exclusive, so 999999+1
    return randomInt(100000, 1000000).toString();
  } catch {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};

module.exports = generateOtp;
