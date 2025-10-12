import React, { useState, useEffect } from "react";
import ResumeUploader from "./ResumeUploader.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Dashboard({ user }) {
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/history`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("History fetch error:", err));
  }, []);

  const handleLogout = async () => {
    await fetch(`${BACKEND_URL}/auth/logout`, { credentials: "include" });
    window.location.href = "/";
  };

  return (
    <div className="dashboard" style={{ textAlign: "center", color: "white" }}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        Welcome to AI Resume Analyzer
      </h1>

      <h2>Upload your resume</h2>
      <ResumeUploader setAnalysis={setAnalysis} />

      {analysis && (
        <div className="analysis-result">
          <h3>Analysis Result:</h3>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <h3>Previous Analyses</h3>
        {history.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((item, index) => (
              <li key={index}>{item.filename}</li>
            ))}
          </ul>
        ) : (
          <p>No previous uploads yet.</p>
        )}
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#ff4d4d",
          border: "none",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "40px",
        }}
      >
        Logout
      </button>
    </div>
  );
}
