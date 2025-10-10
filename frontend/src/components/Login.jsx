// frontend/src/components/Login.jsx
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKkEfqKajj_5OouYFRROIvF6FFgeT5N8o",
  authDomain: "ai-resume-helper-5d28a.firebaseapp.com",
  projectId: "ai-resume-helper-5d28a",
  storageBucket: "ai-resume-helper-5d28a.appspot.com",
  messagingSenderId: "401881371287",
  appId: "1:401881371287:web:557cd250bd02ca4c6ecfd2",
  measurementId: "G-52F5X0N2Z2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = ({ onLogin }) => {
  const [user, setUser] = useState(null);

  // Monitor auth state
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      onLogin(currentUser); // send user data to parent
    } else {
      setUser(null);
    }
  });

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="login-container">
      {!user ? (
        <button className="login-btn" onClick={handleLogin}>
          Continue with Google
        </button>
      ) : (
        <div className="user-info">
          <p>Welcome, {user.displayName}</p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
