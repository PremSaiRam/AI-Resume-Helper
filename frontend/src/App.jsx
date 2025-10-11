import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [askName, setAskName] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user`, { credentials: "include" });
        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
          if (!data.displayName) setAskName(true);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.get("logged_in")) {
      fetchUser();
      window.history.replaceState({}, document.title, "/");
    } else {
      fetchUser();
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Login />;

  if (askName) return <Login askName user={user} />;

  return <Dashboard user={user} />;
}
