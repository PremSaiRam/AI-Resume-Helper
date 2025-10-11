import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("displayName") || ""
  );

  // Fetch user info from backend
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("displayName");
      setDisplayName("");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // If user not logged in
  if (!user) return <Login />;

  // Ask for display name if not stored
  if (!displayName) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 12,
          background: "radial-gradient(circle at 10% 20%, #0f172a 0%, rgba(12, 9, 39, 0.7) 20%, rgba(18, 15, 50, 0.6) 40%, rgba(14, 73, 93, 0.6) 100%)",
          color: "#fff",
          padding: 20,
        }}
      >
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
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 300,
          }}
        />
      </div>
    );
  }

  // Main dashboard
  return <Dashboard user={{ ...user, displayName }} onLogout={handleLogout} />;
}
