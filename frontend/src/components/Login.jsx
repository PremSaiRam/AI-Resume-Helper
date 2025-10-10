import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User info:", result.user);

      // You can store the user in localStorage or context
      localStorage.setItem("user", JSON.stringify(result.user));

      alert("Login successful!");
      navigate("/dashboard"); // redirect after login
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>Welcome to AI Resume Helper</h1>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#fff",
          color: "#764ba2",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
      >
        Continue with Google
      </button>
    </div>
  );
}
