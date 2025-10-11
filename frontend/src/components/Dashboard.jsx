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

  const onResult = (result) => {
    if (!result) return;
    setAnalysis(result);
    if (result?.score) {
      const entry = {
        id: Date.now(),
        name: result?.metaName || `Resume ${new Date().toLocaleString()}`,
        score: result.score,
      };
      setHistory([entry, ...history]);
    }
  };

  const displayName =
    user?.displayName ||
    user?.name ||
    (user?.emails && user.emails[0]?.value) ||
    "User";

  const photo =
    user?.photos?.[0]?.value ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=2f9bff&color=fff&size=128`;

  const filteredHistory = useMemo(() => {
    if (!search.trim()) return history;
    return history.filter((h) =>
      h.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [history, search]);

  const logout = () => {
    window.location.href = `${BACKEND_URL}/logout`;
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <img
          src={photo}
          style={{ width: 64, height: 64, borderRadius: "50%", marginRight: 16 }}
        />
        <h2>Welcome, {displayName}</h2>
        <button onClick={logout} style={{ marginLeft: "auto" }}>
          Logout
        </button>
      </div>
      <ResumeUploader onResult={onResult} setLoading={setLoading} />
      {analysis && (
        <div style={{ marginTop: 24 }}>
          <h3>Analysis Result</h3>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <h3>History</h3>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul>
          {filteredHistory.map((h) => (
            <li key={h.id}>
              {h.name} - Score: {h.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
