import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

  // Check if Google just redirected back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");

    if (loggedIn) {
      // Fetch user data from backend
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => console.log("Not logged in"));
    }
  }, []);

  return (
    <div>
      {!user ? <Login /> : <Dashboard user={user} />}
    </div>
  );
}
