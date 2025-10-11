// src/components/Login.jsx
import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [askName, setAskName] = useState(false);

  useEffect(() => {
    // Check if user info is stored in localStorage
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser) {
      onLogin(savedUser);
    }
  }, []);

  // Redirect to Google OAuth
  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Called after display name is entered
  const handleSubmitName = () => {
    if (!displayName.trim()) return;
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    savedUser.displayName = displayName.trim();
    localStorage.setItem("user", JSON.stringify(savedUser));
    onLogin(savedUser);
  };

  // Check if Google redirected back with login info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user`, { credentials: "include" });
        if (res.ok) {
          const user = await res.json();
          // If displayName already exists, log in
          if (user.displayName) {
            localStorage.setItem("user", JSON.stringify(user));
            onLogin(user);
          } else {
            // Ask for display name
            localStorage.setItem("user", JSON.stringify(user));
            setAskName(true);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    // Only fetch user if returning from Google OAuth
    if (window.location.search.includes("logged_in=true")) {
      fetchUser();
    }
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={{ marginBottom: 20, color: "#073737" }}>Welcome to AI Resume Helper</h1>

        {askName ? (
          <>
            <p style={{ marginBottom: 10, color: "#356" }}>Enter your display name:</p>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              style={styles.input}
            />
            <button onClick={handleSubmitName} style={styles.button}>
              Continue
            </button>
          </>
        ) : (
          <>
            <button onClick={handleGoogleLogin} style={styles.button}>
              {loading ? "Redirecting..." : "Continue with Google"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4faf9",
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px 36px",
    borderRadius: 16,
    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
    textAlign: "center",
    width: 380,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 16,
    borderRadius: 12,
    border: "1px solid #e5eef0",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#2f9bff,#7b2cff)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 16,
  },
};
