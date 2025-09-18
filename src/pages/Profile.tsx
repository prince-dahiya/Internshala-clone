import React, { useEffect } from "react";
import { useApplication } from "./ApplicationContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile: React.FC = () => {
  const { applications } = useApplication();
  const { user, subscription, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  // Redirect to login if user is null
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ✅ Safe display name logic
  const displayName =
    user && typeof user === "object"
      ? user.name || user.email || t("guest")
      : typeof user === "string"
      ? user
      : t("guest");

  return (
    <div className="profile-container">
      <h2 className="profile-title">
        {t("welcome")} {displayName}
      </h2>

      {/* ✅ Logout button */}
      <button onClick={handleLogout} className="profile-logout-btn">
        {t("logout")}
      </button>

      {/* Subscription details */}
      {subscription ? (
        <div className="profile-subscription-card">
          <h3>{t("subscription_title")}</h3>
          <p>
            {t("plan")}: {subscription.plan}
          </p>
          <p>
            {t("applications_limit")}: {subscription.limit}
          </p>
          <p>
            {t("start_date")}: {subscription.start}
          </p>
          <p>
            {t("expiry_date")}: {subscription.expiry}
          </p>
        </div>
      ) : (
        <p>{t("no_active_subscription")}</p>
      )}

      {applications.length === 0 ? (
        <p>{t("no_applications")}</p>
      ) : (
        <div className="profile-applications-list">
          {applications.map((app, index) => (
            <div key={index} className="profile-application-card">
              <h3>{app.title}</h3>
              <p>
                {t("type")}: {app.type}
              </p>
              {app.company && (
                <p>
                  {t("company")}: {app.company}
                </p>
              )}
              {app.date && (
                <p>
                  {t("date")}: {app.date}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
