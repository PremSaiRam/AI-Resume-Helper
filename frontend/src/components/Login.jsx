import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User info:", result.user);
      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <button onClick={handleGoogleLogin}>Continue with Google</button>
    </div>
  );
};

export default Login;
