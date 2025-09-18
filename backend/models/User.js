const mongoose = require("mongoose");

const loginRecordSchema = new mongoose.Schema({
  browser: String,
  os: String,
  deviceType: String,
  ip: String,
  time: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  tempOtp: String,
  loginHistory: [loginRecordSchema],
});

module.exports = mongoose.model("User", userSchema);
