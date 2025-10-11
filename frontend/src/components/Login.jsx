import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Login({ setUser }) {
  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    });
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        color: "white",
        background: "linear-gradient(135deg, #006666, #00b3b3)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
        🦚 Welcome to AI Resume Helper
      </h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
        Sign in with Google to analyze and improve your resume instantly.
      </p>

      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          theme="filled_blue"
          size="large"
          width="250"
          shape="pill"
        />
      </GoogleOAuthProvider>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#e0f7fa" }}>
        Secure authentication powered by Google 🔒
      </p>
    </div>
  );
}
