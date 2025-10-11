import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [needName, setNeedName] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user`, { credentials: "include" });
        const data = await res.json();

        if (!data.message) {
          if (!data.displayName) setNeedName(true); // ask display name
          setUser(data);
        }
      } catch (e) {
        console.log("user fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    // Check if logged_in param exists (after Google OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    if (params.get("logged_in")) {
      fetchUser();
      window.history.replaceState({}, document.title, "/"); // remove query
    } else {
      fetchUser();
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Login />;

  if (needName) return <Login askName user={user} />;

  return <Dashboard user={user} />;
}
