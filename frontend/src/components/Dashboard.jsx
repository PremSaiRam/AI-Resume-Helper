// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import ResumeUploader from "./ResumeUploader";

const BACKEND_URL = "https://ai-resume-helper-35j6.onrender.com";

export default function Dashboard({ user }) {
  const [displayName, setDisplayName] = useState("");
  const [resumeHistory, setResumeHistory] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem("displayName") || user.displayName || user.name?.givenName || "User";
    setDisplayName(name);

    // Load resume history per user (localStorage)
    const allHistory = JSON.parse(localStorage.getItem("resumeHistory") || "{}");
    setResumeHistory(allHistory[user.id] || []);
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/logout`, { credentials: "include" });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("displayName");
    window.location.href = "/";
  };

  const addToHistory = (analysis) => {
    const allHistory = JSON.parse(localStorage.getItem("resumeHistory") || "{}");
    const userHistory = allHistory[user.id] || [];
    const newHistory = [{ analysis, date: new Date().toLocaleString() }, ...userHistory];
    allHistory[user.id] = newHistory;
    localStorage.setItem("resumeHistory", JSON.stringify(allHistory));
    setResumeHistory(newHistory);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <img src={user.photos?.[0]?.value} alt="avatar" style={styles.avatar} />
          <span style={styles.name}>{displayName}</span>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <ResumeUploader addToHistory={addToHistory} />

      <div style={styles.history}>
        <h3>Resume History</h3>
        {resumeHistory.length === 0 && <p>No resumes analyzed yet.</p>}
        {resumeHistory.map((item, idx) => (
          <div key={idx} style={styles.historyCard}>
            <p><strong>Date:</strong> {item.date}</p>
            <pre style={styles.pre}>{JSON.stringify(item.analysis, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, fontFamily: "Arial, sans-serif", background: "#0f172a", color: "#fff", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  avatar: { width: 50, height: 50, borderRadius: "50%", marginRight: 12 },
  name: { fontSize: 20, fontWeight: 600 },
  logoutBtn: { padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, background: "#ff4d4d", color: "#fff" },
  history: { marginTop: 32 },
  historyCard: { background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, marginBottom: 16 },
  pre: { whiteSpace: "pre-wrap", wordBreak: "break-word", background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 },
};
