import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("displayName") || ""
  );

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <Login />;

  if (!displayName) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12 }}>
        <h2>Welcome, new user! Please enter a display name:</h2>
        <input
          type="text"
          placeholder="Enter your display name"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              localStorage.setItem("displayName", e.target.value.trim());
              setDisplayName(e.target.value.trim());
            }
          }}
          style={{ padding: 8, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
      </div>
    );
  }

  return <Dashboard user={{ ...user, displayName }} />;
}
