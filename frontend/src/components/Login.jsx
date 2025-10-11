import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login() {
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((user) => {
        // Redirect to dashboard
        window.location.href = "/";
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 20,
        background: "#f4faf9",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 16,
          maxWidth: 400,
          width: "95%",
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Welcome to AI Resume Helper</h2>
        <p style={{ marginBottom: 24, color: "#4b6" }}>
          Continue with your Google account to analyze resumes.
        </p>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            background: "linear-gradient(90deg,#7b2cff,#2f9bff)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            border: "none",
            fontSize: 16,
          }}
        >
          {loading ? "Redirecting..." : "Continue with Google"}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.37-1.38 4-5.27 4-3.16 0-5.73-2.63-5.73-5.86s2.57-5.86 5.73-5.86c1.81 0 3.03.77 3.73 1.43l2.54-2.44C18.02 3.1 16.01 2 13.01 2 7.03 2 2 7.07 2 12s5.03 10 11.01 10c6.36 0 10.55-4.44 10.55-10 0-.66-.07-1.17-.21-1.9z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
