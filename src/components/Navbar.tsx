import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "../pages/Tasks/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  currentLang: string;
  setLang: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ currentLang, setLang }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="logo">Clone-APP</div>
      <div className="nav-links">
        <Link to="/">{t("home")}</Link>
        <Link to="/jobs">{t("jobs")}</Link>
        <Link to="/internships">{t("internships")}</Link>
        <Link to="/hackathons">{t("hackathons")}</Link>
        <Link to="/ideas">{t("ideas")}</Link>
        <Link to="/profile">{t("profile")}</Link>

        {/* Signing Dropdown */}
        <div className="dropdown">
          <span className="dropbtn">{t("Signing")} ▾</span>
          <div className="dropdown-content">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </div>

        {/* ✅ Language Switcher */}
        <LanguageSwitcher currentLang={currentLang} setLang={setLang} />

        {/* ✅ Tasks Dropdown */}
        <div className="dropdown">
          <span className="dropbtn">{t("tasks")} ▾</span>
          <div className="dropdown-content">
            <Link to="/task1">Task 1</Link>
            <Link to="/task2">Task 2</Link>
            
            {user && <Link to="/task4resume">Task 4 - {t("resume_creator")}</Link>}
            
            {user && <Link to="/task6">Task 6</Link>}
            <Link to="/subscription">{t("subscription")}</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
