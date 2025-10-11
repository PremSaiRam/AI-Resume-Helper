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

export default function Dashboard({ user, displayName, onLogout }) {
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // load per-user history
  useEffect(() => {
    const email = user.emails[0]?.value;
    const saved = JSON.parse(localStorage.getItem(`history_${email}`) || "[]");
    setHistory(saved);
  }, [user]);

  useEffect(() => {
    const email = user.emails[0]?.value;
    localStorage.setItem(`history_${email}`, JSON.stringify(history));
  }, [history, user]);

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
    const email = user.emails[0]?.value;
    setHistory([]);
    localStorage.removeItem(`history_${email}`);
  };

  const filtered = history.filter((h) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return h.name.toLowerCase().includes(q) || String(h.score).includes(q);
  });

  const sparkValues = useMemo(() => history.slice(0, 10).map((h) => h.score).reverse(), [history]);
  const latestScore = history[0]?.score ?? null;

  const photo =
    user?.photos?.[0]?.value ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2f9bff&color=fff&size=128`;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={styles.logoBox}></div>
          <div>
            <div style={{ fontWeight: 800, color: "#052f2f" }}>AI Resume Helper</div>
            <div style={{ fontSize: 12, color: "#216e6e" }}>Analyze · Improve · Track</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right", marginRight: 8 }}>
            <div style={{ fontWeight: 700 }}>{displayName}</div>
            <div style={{ fontSize: 12, color: "#164e4e" }}>{user?.emails[0]?.value || ""}</div>
          </div>
          <img src={photo} alt="avatar" style={styles.avatar} />
          <button onClick={onLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.left}>
          <div style={styles.peacockCard}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Latest Resume Score</div>
            {latestScore !== null ? <CircleProgress value={latestScore} /> : <div>No resume analyzed yet</div>}
          </div>

          <div style={styles.peacockCard}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontWeight: 600 }}>History</div>
              <button style={styles.clearBtn} onClick={clearHistory}>
                Clear
              </button>
            </div>
            <input
              style={styles.searchInput}
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul style={{ maxHeight: 200, overflowY: "auto", padding: 0 }}>
              {filtered.map((h) => (
                <li key={h.id} style={{ padding: "4px 0", fontSize: 12 }}>
                  {h.name} — {h.score}
                </li>
              ))}
            </ul>
            {sparkValues.length > 0 && <Sparkline values={sparkValues} />}
          </div>
        </section>

        <section style={styles.right}>
          <ResumeUploader onResult={onResult} onSaving={onSaving} />
          {loading && <div style={{ marginTop: 12 }}>Analyzing resume...</div>}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: { fontFamily: "sans-serif", minHeight: "100vh", background: "#eef2f6" },
  header: {
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    borderBottom: "1px solid #ccc",
  },
  logoBox: { width: 48, height: 48, background: "linear-gradient(45deg,#7b2cff,#2f9bff)", borderRadius: 12 },
  avatar: { width: 40, height: 40, borderRadius: "50%" },
  logoutBtn: { marginLeft: 12, padding: "4px 8px", border: "none", background: "#7b2cff", color: "#fff", borderRadius: 6, cursor: "pointer" },
  main: { display: "flex", gap: 24, padding: 16 },
  left: { flex: 1, display: "flex", flexDirection: "column", gap: 12 },
  right: { flex: 2 },
  peacockCard: { padding: 16, background: "#fff", borderRadius: 12 },
  clearBtn: { border: "none", background: "transparent", color: "#7b2cff", cursor: "pointer", fontSize: 12 },
  searchInput: { padding: 6, borderRadius: 6, border: "1px solid #ccc", marginBottom: 8, width: "100%" },
};
