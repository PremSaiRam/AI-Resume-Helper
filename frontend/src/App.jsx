import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");

    // Always try to fetch user (so refresh keeps session)
    fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.displayName) {
          setUser(data);
        } else if (loggedIn) {
          // handle post-login case
          window.history.replaceState({}, document.title, "/");
        }
      })
      .catch(() => {});
  }, []);

  return user ? <Dashboard user={user} /> : <Login />;
}
