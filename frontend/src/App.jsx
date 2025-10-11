// src/App.jsx
import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(localStorage.getItem("displayName") || "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");
    if (loggedIn) {
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          setUser({ ...data, displayName });
          window.history.replaceState({}, document.title, "/");
        })
        .catch(console.log);
    }
  }, [displayName]);

  const handleLoginName = (name) => setDisplayName(name);

  if (user) return <Dashboard user={user} />;

  return <Login onLoginName={handleLoginName} />;
}
