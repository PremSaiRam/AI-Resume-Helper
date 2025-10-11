import React from "react";

const HistoryPanel = ({ history }) => {
  if (!history.length) return <div>No resume history yet.</div>;

  return (
    <div>
      <h3>Resume History</h3>
      {history.map((item, idx) => (
        <div key={idx} style={{ marginBottom: "15px", padding: "10px", background: "#fff", borderRadius: "5px" }}>
          <strong>Date:</strong> {new Date(item.date).toLocaleString()}
          <pre>{JSON.stringify(item, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;
