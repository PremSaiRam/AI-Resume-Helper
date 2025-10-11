import React from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  googleBtn: { marginTop: 22, padding: "12px 18px", background: "#fff", color: "#111827", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700 },
};
