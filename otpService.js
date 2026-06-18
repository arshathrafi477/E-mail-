const transporter = require("../config/mailer");
const generateOtp = require("../utils/generateOtp");

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;

// In-memory store: { email -> { otp, expiresAt, attempts } }
const otpStore = new Map();

const createAndSendOtp = async (email) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Replace any existing OTP for this email
  otpStore.set(email, { otp, expiresAt, attempts: 0 });

  await transporter.sendMail({
    from: `"Verify Your Account" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${otp}\n\nThis code expires in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you did not request this code, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="margin: 0 0 8px; color: #111;">Your Verification Code</h2>
        <p style="color: #555; margin: 0 0 24px;">Use the code below to verify your email address.</p>
        <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px; font-weight: 700; letter-spacing: 12px; color: #111;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px; margin: 0;">
          This code expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.<br>
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  return { otp, expiresAt };
};

const verifyOtp = async (email, submittedOtp) => {
  const record = otpStore.get(email);

  if (!record) {
    throw new Error("No OTP found for this email. Please request a new one.");
  }

  if (record.expiresAt < new Date()) {
    otpStore.delete(email);
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (record.otp !== submittedOtp) {
    record.attempts += 1;

    if (record.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(email);
      throw new Error("Too many incorrect attempts. Please request a new OTP.");
    }

    const remaining = MAX_ATTEMPTS - record.attempts;
    throw new Error(`Incorrect OTP. ${remaining} attempt(s) remaining.`);
  }

  // OTP matched — remove it immediately
  otpStore.delete(email);

  return { valid: true };
};

module.exports = { createAndSendOtp, verifyOtp };
