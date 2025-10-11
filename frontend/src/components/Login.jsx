// src/components/Login.jsx
import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

export default function Login({ setUser }) {
  const handleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwt_decode(credentialResponse.credential);
      console.log("Decoded Google User:", decoded);
      // decoded has { name, email, picture, sub } etc.
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(135deg, #00B7C2 0%, #007B83 100%)", // peacock color theme
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "white",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        Welcome to AI Resume Analyzer 🦚
      </h1>
      <p style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
        Sign in with Google to analyze and improve your resumes
      </p>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </GoogleOAuthProvider>
    </div>
  );
}
