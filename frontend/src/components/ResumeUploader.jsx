// src/components/ResumeUploader.jsx
import React, { useState } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function ResumeUploader({ addToHistory }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data.text);
      addToHistory(data.text);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h3>Upload Resume</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: 12 }} />
      <button onClick={handleUpload} disabled={loading} style={{ padding: "8px 16px", borderRadius: 8, background: "#2f9bff", color: "#fff", border: "none", cursor: "pointer" }}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {result && (
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12 }}>
          <h4>Analysis Result</h4>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
