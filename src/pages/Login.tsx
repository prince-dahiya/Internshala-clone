import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [requireOtp, setRequireOtp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call backend login
    const success = await login(email, password, otp);

    if (success) {
      // ✅ Login OK → navigate
      navigate("/profile");
    } else {
      // ❌ Login failed or OTP required
      setRequireOtp(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t("LOGIN") as string}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder={t("email") as string}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder={t("password") as string}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          {/* Show OTP only if backend requested it */}
          {requireOtp && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="auth-input"
              required
            />
          )}

          <button type="submit" className="auth-btn">
            {requireOtp ? "Verify OTP & Login" : (t("login") as string)}
          </button>
        </form>

        <p className="auth-footer">
          <a href="/task2">{t("forgot_password") as string}</a>
        </p>

        <p className="auth-footer">
          {t("new_here") as string} <a href="/signup">{t("create_account") as string}</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
