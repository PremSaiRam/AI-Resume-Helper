import React from "react";

export default function HistoryPanel({ history }) {
  if (!history || history.length === 0) return <div>No history yet.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {history.map((h, idx) => (
        <div key={idx} style={{ padding: 8, background: "#f7f9fb", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#666" }}>{new Date(h.date).toLocaleString()}</div>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{JSON.stringify(h, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
