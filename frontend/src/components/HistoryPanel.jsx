import { useEffect, useState } from "react";

export default function HistoryPanel({ user }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`history_${user.uid}`)) || [];
    setHistory(saved);
  }, [user]);

  return (
    <div className="history-panel">
      <h3>Previous Analyses</h3>
      {history.length === 0 ? (
        <p>No previous results.</p>
      ) : (
        <ul>
          {history.map((item, i) => (
            <li key={i}>
              <strong>Score:</strong> {item.score} / 100<br />
              <small>{item.date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
