import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <button onClick={handleGoogleLogin} style={{ fontSize: "18px", padding: "10px 20px" }}>
        Continue with Google
      </button>
    </div>
  );
}
