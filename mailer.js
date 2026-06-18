const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your real password)
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("❌ Mailer config error:", error.message);
  } else {
    console.log("✅ Mailer ready");
  }
});

module.exports = transporter;
