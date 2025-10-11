import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/user`, { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        setDisplayName(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setDisplayName(data.displayName);
      setLoading(false);
    } catch (err) {
      console.error("fetchUser error", err);
      setUser(null);
      setDisplayName(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // If page includes ?logged_in=true (after OAuth redirect), still fetchUser will pick up session.
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: "center" }}>Loading…</div>;
  if (!user) return <Login fetchUser={fetchUser} />;

  if (!displayName) return <Login fetchUser={fetchUser} user={user} />;

  return <Dashboard user={user} displayName={displayName} setUser={setUser} setDisplayName={setDisplayName} />;
}
