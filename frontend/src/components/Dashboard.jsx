import React, { useState, useEffect } from "react";

export default function Dashboard({ user }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load from browser storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setHistory(saved);
  }, []);

  // Save back to storage
  useEffect(() => {
    localStorage.setItem("resumeHistory", JSON.stringify(history));
  }, [history]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a resume first!");

    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // Change below URL if your backend runs on a different domain
      const res = await fetch("https://your-render-backend-url.com/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const result = data.text;

      if (result?.score) {
        setAnalysis(result);
        const newEntry = {
          id: Date.now(),
          name: file.name,
          score: result.score,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          suggestions: result.suggestions,
          date: new Date().toLocaleString(),
        };
        setHistory([newEntry, ...history]);
      } else {
        setAnalysis({ text: "No valid analysis returned." });
      }
    } catch (err) {
      console.error(err);
      setAnalysis({ text: "Error analyzing resume." });
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(h.score).includes(searchTerm)
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1 style={{ color: "#007bff", fontWeight: "bold" }}>
          Welcome, {user.name} 🎉
        </h1>

        <form
          onSubmit={handleUpload}
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginTop: "1.5rem",
          }}
        >
          <input
            type="file"
            accept=".docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: "1rem" }}
          />
          <br />
          <button
            type="submit"
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Analyze Resume
          </button>
        </form>

        {loading && (
          <p style={{ color: "#007bff", marginTop: "1rem" }}>
            Analyzing resume... please wait ⏳
          </p>
        )}

        {analysis && (
          <div
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              marginTop: "1.5rem",
            }}
          >
            <h3 style={{ color: "#007bff" }}>📊 Resume Analysis</h3>
            {analysis.score ? (
              <>
                <p><strong>Score:</strong> {analysis.score}/100</p>
                <p><strong>Strengths:</strong> {analysis.strengths.join(", ")}</p>
                <p><strong>Weaknesses:</strong> {analysis.weaknesses.join(", ")}</p>
                <p><strong>Suggestions:</strong> {analysis.suggestions.join(", ")}</p>
              </>
            ) : (
              <p>{analysis.text}</p>
            )}
          </div>
        )}
      </div>

      {/* History Sidebar */}
      <div
        style={{
          width: "350px",
          background: "#fff",
          borderLeft: "1px solid #ddd",
          padding: "1.5rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          overflowY: "auto",
        }}
      >
        <h2 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
          📁 Resume History
        </h2>
        <input
          type="text"
          placeholder="Search by name or score..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setAnalysis(item)}
                style={{
                  border: "1px solid #eee",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  background: "#fafafa",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#e9f3ff")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#fafafa")
                }
              >
                <strong>{item.name}</strong>
                <p style={{ fontSize: "0.9em", color: "#555" }}>
                  Score:{" "}
                  <span style={{ color: "#007bff", fontWeight: "bold" }}>
                    {item.score}
                  </span>
                </p>
                <p style={{ fontSize: "0.75em", color: "#aaa" }}>{item.date}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "#777", fontSize: "0.9em" }}>
              No previous analyses found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
