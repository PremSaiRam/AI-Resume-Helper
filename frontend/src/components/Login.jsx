import React, { useEffect, useState } from "react";
const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    // Check if user info already stored
    const storedName = localStorage.getItem("displayName");
    if (storedName) {
      onLogin({ displayName: storedName });
    }
  }, []);

  const handleContinue = () => {
    if (!displayName.trim()) return alert("Enter your name!");
    localStorage.setItem("displayName", displayName.trim());
    onLogin({ displayName: displayName.trim() });
  };

  const handleGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const storedName = localStorage.getItem("displayName");

  if (storedName) return null; // Already logged in

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome to AI Resume Helper</h2>
        {!storedName ? (
          <>
            <input
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleContinue} style={styles.button}>
              Continue
            </button>
            <div style={{ margin: "12px 0", textAlign: "center", color: "#555" }}>or</div>
          </>
        ) : null}
        <button onClick={handleGoogle} style={{ ...styles.button, background: "#4285F4" }}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4faf9",
  },
  card: {
    padding: 36,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    width: 360,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#0b5560",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
