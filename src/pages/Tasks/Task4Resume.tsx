import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Task4Resume.css"; // ✅ import new css

const RAZORPAY_KEY_PLACEHOLDER = "YOUR_RAZORPAY_KEY"; 
const PRICE_RUPEES = 50;
const API_BASE = "http://localhost:5000";

const Task4Resume: React.FC = () => {
  const { user, resumes, setResumes } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    qualification: "",
    experiences: [""], // ✅ array for multiple experiences
    personalDetails: "",
    linkedIn: "",
    github: "",
    portfolio: "",
  });
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resumeHtml, setResumeHtml] = useState<string | null>(null);

  const onChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const handleExperienceChange = (i: number, v: string) => {
    const updated = [...form.experiences];
    updated[i] = v;
    setForm((s) => ({ ...s, experiences: updated }));
  };

  const addExperience = () => {
    setForm((s) => ({ ...s, experiences: [...s.experiences, ""] }));
  };

  const handlePhoto = (file?: File | null) => {
    if (!file) return setPhotoDataUrl("");
    const reader = new FileReader();
    reader.onload = (e) => setPhotoDataUrl(String(e.target?.result || ""));
    reader.readAsDataURL(file);
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    if (!form.personalDetails.includes("@")) {
      alert("Enter a valid email in Personal Details.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/resume-otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.personalDetails }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setOtpSent(true);
      setOtpVerified(false);
      setEnteredOtp("");
      alert("✅ OTP sent to your email");
    } catch (err) {
      console.error(err);
      alert("❌ Could not send OTP. Try again.");
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    if (!otpSent) return alert("Request OTP first.");
    if (!enteredOtp.trim()) return alert("Enter OTP.");
    try {
      const res = await fetch(`${API_BASE}/api/resume-otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.personalDetails,
          otp: enteredOtp,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        setOtpSent(false); // ✅ hide OTP input after success
        alert("✅ OTP verified. You can now pay ₹50 to generate your resume.");
      } else {
        alert("❌ Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Verification failed. Try again.");
    }
  };

  // ✅ Razorpay script loader
  const loadRazorpayScript = () =>
    new Promise<void>((resolve, reject) => {
      if ((window as any).Razorpay) return resolve();
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay SDK failed to load."));
      document.body.appendChild(script);
    });

  // ✅ Start Payment
  const startPayment = async () => {
    if (!otpVerified) {
      alert("Verify email first via OTP.");
      return;
    }
    try {
      await loadRazorpayScript();
    } catch {
      alert("Unable to load payment SDK.");
      return;
    }

    const options = {
      key: RAZORPAY_KEY_PLACEHOLDER,
      amount: PRICE_RUPEES * 100,
      currency: "INR",
      name: "ShiftMate",
      description: `Resume generation - ${form.name}`,
      handler: function () {
        generateAndSaveResume();
      },
      prefill: { name: form.name, email: form.personalDetails },
      modal: { ondismiss: () => console.log("Payment modal closed") },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // ✅ Generate resume
  const generateAndSaveResume = () => {
    setGenerating(true);

    const expHtml = form.experiences
      .filter((e) => e.trim())
      .map((e) => `<li>${e.replace(/\n/g, "<br/>")}</li>`) // ✅ preserve line breaks inside textarea
      .join("");

    const html = `
      <div class="resume-preview">
        <h1>${form.name}</h1>
        <p>${form.qualification}</p>
        <h3>Experience</h3>
        <ul>
          ${expHtml}
        </ul>
        <hr/>
        <h3>Personal Details</h3>
        <p>${form.personalDetails}</p>
        ${form.linkedIn ? `<p>LinkedIn: ${form.linkedIn}</p>` : ""}
        ${form.github ? `<p>GitHub: ${form.github}</p>` : ""}
        ${form.portfolio ? `<p>Portfolio: ${form.portfolio}</p>` : ""}
      </div>
    `;

    const resumeObj = {
      id: Date.now(),
      name: form.name,
      qualification: form.qualification,
      experience: form.experiences.join(", "),   // ✅ keep for type safety
      experiences: form.experiences,             // ✅ new array field
      personalDetails: form.personalDetails,
      linkedIn: form.linkedIn,
      github: form.github,
      portfolio: form.portfolio,
      photo: photoDataUrl,
      generatedAt: new Date().toLocaleString(),
    };

    setResumes([...resumes, resumeObj]);
    setResumeHtml(html);
    setGenerating(false);
    alert("✅ Resume generated & saved to your profile.");
  };

  return (
    <div className="resume-container">
      <h2>Resume Creator (Task 4)</h2>

      {!user && (
        <div className="login-warning">
          Login required. <button onClick={() => navigate("/login")}>Login</button>
        </div>
      )}

      <div className="card">
        <label>Full Name</label>
        <input
          className="auth-input"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
        />

        <label>Qualification</label>
        <input
          className="auth-input"
          value={form.qualification}
          onChange={(e) => onChange("qualification", e.target.value)}
        />

        <label>Experience(s)</label>
        {form.experiences.map((exp, i) => (
          <textarea
            key={i}
            className="auth-input"
            placeholder={`Experience ${i + 1}`}
            value={exp}
            onChange={(e) => handleExperienceChange(i, e.target.value)}
          />
        ))}
        <button className="small-btn" onClick={addExperience}>
          + Add More
        </button>

        <label>Email (for OTP)</label>
        <input
          className="auth-input"
          value={form.personalDetails}
          onChange={(e) => onChange("personalDetails", e.target.value)}
        />

        <label>LinkedIn (optional)</label>
        <input
          className="auth-input"
          value={form.linkedIn}
          onChange={(e) => onChange("linkedIn", e.target.value)}
        />

        <label>GitHub (optional)</label>
        <input
          className="auth-input"
          value={form.github}
          onChange={(e) => onChange("github", e.target.value)}
        />

        <label>Portfolio (optional)</label>
        <input
          className="auth-input"
          value={form.portfolio}
          onChange={(e) => onChange("portfolio", e.target.value)}
        />

        <label>Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handlePhoto(e.target.files?.[0])}
        />
      </div>

      <div className="card">
        <h3>1) Email verification (OTP)</h3>
        <button className="auth-btn" onClick={sendOtp}>
          Send OTP
        </button>
        {otpSent && !otpVerified && (
          <div className="otp-box">
            <input
              className="auth-input"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
            />
            <button className="auth-btn" onClick={verifyOtp}>
              Verify OTP
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h3>2) Pay ₹50 to generate resume</h3>
        <button
          className="auth-btn"
          onClick={startPayment}
          disabled={!otpVerified}
        >
          Pay ₹50 & Generate Resume
        </button>
        {!otpVerified && (
          <div className="note">Verify email first to enable payment.</div>
        )}
      </div>

      {generating && <div>Generating resume…</div>}

      {resumeHtml && (
        <div className="card preview-card">
          <h3>Resume Preview</h3>
          <div
            className="resume-scroll"
            dangerouslySetInnerHTML={{ __html: resumeHtml }}
          />
          <button
            className="auth-btn"
            onClick={() => {
              const blob = new Blob([resumeHtml], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${form.name.replace(/\s+/g, "_")}_resume.html`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download HTML
          </button>
        </div>
      )}
    </div>
  );
};

export default Task4Resume;
