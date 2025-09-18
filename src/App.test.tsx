import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // ✅ import provider
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>   {/* ✅ Wrap the app inside AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
