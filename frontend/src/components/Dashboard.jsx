import React, { useState, useEffect } from "react";
import axios from "axios";
import ResumeUploader from "./ResumeUploader.jsx";
import HistoryPanel from "./HistoryPanel.jsx";

const Dashboard = ({ user, displayName, setDisplayName }) => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/history`, { withCredentials: true });
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true });
    setDisplayName(null);
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Hello, {displayName}</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <ResumeUploader fetchHistory={fetchHistory} />
      <HistoryPanel history={history} />
    </div>
  );
};

export default Dashboard;
