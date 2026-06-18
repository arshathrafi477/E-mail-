const sendOtpSchema = (body) => {
  const { email } = body;

  if (!email || typeof email !== "string") {
    return "Email is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Please provide a valid email address.";
  }

  return null; // no error
};

module.exports = sendOtpSchema;
