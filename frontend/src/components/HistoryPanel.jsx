import React from "react";

export default function HistoryPanel() {
  // For now dummy data
  const previous = [
    { id: 1, score: 85, name: "John Doe" },
    { id: 2, score: 78, name: "Jane Smith" },
  ];

  return (
    <div>
      <h2>Previous Analyses</h2>
      <ul>
        {previous.map((p) => (
          <li key={p.id}>
            {p.name}: {p.score} / 100
          </li>
        ))}
      </ul>
    </div>
  );
}
