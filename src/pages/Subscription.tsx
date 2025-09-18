import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Plan {
  name: string;
  price: number;
  limit: number;
}

const plans: Plan[] = [
  { name: "Free", price: 0, limit: 1 },
  { name: "Bronze", price: 100, limit: 3 },
  { name: "Silver", price: 300, limit: 5 },
  { name: "Gold", price: 1000, limit: Infinity },
];

const Subscription: React.FC = () => {
  const { user, setSubscription } = useAuth();
  const navigate = useNavigate();

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [upiId, setUpiId] = useState<string>("");

  // ✅ Subscribe to a plan
  const handleSubscribe = (plan: Plan) => {
    if (plan.price === 0) {
      processSubscription(plan);
    } else {
      setSelectedPlan(plan);
      setShowPayment(true);
    }
  };

  // ✅ Process subscription (save plan in context)
  const processSubscription = (plan: Plan) => {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 30);

    setSubscription({
      plan: plan.name,
      limit: plan.limit,
      start: now.toLocaleString(),
      expiry: expiry.toLocaleString(),
      applied: 0,
    });

    alert(`✅ Payment Successful! You are subscribed to ${plan.name} Plan`);
    navigate("/profile");
  };

  // ✅ Open UPI app with given UPI ID
  const openUPIApp = (app: string) => {
    if (!selectedPlan) return;

    if (!upiId) {
      alert("⚠️ Please enter a valid UPI ID first!");
      return;
    }

    const amount = selectedPlan.price;
    const url = `upi://pay?pa=${upiId}&pn=ShiftMate&am=${amount}&cu=INR`;

    alert(`Redirecting to ${app} for ₹${amount} payment...`);

    // ✅ Redirect to UPI app
    window.location.href = url;

    // Mock payment success after 4 sec
    setTimeout(() => {
      processSubscription(selectedPlan);
    }, 4000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Choose Your Plan</h2>

        {user && (
  <p style={{ marginBottom: "1rem" }}>
    Logged in as: {user.email || "Unknown User"}
  </p>
)}


        <div className="plans">
          {plans.map((plan) => (
            <div key={plan.name} className="plan-card">
              <h3>{plan.name}</h3>
              <p>₹{plan.price}/month</p>
              <p>
                Apply Limit: {plan.limit === Infinity ? "Unlimited" : plan.limit}
              </p>
              <button
                className="auth-btn"
                onClick={() => handleSubscribe(plan)}
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Payment Modal */}
      {showPayment && (
        <div className="modal">
          <div className="modal-card">
            <h3>Complete Payment</h3>
            <p>
              Plan: {selectedPlan?.name} (₹{selectedPlan?.price})
            </p>

            {/* ✅ Enter Receiver UPI ID */}
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. abc@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
            />

            <div className="upi-apps">
              <p style={{ marginTop: "1rem" }}>Pay using:</p>
              <div className="upi-buttons">
                <button onClick={() => openUPIApp("PhonePe")}>📱 PhonePe</button>
                <button onClick={() => openUPIApp("Google Pay")}>💳 Google Pay</button>
                <button onClick={() => openUPIApp("Paytm")}>💰 Paytm</button>
                <button onClick={() => openUPIApp("BHIM")}>🏦 BHIM</button>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <button
                className="auth-btn"
                style={{ background: "gray", marginLeft: "0.5rem" }}
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
