import React from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com"; // 🔹 put your backend Render URL here

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Welcome to AI Resume Helper</h2>
      <button
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}
