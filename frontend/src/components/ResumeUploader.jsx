import React, { useState, useEffect } from "react";

/*
  ResumeUploader.jsx
  - Accepts a `user` prop (Firebase user object) with user.email and user.uid
  - Calls backend POST /analyze with FormData: { resume: File, email: user.email }
  - After successful analysis it:
      - shows result on screen
      - fetches server history from GET /history?email=...
      - saves fallback history to localStorage if server history fails
  - Works whether backend is served from same origin (relative paths) or remote.
*/

export default function ResumeUploader({ user }) {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Decide backend base URL:
  // If you set VITE_BACKEND_URL in your frontend environment (Vercel/Netlify),
  // import.meta.env.VITE_BACKEND_URL will be available.
  // If empty, we'll use relative paths (assume backend serves frontend).
  const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || "";

  const analyzeUrl = (path = "/analyze") =>
    BACKEND_BASE ? `${BACKEND_BASE.replace(/\/$/, "")}${path}` : path;

  // Fetch history from server (fallback to localStorage)
  const fetchHistory = async () => {
    try {
      const url = analyzeUrl("/history") + `?email=${encodeURIComponent(user.email)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Server history fetch failed");
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
        // Persist a copy locally too
        localStorage.setItem(`history_${user.uid}`, JSON.stringify(data));
        return;
      }
      throw new Error("Invalid history data");
    } catch (err) {
      // fallback to localStorage
      const local = JSON.parse(localStorage.getItem(`history_${user.uid}`) || "[]");
      setHistory(local);
    }
  };

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  // Handler to upload and analyze resume
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a DOCX or TXT resume.");

    // only accept permitted MIME types
    const allowed = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowed.includes(file.type)) {
      return alert("Only DOCX (.docx) and TXT (.txt) files are supported for now.");
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("email", user.email || "");

      const res = await fetch(analyzeUrl("/analyze"), {
        method: "POST",
        body: form,
        // Note: do NOT set Content-Type header when sending FormData
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Server returned ${res.status}`);
      }

      const data = await res.json();

      // Normalize response shape (the backend returns {score, strengths, weaknesses, suggestions} or fallback raw)
      const normalized = {
        score: data.score ?? data?.score ?? 0,
        strengths: Array.isArray(data.strengths) ? data.strengths : (data.strengths ? [data.strengths] : []),
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : (data.weaknesses ? [data.weaknesses] : []),
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : (data.suggestions ? [data.suggestions] : []),
        raw: data.raw ?? null,
      };

      setAnalysis(normalized);

      // update history from server (best-effort)
      await fetchHistory();

      // If server didn't store history, store locally as fallback
      if (!history || history.length === 0) {
        const local = JSON.parse(localStorage.getItem(`history_${user.uid}`) || "[]");
        local.unshift({ ...normalized, date: new Date().toLocaleString() });
        localStorage.setItem(`history_${user.uid}`, JSON.stringify(local.slice(0, 20)));
        setHistory(local.slice(0, 20));
      }
    } catch (err) {
      console.error("Analyze error:", err);
      alert("Analysis failed. See console for details.");
    } finally {
      setLoading(false);
      // reset file input if you want: setFile(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 12 }}>
          <h3>Upload Resume</h3>
          <div style={{ fontSize: 13, color: "#555" }}>
            Signed in as <strong>{user.email}</strong>
          </div>
        </div>

        <form onSubmit={handleAnalyze} style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
          <input
            type="file"
            accept=".docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "block", marginBottom: 12 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#0b69ff",
              color: "white",
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
            }}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {analysis && (
          <div style={{ marginTop: 16, background: "#fff", padding: 12, borderRadius: 8 }}>
            <h4>Analysis Result</h4>
            <p><strong>Score:</strong> {analysis.score}</p>
            <p><strong>Strengths:</strong> {analysis.strengths.join(", ") || "—"}</p>
            <p><strong>Weaknesses:</strong> {analysis.weaknesses.join(", ") || "—"}</p>
            <p><strong>Suggestions:</strong> {analysis.suggestions.join(", ") || "—"}</p>
            {analysis.raw && (
              <details style={{ marginTop: 8 }}>
                <summary>Raw model output</summary>
                <pre style={{ whiteSpace: "pre-wrap" }}>{analysis.raw}</pre>
              </details>
            )}
          </div>
        )}
      </div>

      <aside style={{ width: 340 }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <h4>Previous Analyses</h4>
          {history.length === 0 ? (
            <p style={{ color: "#666" }}>No previous analyses yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {history.map((h, i) => (
                <div key={i} style={{ borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                  <div style={{ fontSize: 13, color: "#888" }}>{h.date}</div>
                  <div><strong>Score:</strong> {h.score}</div>
                  <div style={{ fontSize: 13, color: "#333" }}>{(h.suggestions && h.suggestions.slice(0,2).join(", ")) || ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
