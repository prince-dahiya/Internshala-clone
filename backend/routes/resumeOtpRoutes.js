const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/emailService");

let otpStore = {}; // Simple in-memory store (use DB/Redis in production)

// 📩 Send OTP
router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    await sendEmail(email, "Your Resume OTP", `Your OTP for resume creation is: ${otp}`);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ OTP send error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// ✅ Verify OTP
router.post("/verify", (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    if (otpStore[email] && otpStore[email] === otp) {
      delete otpStore[email]; // One-time use
      return res.json({ success: true, message: "OTP verified successfully" });
    }

    res.status(400).json({ success: false, message: "Invalid OTP" });
  } catch (err) {
    console.error("❌ OTP verify error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
