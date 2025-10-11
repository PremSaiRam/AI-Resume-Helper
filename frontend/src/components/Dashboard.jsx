import React, { useEffect, useState } from "react";
import ResumeUploader from "./ResumeUploader.jsx";
import HistoryPanel from "./HistoryPanel.jsx";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard({ user, displayName, setUser, setDisplayName }) {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API}/api/history`, { credentials: "include" });
      if (!res.ok) { setHistory([]); return; }
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("fetchHistory", err);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API}/api/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("logout error", err);
    } finally {
      setUser(null);
      setDisplayName(null);
      window.location.href = "/"; // go to login page
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={user.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2f9bff&color=fff`} alt="avatar" style={{ width: 48, height: 48, borderRadius: 8 }} />
          <div>
            <div style={{ fontWeight: 700 }}>{displayName}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{user.emails?.[0]?.value}</div>
          </div>
        </div>

        <div>
          <button onClick={logout} style={{ background: "#ff6b6b" }}>Logout</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        <div className="card">
          <h3>Upload Resume</h3>
          <ResumeUploader fetchHistory={fetchHistory} />
        </div>

        <div className="card">
          <h3>Resume History</h3>
          <HistoryPanel history={history} />
        </div>
      </div>
    </div>
  );
}
