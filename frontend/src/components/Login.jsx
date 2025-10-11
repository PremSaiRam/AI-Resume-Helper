import React, { useState, useEffect } from "react";

export default function Login({ onLogin }) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [googleId, setGoogleId] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => {});
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  const handleSetName = async () => {
    if (!displayName) return alert("Please enter your display name");
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/set-name`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ displayName, googleId, email: user?.email }),
    });
    window.location.href = "/";
  };

  if (!user) {
    // Show Google login
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button onClick={handleGoogleLogin}>Continue with Google</button>
      </div>
    );
  }

  if (!user.name) {
    // Ask for display name
    const urlParams = new URLSearchParams(window.location.search);
    setGoogleId(urlParams.get("googleId") || "");
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Please enter your display name first!</h3>
        <input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Your display name"
        />
        <button onClick={handleSetName}>Submit</button>
      </div>
    );
  }

  // User already logged in
  onLogin(user);
  return null;
}
