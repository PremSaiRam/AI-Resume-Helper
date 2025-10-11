import React, { useState } from "react";
const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function ResumeUploader({ onResult, onSaving }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("resume", file);

    try {
      onSaving(true);
      const res = await fetch(`${BACKEND_URL}/analyze`, { method: "POST", body: formData, credentials: "include" });
      const data = await res.json();
      onResult(data.text);
    } catch (err) {
      alert("Failed to analyze resume.");
    } finally {
      onSaving(false);
    }
  };

  return (
    <div style={{ marginTop: 18 }}>
      <input type="file" accept=".txt,.docx" onChange={handleFileChange} style={{ marginBottom: 12 }} />
      <button onClick={handleUpload} style={{ padding: "8px 14px", borderRadius: 8, background: "#2f9bff", color: "#fff", border: "none", cursor: "pointer" }}>
        Analyze
      </button>
    </div>
  );
}
