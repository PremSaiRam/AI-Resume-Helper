import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function ResumeUploader({ fetchHistory }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const submit = async () => {
    if (!file) return alert("Select a .docx or .txt resume");
    setLoading(true);
    const form = new FormData();
    form.append("resume", file);

    try {
      const res = await fetch(`${API}/analyze`, { method: "POST", body: form, credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.message || "Analysis failed");
        return;
      }
      const json = await res.json();
      setAnalysis(json.text);
      await fetchHistory();
    } catch (err) {
      console.error("analyze error", err);
      alert("Failed to analyze resume");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input type="file" accept=".docx,.txt" onChange={(e) => setFile(e.target.files?.[0])} />
      </div>

      <div>
        <button onClick={submit} disabled={loading}>{loading ? "Analyzing..." : "Analyze Resume"}</button>
      </div>

      {analysis && (
        <div style={{ marginTop: 12, background: "#f7f9fb", padding: 12, borderRadius: 8 }}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
