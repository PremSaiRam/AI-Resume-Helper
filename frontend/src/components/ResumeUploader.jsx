// src/components/ResumeUploader.jsx
import React, { useState } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function ResumeUploader({ onResult, onSaving }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"].includes(f.type)) {
      setError("Only DOCX or TXT files are allowed");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) return;
    onSaving(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      onResult(data.text);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      onSaving(false);
      setFile(null);
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        accept=".docx,.txt"
        onChange={handleFileChange}
        style={styles.input}
      />
      {file && <div style={styles.fileName}>{file.name}</div>}
      {error && <div style={styles.error}>{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={!file}
        style={{ ...styles.button, opacity: file ? 1 : 0.5 }}
      >
        Analyze Resume
      </button>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  input: {
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  fileName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#053737",
  },
  error: {
    fontSize: 12,
    color: "#f44336",
  },
  button: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#2f9bff",
    color: "#fff",
    fontWeight: 700,
  },
};
