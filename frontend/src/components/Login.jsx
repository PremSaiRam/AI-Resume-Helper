import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode"; // ✅ works with your current version

export default function Login() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const data = jwtDecode(credentialResponse.credential);

      // Store Google user info
      localStorage.setItem("user", JSON.stringify(data));

      // Ask for display name only if first time login
      let displayName = localStorage.getItem("displayName");
      if (!displayName) {
        displayName = prompt("Enter your display name:");
        if (displayName) {
          localStorage.setItem("displayName", displayName);
        }
      }

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0088cc", // 🦚 Peacock blue
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <h1
        style={{
          marginBottom: "20px",
          fontSize: "2.5rem",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        AI Resume Helper
      </h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#333", marginBottom: "15px", fontWeight: "500" }}>
          Continue with Google
        </p>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Login Failed")}
            useOneTap={false}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
