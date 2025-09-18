const express = require("express");
const router = express.Router();
const User = require("../models/User");
const useragent = require("useragent");
const { sendEmail } = require("../utils/emailService"); // ✅ fixed import

// Temporary OTP store (in real project, use Redis or DB)
const otpStore = {};

router.post("/", async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Extract user agent details
    const agent = useragent.parse(req.headers["user-agent"]);
    const browser = agent.family;
    const os = agent.os.family;
    const deviceType = /mobile/i.test(req.headers["user-agent"]) ? "Mobile" : "Desktop";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Chrome requires OTP
    if (browser.toLowerCase().includes("chrome")) {
      // If OTP not provided yet → send it
      if (!otp) {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = newOtp;
        await sendEmail(user.email, "Your Chrome OTP", `Your OTP is: ${newOtp}`);
        return res.json({ requireOtp: true, message: "OTP sent to email (Chrome login)" });
      }

      // Verify OTP
      if (otp !== otpStore[email]) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      delete otpStore[email]; // OTP used → remove
    }

    // Mobile restriction (10 AM – 1 PM only)
    if (deviceType === "Mobile") {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 10 || hours >= 13) {
        return res.status(403).json({ message: "Mobile login allowed only between 10 AM - 1 PM" });
      }
    }

    // Save login history
    user.loginHistory.push({ ip, browser, os, deviceType });
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      user: { email: user.email },
      token: "dummy-jwt-token", // Replace with real JWT later
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
