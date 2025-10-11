// src/components/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import ResumeUploader from "./ResumeUploader.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

// Circle progress for latest score
function CircleProgress({ value = 0, size = 96 }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0" x2="1">
          <stop offset="0%" stopColor="#7b2cff" />
          <stop offset="100%" stopColor="#2f9bff" />
        </linearGradient>
      </defs>
      <g transform="translate(50,50)">
        <circle r={r} fill="none" stroke="#eef2f6" strokeWidth="8" />
        <circle
          r={r}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="8"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
        <text x="0" y="6" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0b5560">
          {Math.round(pct)}
        </text>
      </g>
    </svg>
  );
}

// Simple sparkline
function Sparkline({ values = [], width = 200, height = 48, color = "#2f9bff" }) {
  const pad = 4;
  if (!values || values.length === 0) return <svg width={width} height={height}></svg>;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (width - pad * 2) / (values.length - 1 || 1);

  const points = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (height - pad * 2) * (1 - (v - min) / range);
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points.join(" ")}
      />
    </svg>
  );
}

export default function Dashboard({ user }) {
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Load history
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setHistory(saved);
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem("resumeHistory", JSON.stringify(history));
  }, [history]);

  // Handle new resume analysis result
  const onResult = (result) => {
    if (!result) return;
    setAnalysis(result);

    if (result?.score !== undefined) {
      const entry = {
        id: Date.now(),
        name: result?.metaName || `Resume ${new Date().toLocaleString()}`,
        score: result.score,
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        suggestions: result.suggestions || [],
        date: new Date().toLocaleString(),
      };
      setHistory((prev) => [entry, ...prev]);
    }
  };

  const onSaving = (v) => setLoading(v);

  // Delete history
  const clearHistory = () => {
    if (!confirm("Delete all saved resume history?")) return;
    setHistory([]);
    localStorage.removeItem("resumeHistory");
  };

  // Filtered history
  const filtered = history.filter((h) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return h.name.toLowerCase().includes(q) || String(h.score).includes(q);
  });

  const sparkValues = useMemo(() => history.slice(0, 10).map((h) => h.score).reverse(), [history]);
  const latestScore = history[0]?.score ?? 0;

  // Logout function
  const handleLogout = () => {
    fetch(`${BACKEND_URL}/logout`, { credentials: "include" })
      .finally(() => {
        localStorage.removeItem("displayName");
        window.location.href = "/";
      });
  };

  const displayName = user?.displayName || "User";
  const photo =
    user?.photos?.[0]?.value ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2f9bff&color=fff&size=128`;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={styles.logoBox}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#2f9bff" />
              <path d="M6 12c0-3.314 2.686-6 6-6v6H6z" fill="#7b2cff" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#052f2f" }}>AI Resume Helper</div>
            <div style={{ fontSize: 12, color: "#216e6e" }}>Analyze · Improve · Track</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right", marginRight: 8 }}>
            <div style={{ fontWeight: 700 }}>{displayName}</div>
            <div style={{ fontSize: 12, color: "#164e4e" }}>{user?.emails?.[0]?.value || ""}</div>
          </div>
          <img
            src={photo}
            alt="avatar"
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              objectFit: "cover",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          />
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Left */}
        <section style={styles.left}>
          <div style={styles.peacockCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, color: "#ffffff" }}>Upload your resume</h2>
                <p style={{ margin: "6px 0 0 0", color: "#dff7f6" }}>
                  Drop a DOCX or TXT file and get a score + suggestions.
                </p>
              </div>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#bfeef4" }}>Latest score</div>
                  <div style={{ marginTop: 6 }}>
                    <CircleProgress value={latestScore ?? 0} />
                  </div>
                </div>
                <div style={{ width: 140 }}>
                  <div style={{ fontSize: 12, color: "#bfeef4" }}>Score history</div>
                  <div style={{ marginTop: 6 }}>
                    <Sparkline values={sparkValues} width={140} height={48} color="#fff" />
                  </div>
                </div>
              </div>
            </div>

            <ResumeUploader onResult={onResult} onSaving={onSaving} />
          </div>

          {loading && <div style={{ marginTop: 12, color: "#07585a" }}>Analyzing... please wait ⏳</div>}

          {analysis && (
            <div style={styles.analysisCard}>
              <h3 style={{ color: "#063b3b" }}>📊 Resume Analysis</h3>
              {analysis.score !== undefined ? (
                <>
                  <p>
                    <strong>Score:</strong> {analysis.score}/100
                  </p>
                  <p>
                    <strong>Strengths:</strong> {analysis.strengths?.join(", ")}
                  </p>
                  <p>
                    <strong>Weaknesses:</strong> {analysis.weaknesses?.join(", ")}
                  </p>
                  <p>
                    <strong>Suggestions:</strong> {analysis.suggestions?.join(", ")}
                  </p>
                </>
              ) : (
                <pre style={{ whiteSpace: "pre-wrap" }}>{analysis.text}</pre>
              )}
            </div>
          )}
        </section>

        {/* Right */}
        <aside style={styles.right}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 800, color: "#073737", fontSize: 16 }}>Resume History</div>
            <div style={{ fontSize: 13, color: "#2b6f6f" }}>{history.length} saved</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              placeholder="Search by name or score..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.historyList}>
            {filtered.length === 0 ? (
              <div style={{ color: "#667" }}>No past analyses yet.</div>
            ) : (
              filtered.map((it) => (
                <div
                  key={it.id}
                  onClick={() => setAnalysis(it)}
                  style={styles.cardRow}
                  className="card-anim"
                >
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
            <button onClick={clearHistory} style={styles.deleteButton}>
              Delete History
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f4faf9", display: "flex", flexDirection: "column", fontFamily: "Inter, Roboto, Arial, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 36px", borderBottom: "1px solid rgba(2,6,23,0.04)", background: "#fff" },
  logoBox: { width: 44, height: 44, borderRadius: 10, display: "grid", placeItems: "center", background: "linear-gradient(45deg,#7b2cff,#2f9bff)", boxShadow: "0 6px 18px rgba(47,155,255,0.14)" },
  logoutBtn: { marginLeft: 12, background: "linear-gradient(45deg,#ff4d6d,#ff8b4d)", border: "none", borderRadius: 10, padding: "6px 12px", color: "#fff", fontWeight: 700, cursor: "pointer" },
  main: { display: "flex", gap: 16, flex: 1, padding: 18 },
  left: { flex: 2, display: "flex", flexDirection: "column", gap: 12 },
  peacockCard: { padding: 18, borderRadius: 16, background: "linear-gradient(180deg,#2f9bff,#7b2cff)", color: "#fff", display: "flex", flexDirection: "column", gap: 12 },
  analysisCard: { marginTop: 12, padding: 12, borderRadius: 12, background: "#e0f7f7", color: "#0b5560" },
  right: { flex: 1, padding: 12, background: "#fff", borderRadius: 12, boxShadow: "0 6px 16px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" },
  searchInput: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", fontSize: 14 },
  historyList: { flex: 1, display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", maxHeight: "calc(100vh - 220px)" },
  cardRow: { display: "flex", alignItems: "center", padding: "8px 12px", borderRadius: 10, cursor: "pointer", background: "#f4faf9", transition: "all 0.2s ease", gap: 8 },
  deleteButton: { background: "#f87171", border: "none", borderRadius: 8, color: "#fff", padding: "4px 8px", cursor: "pointer" },
};
