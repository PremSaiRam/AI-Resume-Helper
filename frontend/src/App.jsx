import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null); // google profile
  const [displayName, setDisplayName] = useState(null); // stored name

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");

    if (loggedIn && !user) {
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          setUser(data);
          const email = data.emails[0]?.value;
          const storedName = localStorage.getItem(`displayName_${email}`);
          if (storedName) {
            setDisplayName(storedName);
          }
          // remove query param for cleanliness
          window.history.replaceState({}, document.title, "/");
        })
        .catch(console.log);
    }
  }, [user]);

  const handleSetDisplayName = (name) => {
    if (!user) return;
    const email = user.emails[0]?.value;
    localStorage.setItem(`displayName_${email}`, name);
    setDisplayName(name);
  };

  const handleLogout = () => {
    fetch(`${BACKEND_URL}/logout`, { credentials: "include" }).finally(() => {
      setUser(null);
      setDisplayName(null);
      window.location.href = `${BACKEND_URL}/auth/google`;
    });
  };

  if (!user) return <Login />;

  if (!displayName) {
    // show input prompt for display name
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ padding: 24, background: "#fff", borderRadius: 12, textAlign: "center" }}>
          <h2>Enter your display name</h2>
          <input
            type="text"
            placeholder="Your display name"
            style={{ padding: 10, width: 200, marginTop: 12 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                handleSetDisplayName(e.target.value.trim());
              }
            }}
          />
          <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
            Press Enter to continue
          </p>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} displayName={displayName} onLogout={handleLogout} />;
}
