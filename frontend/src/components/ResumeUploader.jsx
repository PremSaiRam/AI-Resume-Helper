import React, { useState } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function ResumeUploader({ onAnalysis }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a resume first");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      onAnalysis(data.text);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        accept=".docx,.txt"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>
    </form>
  );
}
