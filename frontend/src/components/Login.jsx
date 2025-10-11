import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

export default function Login() {
  const handleSuccess = async (credentialResponse) => {
    const data = jwtDecode(credentialResponse.credential);
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "/dashboard";
  };

  return (
    <div
      style={{
        backgroundColor: "#0088cc",
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
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
