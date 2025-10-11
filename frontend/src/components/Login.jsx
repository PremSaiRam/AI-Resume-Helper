import React, { useState } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login({ askName = false, user }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleSaveName = async () => {
    if (!name.trim()) return alert("Enter a display name");
    setSaving(true);
    try {
      await fetch(`${BACKEND_URL}/api/set-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save name");
    } finally {
      setSaving(false);
    }
  };

  if (askName) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.h2}>Welcome! Please choose a display name</h2>
          <input
            type="text"
            placeholder="Your display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSaveName} style={styles.googleBtn}>
            {saving ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#2f9bff" />
              <path d="M6 12c0-3.314 2.686-6 6-6v6H6z" fill="#7b2cff" />
            </svg>
          </div>
          <div style={styles.title}>AI Resume Helper</div>
        </div>
        <h2 style={styles.h2}>Smart resume feedback — instant.</h2>
        <p style={styles.lead}>
          Sign in with Google to upload resumes, view historic scores and get actionable suggestions.
        </p>
        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
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
    background: "radial-gradient(circle at 10% 20%, #0f172a 0%, rgba(12, 9, 39, 0.7) 20%, rgba(18, 15, 50, 0.6) 40%, rgba(14, 73, 93, 0.6) 100%)",
    padding: 20,
  },
  card: {
    width: 760,
    maxWidth: "95%",
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    borderRadius: 16,
    padding: "36px 36px",
    color: "#fff",
    textAlign: "center",
  },
  h2: { fontSize: 28, marginBottom: 12 },
  input: { width: "100%", padding: 12, margin: "12px 0", borderRadius: 10, border: "1px solid #ccc", fontSize: 16 },
  googleBtn: {
    padding: "12px 18px",
    background: "#fff",
    color: "#111827",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
  brandRow: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center" },
  logo: { width: 48, height: 48, display: "grid", placeItems: "center", background: "linear-gradient(
