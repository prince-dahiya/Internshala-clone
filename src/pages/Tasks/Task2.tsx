import React, { useState } from "react";
import axios from "axios";

const Task2: React.FC = () => {
  const [input, setInput] = useState("");
  const [requestedToday, setRequestedToday] = useState(false);

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
      // 🔗 Call backend API to reset password (backend will generate & send)
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        identifier: input, // email or phone
      });

      setRequestedToday(true);
      alert("✅ A new password has been sent to your email/phone.");
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
          placeholder="Enter your email "
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleRequest}>Request Reset</button>
      </div>
    </div>
  );
};

export default Task2;
