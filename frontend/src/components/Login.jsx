import React from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Login({ setUser }) {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "150px" }}>
      <h2>Sign in to AI Resume Helper</h2>
      <button onClick={handleGoogleLogin}>Continue with Google</button>
    </div>
  );
}
