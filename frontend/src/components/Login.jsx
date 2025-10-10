// frontend/src/components/Login.jsx
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in user:", user);
      alert(`Welcome ${user.displayName}`);
      // TODO: Redirect to Dashboard or store user info in context/state
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>AI Resume Helper</h1>
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
        }}
      >
        Continue with Google
      </button>
    </div>
  );
};

export default Login;
