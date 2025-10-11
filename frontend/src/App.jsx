import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // If redirected after Google login, back-end set ?logged_in=true
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");

    if (loggedIn && !user) {
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          setUser(data);
          // remove query param for cleanliness
          window.history.replaceState({}, document.title, "/");
        })
        .catch((e) => console.log("user fetch failed", e));
    }
  }, []);

  return user ? <Dashboard user={user} /> : <Login />;
}
