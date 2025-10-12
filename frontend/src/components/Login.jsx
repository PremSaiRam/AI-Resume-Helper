import React from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Sign in with Google</h2>
        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "grid", placeItems: "center" },
  card: { background: "#fff", padding: 40, borderRadius: 12, textAlign: "center" },
  googleBtn: { padding: 12, background: "#4285F4", color: "#fff", border: "none", borderRadius: 8 },
};
