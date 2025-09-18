import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./i18n"; // i18n setup
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Internships from "./pages/Internships";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Hackathons from "./pages/Hackathons";
import Ideas from "./pages/Ideas";
import { ApplicationProvider } from "./pages/ApplicationContext";

// Task imports
import Task1 from "./pages/Tasks/Task1";
import Task2 from "./pages/Tasks/Task2";
import Task4Resume from "./pages/Tasks/Task4Resume";
import Task6 from "./pages/Tasks/Task6";  // ✅ NEW

import Subscription from "./pages/Subscription";
import { useTranslation } from "react-i18next";

import "./App.css";

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [languageChosen, setLanguageChosen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en"); // default

  // Always ask for language on app start
  useEffect(() => {
    setLanguageChosen(false); // ensures language screen appears on fresh start
  }, []);

  const handleLanguageSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    setLanguageChosen(true);
  };

  // Show language selection screen first
  if (!languageChosen) {
    return (
      <div className="language-screen">
        <h1>Select Your Language</h1>
        <div className="language-options">
          <button onClick={() => handleLanguageSelect("en")} className="btn">
            English
          </button>
          <button onClick={() => handleLanguageSelect("hi")} className="btn">
            हिंदी
          </button>
          <button onClick={() => handleLanguageSelect("fr")} className="btn">
            Français
          </button>
          <button onClick={() => handleLanguageSelect("es")} className="btn">
            Español
          </button>
          <button onClick={() => handleLanguageSelect("pt")} className="btn">
            Português
          </button>
          <button onClick={() => handleLanguageSelect("zh")} className="btn">
            中文
          </button>
        </div>
      </div>
    );
  }

  return (
    <ApplicationProvider>
      <div className="app-container">
        <Navbar currentLang={currentLang} setLang={setCurrentLang} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/profile" element={<Profile />} />

            {/* Tasks */}
            <Route path="/task1" element={<Task1 />} />
            <Route path="/task2" element={<Task2 />} />
            <Route path="/task4resume" element={<Task4Resume />} />
            <Route path="/task6" element={<Task6 />} /> {/* ✅ NEW */}

            {/* Subscription */}
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </main>
        <Footer currentLang={currentLang} />
      </div>
    </ApplicationProvider>
  );
};

export default App;
