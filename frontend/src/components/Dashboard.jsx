import React from "react";
import ResumeUploader from "./ResumeUploader.jsx";

export default function Dashboard({ user }) {
  return (
    <div>
      <h2>Welcome to AI Resume Helper 🚀</h2>
      <ResumeUploader />
    </div>
  );
}
