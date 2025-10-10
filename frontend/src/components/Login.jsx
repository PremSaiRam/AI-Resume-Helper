import React from "react";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = "https://ai-resume-helper-xxxx.onrender.com";

export default function Login() {
  const handleLogin = () => {
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=profile email&prompt=select_account`;

    window.location.href = oauthUrl;
  };

  return (
    <div>
      <button onClick={handleLogin}>Continue with Google</button>
    </div>
  );
}
