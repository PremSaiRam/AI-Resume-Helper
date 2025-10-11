import React, { useState } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data.text);
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".docx,.txt"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button
          type="submit"
          style={{
            background: "#28a745",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            marginTop: "15px",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "30px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            padding: "20px",
            maxWidth: "600px",
            margin: "30px auto",
            textAlign: "left",
          }}
        >
          <h3>📊 Resume Analysis</h3>
          {result.score && <p><strong>Score:</strong> {result.score}/100</p>}
          {result.strengths && (
            <p><strong>Strengths:</strong> {result.strengths.join(", ")}</p>
          )}
          {result.weaknesses && (
            <p><strong>Weaknesses:</strong> {result.weaknesses.join(", ")}</p>
          )}
          {result.suggestions && (
            <p><strong>Suggestions:</strong> {result.suggestions.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}
