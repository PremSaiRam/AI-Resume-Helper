// src/components/Login.jsx
import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [askName, setAskName] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Check if user is already saved in localStorage for this email
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser) {
      onLogin(savedUser);
    }
  }, []);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleSubmitName = () => {
    if (!displayName.trim()) return;
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const newUser = { ...savedUser, displayName };
    localStorage.setItem("user", JSON.stringify(newUser));
    onLogin(newUser);
  };

  // Check if returning from Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logged_in") === "true") {
      const fetchUser = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/user`, {
            credentials: "include",
          });
          if (!res.ok) {
            setLoading(false);
            return;
          }
          const user = await res.json();

          // If displayName already exists, log in directly
          const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
          if (savedUser.email === user.emails?.[0]?.value && savedUser.displayName) {
            onLogin(savedUser);
          } else {
            // Ask for display name
            setAskName(true);
            setUserEmail(user.emails?.[0]?.value);
            localStorage.setItem("user", JSON.stringify({ email: user.emails?.[0]?.value }));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
          // Remove query param for cleanliness
          window.history.replaceState({}, document.title, "/");
        }
      };
      fetchUser();
    }
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={{ marginBottom: 20, color: "#073737" }}>Welcome to AI Resume Helper</h1>

        {askName ? (
          <>
            <p style={{ marginBottom: 10, color: "#356" }}>Enter your display name for {userEmail}:</p>
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
          <button onClick={handleGoogleLogin} style={styles.button}>
            {loading ? "Redirecting..." : "Continue with Google"}
          </button>
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
