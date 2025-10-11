import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.message) setUser(data);
      })
      .catch(() => {});
  }, []);

  return user ? <Dashboard user={user} /> : <Login />;
}
