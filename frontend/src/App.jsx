import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/user`, {
      credentials: "include", // send cookies for session
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setUser(null); // not logged in
        } else {
          const profile = {
            ...data,
            displayName:
              data.displayName ||
              data.name ||
              (data.emails?.[0]?.value?.split("@")[0] ?? "User"),
            photos: data.photos?.length
              ? data.photos
              : [
                  {
                    value: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      data.displayName ||
                        data.name ||
                        data.emails?.[0]?.value?.split("@")[0] ||
                        "User"
                    )}&background=2f9bff&color=fff&size=128`,
                  },
                ],
          };
          setUser(profile);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          color: "#2f9bff",
          fontWeight: 700,
        }}
      >
        Loading...
      </div>
    );
  }

  return user ? <Dashboard user={user} /> : <Login />;
}
