import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [askName, setAskName] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");
    const needName = params.get("ask_name");

    if (loggedIn || needName) {
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          if (!data.displayName) {
            setAskName(true);
          } else {
            localStorage.setItem("displayName", data.displayName);
            setUser({ displayName: data.displayName });
          }
          window.history.replaceState({}, document.title, "/");
        })
        .catch(console.error);
    }
  }, []);

  const handleNameSaved = (name) => {
    fetch(`${BACKEND_URL}/api/displayName`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name }),
    })
      .then((r) => r.json())
      .then(() => {
        localStorage.setItem("displayName", name);
        setUser({ displayName: name });
        setAskName(false);
      });
  };

  return user ? (
    <Dashboard user={user} />
  ) : (
    <Login onLogin={handleNameSaved} askName={askName} />
  );
}
