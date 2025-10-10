import React, { useState } from "react";
import ResumeUploader from "./ResumeUploader";
import HistoryPanel from "./HistoryPanel";

export default function Dashboard() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 3 }}>
        <h1>Upload Resume</h1>
        <ResumeUploader onAnalysis={setAnalysis} />
        {analysis && (
          <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
            {JSON.stringify(analysis, null, 2)}
          </pre>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <HistoryPanel />
      </div>
    </div>
  );
}
