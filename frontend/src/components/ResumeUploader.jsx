// src/components/ResumeUploader.jsx
import React, { useState } from "react";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function ResumeUploader({ onResult, onSaving }) {
  const [file, setFile] = useState(null);
  const [working, setWorking] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select resume (.docx or .txt)");

    setWorking(true);
    onSaving?.(true);

    const form = new FormData();
    form.append("resume", file);

    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      onResult?.(json.text);
    } catch (err) {
      console.error(err);
      onResult?.({ text: "Error analyzing resume" });
    } finally {
      setWorking(false);
      onSaving?.(false);
    }
  };

  return (
    <form onSubmit={submit} style={uStyles.form}>
      <label style={uStyles.label}>
        <input
          type="file"
          accept=".docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0])}
          style={{ display: "none" }}
        />
        <div style={uStyles.fileBox}>
          <div>
            <strong style={{ fontSize: 14, color: "#063b3b" }}>
              {file ? file.name : "Choose a .docx or .txt resume"}
            </strong>
            <div style={{ fontSize: 12, color: "#336666" }}>
              {file ? `${(file.size / 1024).toFixed(1)} KB` : "No file selected"}
            </div>
          </div>
          <div style={uStyles.chooseBtn}>Browse</div>
        </div>
      </label>

      <button type="submit" style={{ ...uStyles.submit, opacity: working ? 0.7 : 1 }}>
        {working ? "Analyzing..." : "Analyze Resume"}
      </button>
    </form>
  );
}

const uStyles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "flex-start",
    marginTop: 18,
  },
  label: {
    width: "100%",
    cursor: "pointer",
  },
  fileBox: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#e6fffb",
    borderRadius: 10,
    border: "1px solid rgba(2,6,23,0.04)",
  },
  chooseBtn: {
    background: "linear-gradient(90deg,#2f9bff,#7b2cff)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 700,
  },
  submit: {
    marginTop: 6,
    background: "#0f766e",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
};
