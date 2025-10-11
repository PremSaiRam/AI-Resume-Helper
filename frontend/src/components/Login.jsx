import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

export default function Login() {
  const handleSuccess = (credentialResponse) => {
    try {
      const data = jwt_decode(credentialResponse.credential);

      // Ask for display name only once
      let displayName = localStorage.getItem("displayName");
      if (!displayName) {
        displayName = prompt("Enter your display name:");
        if (displayName) {
          localStorage.setItem("displayName", displayName);
        } else {
          displayName = data.name || "User";
        }
      }

      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("JWT Decode failed:", err);
      alert("Login failed. Try again!");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0088cc", // peacock color
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>AI Resume Helper</h1>
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Login Failed")}
            useOneTap={false}
            theme="outline"
            text="continue_with"
            shape="pill"
            // ✅ Forces chooser every time
            context="signin"
            ux_mode="popup"
            auto_select={false}
            prompt="select_account"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
