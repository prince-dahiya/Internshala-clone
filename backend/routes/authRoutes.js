const express = require("express");
const router = express.Router();
const User = require("../models/User");
const useragent = require("useragent");
const { sendEmail } = require("../utils/emailService");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ----------------- SIGNUP -----------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, phone, loginHistory: [] });
    await newUser.save();

    res.status(201).json({ success: true, message: "Signup successful", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ----------------- LOGIN -----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Extract agent details
    const agent = useragent.parse(req.headers["user-agent"]);
    const browser = agent.family;
    const os = agent.os.family;
    const deviceType = /mobile/i.test(req.headers["user-agent"]) ? "Mobile" : "Desktop";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Case 1: Chrome requires OTP
    if (browser.toLowerCase().includes("chrome") && !otp) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      try {
        user.tempOtp = otpCode; // save OTP in DB
        await user.save();
        await sendEmail(user.email, "Your Chrome OTP", `Your OTP is: ${otpCode}`);
        return res.json({ success: false, requireOtp: true, message: "OTP sent successfully" });
      } catch (err) {
        console.error("❌ OTP email error:", err);
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
      }
    }

    // Case 2: Verify OTP for Chrome
    if (browser.toLowerCase().includes("chrome") && otp) {
      if (otp !== user.tempOtp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }
      user.tempOtp = null; // clear OTP once used
      await user.save();
    }

    // Mobile restriction (only 10AM - 1PM)
    if (deviceType === "Mobile") {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 10 || hours >= 13) {
        return res.status(403).json({
          success: false,
          message: "Mobile login allowed only between 10AM - 1PM",
        });
      }
    }

    // Save login history
    user.loginHistory.push({ ip, browser, os, deviceType, time: new Date() });
    await user.save();

    // JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });

    res.json({ success: true, message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login error", error: err.message });
  }
});

// ----------------- LOGIN HISTORY -----------------
router.get("/login-history", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json(user.loginHistory || []);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching history", error: err.message });
  }
});

// ----------------- GOOGLE SIGNUP/LOGIN -----------------
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body; // ✅ match frontend now

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "", // no password for Google accounts
        photo: picture,
        loginHistory: [],
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });

    res.json({ success: true, message: "Google login successful", token: jwtToken, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Google login error", error: err.message });
  }
});

// ----------------- FORGOT PASSWORD -----------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { identifier } = req.body; // email or phone

    if (!identifier) {
      return res.status(400).json({ success: false, message: "Email or phone is required" });
    }

    const user =
      (await User.findOne({ email: identifier })) ||
      (await User.findOne({ phone: identifier }));

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Check last reset time (1 per day)
    if (user.lastPasswordReset) {
      const last = new Date(user.lastPasswordReset);
      const now = new Date();
      const diffHours = Math.abs(now.getTime() - last.getTime()) / 36e5; // hours
      if (diffHours < 24) {
        return res.status(429).json({
          success: false,
          message: "⚠️ Password reset already requested today. Try again tomorrow.",
        });
      }
    }

    // ✅ Generate new password (only upper/lowercase)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Save new password + reset timestamp
    user.password = newPassword; // 🔐 ideally hash this
    user.lastPasswordReset = new Date();
    await user.save();

    // Send via email (if email available)
    if (user.email) {
      await sendEmail(user.email, "Password Reset", `Your new password is: ${newPassword}`);
    }

    res.json({ success: true, message: "Password reset successful. Check your email/phone." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
