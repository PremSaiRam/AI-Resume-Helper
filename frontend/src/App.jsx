import React, { useState } from "react";
import Login from "./components/Login";
import ResumeUploader from "./components/ResumeUploader";
import { useToken } from "./hooks/useToken";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

  useToken(async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/verify-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Token verification failed", err);
    }
  });

  if (!user) return <Login />;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <ResumeUploader onAnalysis={(text) => console.log(text)} />
    </div>
  );
}
