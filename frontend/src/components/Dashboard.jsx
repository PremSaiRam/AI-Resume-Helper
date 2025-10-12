// ✅ Updated App.jsx
import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");

    // Always try to fetch user (so refresh keeps session)
    fetch(`${BACKEND_URL}/api/user`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.displayName) {
          setUser(data);
        } else if (loggedIn) {
          // handle post-login case
          window.history.replaceState({}, document.title, "/");
        }
      })
      .catch(() => {});
  }, []);

  return user ? <Dashboard user={user} /> : <Login />;
}

// ✅ Updated Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import ResumeUploader from "./ResumeUploader.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Dashboard({ user }) {
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setHistory(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeHistory", JSON.stringify(history));
  }, [history]);

  const onResult = (result) => {
    if (!result) return;
    setAnalysis(result);
    if (result?.score) {
      const entry = {
        id: Date.now(),
        name: result?.metaName || `Resume ${new Date().toLocaleString()}`,
        score: result.score,
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        suggestions: result.suggestions || [],
        date: new Date().toLocaleString(),
      };
      setHistory((s) => [entry, ...s]);
    }
  };

  const onSaving = (v) => setLoading(v);
  const clearHistory = () => {
    if (!confirm("Delete all saved resume history?")) return;
    setHistory([]);
    localStorage.removeItem("resumeHistory");
  };

  const filtered = history.filter((h) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return h.name.toLowerCase().includes(q) || String(h.score).includes(q);
  });

  const sparkValues = useMemo(() => history.slice(0, 10).map((h) => h.score).reverse(), [history]);
  const latestScore = history[0]?.score ?? null;

  const handleLogout = () => {
    window.location.href = `${BACKEND_URL}/logout`;
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={styles.logoBox}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2f9bff"/><path d="M6 12c0-3.314 2.686-6 6-6v6H6z" fill="#7b2cff"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#052f2f" }}>AI Resume Helper</div>
            <div style={{ fontSize: 12, color: "#216e6e" }}>Analyze · Improve · Track</div>
          </div>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </header>

      <main style={styles.main}>
        <section style={styles.left}>
          <div style={styles.peacockCard}>
            <h1 style={{ textAlign: "center", marginBottom: 20, color: "#ffffff" }}>
              Welcome to AI Resume Analyzer
            </h1>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, color: "#ffffff" }}>Upload your resume</h2>
                <p style={{ margin: "6px 0 0 0", color: "#dff7f6" }}>Drop a DOCX or TXT file and get a score + suggestions.</p>
              </div>
            </div>

            <ResumeUploader onResult={onResult} onSaving={onSaving} />
          </div>

          {loading && <div style={{ marginTop: 12, color: "#07585a" }}>Analyzing... please wait ⏳</div>}

          {analysis && (
            <div style={styles.analysisCard}>
              <h3 style={{ color: "#063b3b" }}>📊 Resume Analysis</h3>
              {analysis.score ? (
                <>
                  <p><strong>Score:</strong> {analysis.score}/100</p>
                  <p><strong>Strengths:</strong> {analysis.strengths?.join(", ")}</p>
                  <p><strong>Weaknesses:</strong> {analysis.weaknesses?.join(", ")}</p>
                  <p><strong>Suggestions:</strong> {analysis.suggestions?.join(", ")}</p>
                </>
              ) : (
                <pre style={{ whiteSpace: "pre-wrap" }}>{analysis.text}</pre>
              )}
            </div>
          )}
        </section>

        <aside style={styles.right}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 800, color: "#073737", fontSize: 16 }}>Resume History</div>
            <div style={{ fontSize: 13, color: "#2b6f6f" }}>{history.length} saved</div>
          </div>

          <input
            placeholder="Search by name or score..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.historyList}>
            {filtered.length === 0 ? (
              <div style={{ color: "#667" }}>No past analyses yet.</div>
            ) : (
              filtered.map((it) => (
                <div key={it.id} onClick={() => setAnalysis(it)} style={styles.cardRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: "#356" }}>{it.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#0b5560", fontSize: 18 }}>{it.score}</div>
                    <div style={{ fontSize: 12, color: "#4b6" }}>score</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <div style={{ color: "#245" }}>Saved locally</div>
            <button onClick={clearHistory} style={styles.deleteButton}>Delete History</button>
          </div>
        </aside>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f4faf9", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 36px", borderBottom: "1px solid rgba(2,6,23,0.04)", background: "#fff" },
  logoBox: { width: 44, height: 44, borderRadius: 10, display: "grid", placeItems: "center", background: "linear-gradient(45deg,#7b2cff,#2f9bff)", boxShadow: "0 6px 18px rgba(47,155,255,0.14)" },
  logoutBtn: { marginLeft: 12, background: "linear-gradient(90deg,#ff7b7b,#ffb36b)", border: "none", padding: "8px 12px", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer" },
  main: { display: "flex", gap: 24, padding: "28px 36px", alignItems: "flex-start" },
  left: { flex: 1 },
  peacockCard: { borderRadius: 16, padding: 20, background: "linear-gradient(135deg,#2b2c83,#2f9bff)", color: "#fff", boxShadow: "0 20px 40px rgba(47,155,255,0.12)" },
  analysisCard: { marginTop: 18, background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 6px 18px rgba(2,6,23,0.06)" },
  right: { width: 360, background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 18px rgba(2,6,23,0.04)" },
  searchInput: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e5eef0" },
  historyList: { display: "flex", flexDirection: "column", gap: 10, maxHeight: "56vh", overflowY: "auto" },
  cardRow: { padding: 12, borderRadius: 12, border: "1px solid #eef6f7", display: "flex", gap: 12, alignItems: "center", cursor: "pointer" },
  deleteButton: { background: "#fff", border: "1px solid #ff6b6b", color: "#c53030", padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontWeight: 700 },
};
