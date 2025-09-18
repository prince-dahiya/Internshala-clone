import React, { useState } from "react";
import axios from "axios";

const Task2: React.FC = () => {
  const [input, setInput] = useState("");
  const [requestedToday, setRequestedToday] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  // ✅ Password Generator (Upper + Lower case letters only)
  const generatePassword = (length: number = 10) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // ✅ Handle reset request
  const handleRequest = async () => {
    if (requestedToday) {
      alert("⚠️ You can only request password reset once per day.");
      return;
    }

    if (!input.trim()) {
      alert("Please enter your email or phone number.");
      return;
    }

    try {
      const newPassword = generatePassword(12);

      // 🔗 Call backend API to reset password
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        identifier: input, // email or phone
        newPassword,
      });

      setGeneratedPassword(newPassword);
      setRequestedToday(true);

      alert("✅ Password has been reset and sent to your email/phone.");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      <p className="subtitle">Task 2: Reset password via email or phone</p>

      <div className="forgot-card">
        <input
          type="text"
          placeholder="Enter your email or phone"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleRequest}>Request Reset</button>
      </div>

      {generatedPassword && (
        <div className="result-card">
          <h3>✅ New Password Generated</h3>
          <p className="password-box">{generatedPassword}</p>
          <small>Please copy and save it securely.</small>
        </div>
      )}
    </div>
  );
};

export default Task2;
