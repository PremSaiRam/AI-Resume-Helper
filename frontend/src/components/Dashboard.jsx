import React, { useEffect, useState } from "react";

const Dashboard = ({ user, displayName, setUser, setDisplayName }) => {
  const [history, setHistory] = useState([]);
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const fetchHistory = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/history`, {
      credentials: "include",
    });
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleAnalyze = async () => {
    if (!resume) return alert("Please select resume");
    const formData = new FormData();
    formData.append("resume", resume);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/analyze`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await res.json();
    setAnalysis(data.text);
    fetchHistory();
  };

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setDisplayName(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <h1>Welcome, {displayName}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <input type="file" onChange={e => setResume(e.target.files[0])} />
        <button onClick={handleAnalyze}>Analyze Resume</button>
      </div>
      {analysis && (
        <div style={{ marginTop: "20px" }}>
          <h2>Analysis</h2>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <h2>Resume History</h2>
        {history.map((item, idx) => (
          <div key={idx}>
            <strong>{item.date}</strong>: {JSON.stringify(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
