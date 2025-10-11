import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("displayName") || null
  );

  // If logged in via backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");

    if (loggedIn && !user) {
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          setUser(data);
          window.history.replaceState({}, document.title, "/");
        })
        .catch((e) => console.log("user fetch failed", e));
    }
  }, [user]);

  const handleLogin = (name) => {
    setDisplayName(name);
    localStorage.setItem("displayName", name);
    if (!user) {
      // redirect to Google login
      window.location.href = `${BACKEND_URL}/auth/google`;
    }
  };

  const handleLogout = () => {
    fetch(`${BACKEND_URL}/logout`, { credentials: "include" })
      .then(() => {
        setUser(null);
        setDisplayName(null);
        localStorage.removeItem("displayName");
      })
      .catch(console.error);
  };

  if (!displayName) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard user={user || { displayName }} onLogout={handleLogout} />;
}
