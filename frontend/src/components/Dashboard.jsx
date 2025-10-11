import React, { useEffect, useState, useMemo } from "react";
import ResumeUploader from "./ResumeUploader.jsx";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

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

  // load history
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setHistory(saved);
  }, []);

  // save history
  useEffect(() => {
    localStorage.setItem("resumeHistory", JSON.stringify(history));
  }, [history]);

  // handle new result from uploader
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

  // wrapper so uploader shows saving/working
  const onSaving = (v) => setLoading(v);

  // delete history
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

  // derive sparkline data (last 10 scores)
  const sparkValues = useMemo(() => history.slice(0, 10).map((h) => h.score).reverse(), [history]);
  const latestScore = history[0]?.score ?? null;

  // logout
  const handleLogout = () => {
    window.location.href = `${BACKEND_URL}/logout`;
  };

  // --- UPDATED: display name and avatar ---
  const displayName =
    user?.displayName ||
    user?.name ||
    (user?.emails?.[0]?.value ? user.emails[0].value.split("@")[0] : "User");

  const photo =
    user?.photos?.[0]?.value ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2f9bff&color=fff&size=128`;

  // ---------------------------------------

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
            <button onClick={clearHistory} style={styles.deleteButton}>Delete History</button>
          </div>
        </aside>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4faf9",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 36px",
    borderBottom: "1px solid rgba(2,6,23,0.04)",
    background: "#fff",
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(45deg,#7b2cff,#2f9bff)",
    boxShadow: "0 6px 18px rgba(47,155,255,0.14)",
  },
  logoutBtn: {
    marginLeft: 12,
    background: "linear-gradient(90deg,#ff7b7b,#ffb36b)",
    border: "none",
    padding: "8px 12px",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  main: {
    display: "flex",
    gap: 24,
    padding: "28px 36px",
    alignItems: "flex-start",
  },
  left: {
    flex: 1,
  },
  peacockCard: {
    borderRadius: 16,
    padding: 20,
    background: "linear-gradient(135deg,#2b2c83,#2f9bff)",
    color: "#fff",
    boxShadow: "0 20px 40px rgba(47,155,255,0.12)",
  },
  analysisCard: {
    marginTop: 18,
    background: "#fff",
    padding: 18,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
  },
  right: {
    width: 360,
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5eef0",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: "56vh",
    overflowY: "auto",
  },
  cardRow: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #eef6f7",
    display: "flex",
    gap: 12,
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 160ms ease, box-shadow 160ms ease",
  },
  deleteButton: {
    background: "#fff",
    border: "1px solid #ff6b6b",
    color: "#c53030",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
};
