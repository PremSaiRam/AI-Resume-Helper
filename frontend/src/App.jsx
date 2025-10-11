// src/App.jsx
import React, { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser && savedUser.displayName) {
      setUser(savedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    // Redirect to backend logout to clear session
    window.location.href = "https://ai-resume-helper-35j6.onrender.com/logout";
  };

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <Login onLogin={setUser} />
  );
}
