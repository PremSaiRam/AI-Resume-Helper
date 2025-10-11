import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // If redirected after Google login, the backend sets ?logged_in=true
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");

    if (loggedIn && !user) {
      fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          // Ensure we have displayName and photos for Google user
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

          // Clean URL for aesthetics
          window.history.replaceState({}, document.title, "/");
        })
        .catch((e) => {
          console.log("User fetch failed", e);
        });
    }
  }, [user]);

  return user ? <Dashboard user={user} /> : <Login />;
}
