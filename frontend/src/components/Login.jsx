import React, { useState } from "react";
const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login({ onLogin, askName }) {
  const [displayName, setDisplayName] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleSubmitName = (e) => {
    e.preventDefault();
    if (!displayName.trim()) return alert("Please enter a display name");
    onLogin(displayName.trim());
  };

  if (askName) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Enter your display name</h2>
          <form onSubmit={handleSubmitName}>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={styles.input}
              placeholder="Your display name"
            />
            <button type="submit" style={styles.btn}>
              Save
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Smart resume feedback — instant.</h2>
        <button onClick={handleGoogleLogin} style={styles.btn}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0f172a",
  },
  card: {
    padding: 36,
    borderRadius: 16,
    background: "#1e293b",
    color: "#fff",
    textAlign: "center",
  },
  input: {
    padding: 12,
    width: 240,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #fff",
  },
  btn: {
    padding: "12px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
};
