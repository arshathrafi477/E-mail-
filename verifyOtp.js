const verifyOtpSchema = (body) => {
  const { email, otp } = body;

  if (!email || typeof email !== "string") {
    return "Email is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Please provide a valid email address.";
  }

  if (!otp || typeof otp !== "string") {
    return "OTP is required.";
  }

  if (!/^\d{6}$/.test(otp.trim())) {
    return "OTP must be a 6-digit number.";
  }

  return null; // no error
};

module.exports = verifyOtpSchema;
