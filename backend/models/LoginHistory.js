import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ip: String,
  device: String,
  browser: String,
  os: String,
  loginTime: { type: Date, default: Date.now }
});

export default mongoose.model("LoginHistory", loginHistorySchema);
