import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

interface LanguageSwitcherProps {
  currentLang: string;
  setLang: (lang: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, setLang }) => {
  const { i18n } = useTranslation();
  const { generateOtp, verifyOtp } = useAuth();

  const [localEmail, setLocalEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSelect = (lang: string) => {
    if (lang === "fr") {
      if (!localEmail || !localEmail.includes("@")) {
        return alert("Please enter your email to receive OTP for French language.");
      }
      const code = generateOtp(localEmail); // still works, can be sync
      setOtpSent(true);
      alert(`(Demo) OTP sent to ${localEmail}: ${code}`);
      return;
    }
    i18n.changeLanguage(lang);
    setLang(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const confirmOtpAndSwitch = async () => {
    if (!otpInput) return alert("Enter OTP");

    const ok =  await verifyOtp(otpInput); // ✅ async handling
    if (ok) {
      i18n.changeLanguage("fr");
      setLang("fr");
      setOtpSent(false);
      setOtpInput("");
      localStorage.setItem("appLanguage", "fr");
      alert("Email verified. Language switched to French.");
    } else {
      alert("Incorrect OTP");
    }
  };

  return (
    <div className="language-switcher">
      <select
        value={currentLang}
        onChange={(e) => handleSelect(e.target.value)}
        className="language-dropdown"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="es">Español</option>
        <option value="pt">Português</option>
        <option value="zh">中文</option>
        <option value="fr">Français</option>
      </select>

      {otpSent && (
        <div className="otp-container">
          <input
            type="email"
            placeholder="Email (used for OTP)"
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
          />
          <button onClick={confirmOtpAndSwitch} className="btn">
            Verify
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
