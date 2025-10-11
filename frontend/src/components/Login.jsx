// src/components/Login.jsx
import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login() {
  const [displayName, setDisplayName] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if displayName stored
    const savedName = localStorage.getItem("displayName");
    if (!savedName) setShowPrompt(true);
  }, []);

  const handleGoogleLogin = () => {
    if (!displayName) {
      alert("Please enter your display name first!");
      return;
    }
    localStorage.setItem("displayName", displayName);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

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

        {showPrompt && (
          <input
            placeholder="Enter a display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={styles.inputName}
          />
        )}

        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          <img
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18'><g fill='none' fill-rule='evenodd'><path fill='%23EA4335' d='M17.64 9.2045c0-.638-.057-1.251-.163-1.84H9v3.48h4.844c-.208 1.12-.84 2.07-1.792 2.713v2.26h2.9c1.694-1.56 2.689-3.86 2.689-6.613z'/><path fill='%2334A853' d='M9 18c2.43 0 4.468-.806 5.957-2.186l-2.9-2.26c-.806.543-1.84.866-3.057.866-2.35 0-4.344-1.586-5.054-3.72H1.987v2.332C3.46 16.96 6.01 18 9 18z'/><path fill='%234A90E2' d='M3.946 10.7A5.403 5.403 0 0 1 3.86 9c0-.65.11-1.28.306-1.88V4.79H1.987A9.005 9.005 0 0 0 0 9c0 1.46.33 2.84.987 4.057l2.96-2.357z'/><path fill='%23FBBC05' d='M9 3.58c1.31 0 2.5.45 3.43 1.33l2.58-2.58C13.468.85 11.43 0 9 0 6.01 0 3.46 1.04 1.987 2.86L4.99 5.21C5.656 3.82 7.65 3.58 9 3.58z'/></g></svg>"
            alt="google"
            style={{ marginRight: 10 }}
          />
          Continue with Google
        </button>

        <div style={{ marginTop: 18, color: "#6b7280" }}>
          <small>We only store your resume analyses locally (no DB). Sessions are handled by the backend.</small>
        </div>
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
    boxShadow: "0 12px 40px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.04)",
    textAlign: "center",
  },
  brandRow: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center" },
  logo: { width: 48, height: 48, display: "grid", placeItems: "center", background: "linear-gradient(45deg,#2f9bff,#7b2cff)", borderRadius: 10 },
  title: { fontWeight: 700, fontSize: 18, color: "#e6f0ff" },
  h2: { marginTop: 18, marginBottom: 8, fontSize: 28, lineHeight: 1.05 },
  lead: { margin: 0, color: "rgba(230,240,255,0.8)" },
  inputName: { marginTop: 12, padding: "8px 12px", borderRadius: 8, border: "none", width: "60%", fontSize: 14, textAlign: "center" },
  googleBtn: { marginTop: 22, padding: "12px 18px", background: "#fff", color: "#111827", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, display: "inline-flex", alignItems: "center", boxShadow: "0 6px 18px rgba(15,23,42,0.35)" },
};
