import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // wait for backend response

  useEffect(() => {
    // Always fetch user from backend to see if session exists
    fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data || data.error) {
          setUser(null); // not logged in
        } else {
          const profile = {
            ...data,
            displayName: data.displayName || data.name || (data.emails?.[0]?.value?.split("@")[0] || "User"),
            photos: data.photos?.length
              ? data.photos
              : [
                  {
                    value: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      data.displayName || data.name || data.emails?.[0]?.value?.split("@")[0] || "User"
                    )}&background=2f9bff&color=fff&size=128`,
                  },
                ],
          };
          setUser(profile);
        }
      })
      .catch((e) => {
        console.log("User fetch failed", e);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>Loading...</div>;
  }

  return user ? <Dashboard user={user} /> : <Login />;
}
