// src/App.jsx
import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage first
    const localName = localStorage.getItem("displayName");
    if (localName) {
      setUser({ displayName: localName });
      return;
    }

    // If redirected after Google login
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");
    if (loggedIn && !user) {
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          // Use displayName from Google profile
          const name = data.displayName || data.emails?.[0]?.value?.split("@")[0] || "User";
          localStorage.setItem("displayName", name);
          setUser({ displayName: name });
          window.history.replaceState({}, document.title, "/");
        })
        .catch(console.error);
    }
  }, []);

  return user ? <Dashboard user={user} /> : <Login onLogin={setUser} />;
}
