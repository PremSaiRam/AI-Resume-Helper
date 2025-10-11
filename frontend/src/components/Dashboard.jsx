import React, { useState } from "react";
import ResumeUploader from "./ResumeUploader";

export default function Dashboard({ user }) {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>Welcome, {user.displayName} 🎉</h2>
      {user.photos?.[0]?.value && (
        <img
          src={user.photos[0].value}
          alt="Profile"
          style={{ borderRadius: "50%", margin: "20px", width: "100px" }}
        />
      )}
      <p>{user.emails?.[0]?.value}</p>

      {!showUploader ? (
        <button
          onClick={() => setShowUploader(true)}
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "12px 25px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "30px",
          }}
        >
          Upload Resume
        </button>
      ) : (
        <ResumeUploader />
      )}
    </div>
  );
}
