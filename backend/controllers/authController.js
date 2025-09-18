import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import { sendOTP } from "../utils/emailService.js";
import { detectDevice } from "../utils/deviceDetector.js";

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Request OTP
export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    await sendOTP(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Save login history
    const { device, browser, os } = detectDevice(req);
    await LoginHistory.create({
      user: user._id,
      ip: req.ip,
      device,
      browser,
      os
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
