// frontend/src/components/Login.jsx
import React from "react";

const CLIENT_ID = "969370456949-1hec5l90mjk8l99le3878tjr14mtnt2q.apps.googleusercontent.com";
const REDIRECT_URI = "https://ai-resume-helper-xxxx.onrender.com";

export default function Login({ onLogin }) {
  const handleLogin = () => {
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=profile email&prompt=select_account`;

    // Redirect user to Google login
    window.location.href = oauthUrl;
  };

  return (
    <div>
      <button onClick={handleLogin}>Continue with Google</button>
    </div>
  );
}
