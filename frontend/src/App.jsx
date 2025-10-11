// src/App.jsx
import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

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
        .catch((e) => console.log("User fetch failed", e));
    }
  }, [user]);

  return user ? <Dashboard user={user} /> : <Login />;
}
