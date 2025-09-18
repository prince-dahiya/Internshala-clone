import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SubscriptionType {
  plan: string;
  limit: number | string;
  start: string;
  expiry: string;
  applied: number;
}

export interface ResumeType {
  id: number;
  name: string;
  qualification: string;
  experience: string;
  personalDetails: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  photo: string;
  generatedAt: string;
}

interface AuthContextType {
  user: any;
  login: (email: string, password: string, otp?: string) => Promise<boolean>;
  logout: () => void;

  subscription: SubscriptionType | null;
  setSubscription: (sub: SubscriptionType | null) => void;

  resumes: ResumeType[];
  setResumes: React.Dispatch<React.SetStateAction<ResumeType[]>>;

  language: string;
  setLanguage: (lang: string) => void;

  /** OTP for *language switch to French* (not login) */
  otpVerified: boolean;
  generateOtp: (email: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;

  /** Google sign-in */
  googleLogin: (credential: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "null"));
  const [subscription, setSubscription] = useState<SubscriptionType | null>(
    JSON.parse(localStorage.getItem("subscription") || "null")
  );
  const [resumes, setResumes] = useState<ResumeType[]>(
    JSON.parse(localStorage.getItem("resumes") || "[]")
  );
  const [language, setLanguageState] = useState<string>(localStorage.getItem("language") || "en");

  /** OTP gate specifically for switching to French */
  const [otpVerified, setOtpVerified] = useState<boolean>(
    JSON.parse(localStorage.getItem("otpVerified") || "false")
  );

  // ---- persist ----
  useEffect(() => localStorage.setItem("user", JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem("subscription", JSON.stringify(subscription)), [subscription]);
  useEffect(() => localStorage.setItem("resumes", JSON.stringify(resumes)), [resumes]);
  useEffect(() => localStorage.setItem("language", language), [language]);
  useEffect(() => localStorage.setItem("otpVerified", JSON.stringify(otpVerified)), [otpVerified]);

  const getToken = () => localStorage.getItem("token") || "";

  // ---- Auth (backend) ----
  const login = async (email: string, password: string, otp?: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
      });
      const data = await res.json();

      if (data.requireOtp) {
        // backend sent login OTP; caller should collect & retry with otp
        alert("OTP sent to your email. Please enter it to continue.");
        return false;
      }

      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser({ email: data.user.email, token: data.token });
        // NOTE: do NOT set otpVerified here — it's only for French switch
        return true;
      }

      alert(data.message || "Login failed");
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const googleLogin = async (credential: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser({ email: data.user.email, token: data.token });
        return true;
      }

      alert(data.message || "Google login failed");
      return false;
    } catch (err) {
      console.error("Google login error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    setResumes([]);
    setOtpVerified(false);
    setLanguageState("en");
    localStorage.removeItem("user");
    localStorage.removeItem("subscription");
    localStorage.removeItem("resumes");
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("language");
    localStorage.removeItem("token");
  };

  const setLanguage = (lang: string) => {
    // UI should block the change to 'fr' until OTP verified;
    // this setter stays dumb by design (task wants OTP in the UI flow)
    setLanguageState(lang);
  };

  // ---- OTP for French language switch ----
  const generateOtp = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/language-otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken() ? `Bearer ${getToken()}` : "",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("OTP sent to your email. Please enter it to confirm switching to French.");
        return true;
      }
      alert(data.message || "Failed to send OTP");
      return false;
    } catch (err) {
      console.error("Generate OTP error:", err);
      alert("Failed to send OTP");
      return false;
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/language-otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken() ? `Bearer ${getToken()}` : "",
        },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpVerified(true);
        return true;
      }
      alert(data.message || "Invalid OTP");
      return false;
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Error verifying OTP");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        subscription,
        setSubscription,
        resumes,
        setResumes,
        language,
        setLanguage,
        otpVerified,          // used by LanguageSwitcher to gate French
        generateOtp,          // send OTP email for French switch
        verifyOtp,            // verify that OTP
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
