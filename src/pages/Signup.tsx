import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from "@react-oauth/google"; // ✅ Google login

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [otp, setOtp] = useState("");
  const [requireOtp, setRequireOtp] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // backend login
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://intershala-backend-m43m.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful! Now logging in...");

      const loggedIn = await login(formData.email, formData.password);

      if (!loggedIn) {
        setRequireOtp(true); // OTP required → show OTP input bar
      } else {
        alert("Signup & Login successful!");
        navigate("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Error signing up");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedIn = await login(formData.email, formData.password, otp);
      if (loggedIn) {
        alert("Signup & Login successful!");
        navigate("/");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      alert("Error verifying OTP");
    }
  };

  // ✅ Google login handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch("https://intershala-backend-m43m.onrender.com/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("Google Signup & Login successful!");
        navigate("/");
      } else {
        alert(data.message || "Google signup failed");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      alert("Error with Google signup");
    }
  };

  const handleGoogleError = () => {
    alert("Google signup failed. Please try again.");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t("create_account") as string}</h2>

        {/* Signup form */}
        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder={t("full_name") as string}
            value={formData.name}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t("email") as string}
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder={t("phone") as string}
            value={formData.phone}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder={t("password") as string}
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            required
          />

          {/* ✅ Show OTP input bar only when OTP is required */}
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

          <button
            type={requireOtp ? "button" : "submit"}
            onClick={requireOtp ? handleVerifyOtp : undefined}
            className="auth-btn"
          >
            {requireOtp ? "Verify OTP" : (t("signup") as string)}
          </button>
        </form>

        {/* ✅ Google login button */}
        {!requireOtp && (
          <div style={{ marginTop: "1rem" }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        )}

        <p className="auth-footer">
          {t("already_have_account") as string}{" "}
          <a href="/login">{t("login_here") as string}</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
