import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("displayName") || ""
  );
  const [loading, setLoading] = useState(true);

  // Check if redirected from Google login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");

    if (loggedIn) {
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          setUser(data);
          window.history.replaceState({}, document.title, "/");
        })
        .catch((e) => console.log("user fetch failed", e))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (name) => {
    setDisplayName(name);
    localStorage.setItem("displayName", name);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleLogout = () => {
    fetch(`${BACKEND_URL}/logout`, { credentials: "include" })
      .then(() => {
        setUser(null);
        setDisplayName("");
        localStorage.removeItem("displayName");
      })
      .catch(console.error);
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 80 }}>Loading...</div>;

  // Show Login if no displayName or user not logged in yet
  if (!displayName || !user) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard user={{ ...user, displayName }} onLogout={handleLogout} />;
}
