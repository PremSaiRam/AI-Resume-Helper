// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "chart.js/auto";

export default function Dashboard({ user }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Load history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setHistory(saved);
  }, []);

  // ✅ Render chart when history updates
  useEffect(() => {
    const ctx = document.getElementById("scoreChart");
    if (ctx && history.length > 0) {
      new Chart(ctx, {
        type: "line",
        data: {
          labels: history.map((h) => h.name),
          datasets: [
            {
              label: "Resume Score",
              data: history.map((h) => h.score),
              borderColor: "#00B7C2",
              backgroundColor: "rgba(0,183,194,0.3)",
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: { responsive: true },
      });
    }
  }, [history]);

  const handleDeleteHistory = () => {
    localStorage.removeItem("resumeHistory");
    setHistory([]);
  };

  const filteredHistory = history.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #00B7C2 0%, #007B83 100%)",
        color: "white",
        padding: "30px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Welcome, {user.name || user.email || "User"} 🎉</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user.picture && (
            <img
              src={user.picture}
              alt="profile"
              style={{ width: 45, height: 45, borderRadius: "50%" }}
            />
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "white",
              color: "#007B83",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Upload Resume Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          background: "white",
          color: "#333",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#007B83" }}>Upload Your Resume</h3>
        <input
          type="file"
          id="resumeFile"
          accept=".docx,.txt"
          style={{
            marginTop: "15px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={() => document.getElementById("resumeFile").click()}
          style={{
            marginLeft: "10px",
            background: "#007B83",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Select File
        </button>
      </motion.div>

      {/* History Section */}
      <div
        style={{
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
        }}
      >
        {/* Resume History */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: "white",
            color: "#333",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#007B83" }}>📜 Resume History</h3>
          <input
            type="text"
            placeholder="Search resumes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((h, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: "#E6F9FA",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <strong>{h.name}</strong> - <span>{h.score}/100</span>
                </motion.div>
              ))
            ) : (
              <p>No resumes yet.</p>
            )}
          </div>

          <button
            onClick={handleDeleteHistory}
            style={{
              background: "#FF3B3B",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            🗑️ Delete History
          </button>
        </motion.div>

        {/* Score Chart */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: "white",
            color: "#333",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#007B83" }}>📈 Score Progress</h3>
          <canvas id="scoreChart" width="400" height="250"></canvas>
        </motion.div>
      </div>
    </div>
  );
}
