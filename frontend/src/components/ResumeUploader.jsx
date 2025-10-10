import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

const ResumeUploader = ({ backendUrl }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        const storedHistory = JSON.parse(localStorage.getItem(u.uid)) || [];
        setHistory(storedHistory);
      } else {
        setUser(null);
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a resume first!");
    if (!user) return alert("Login first!");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${backendUrl}/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setLoading(false);
      setResult(data.text);

      // Save history
      const newHistory = [...history, { date: new Date(), analysis: data.text }];
      setHistory(newHistory);
      localStorage.setItem(user.uid, JSON.stringify(newHistory));
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to analyze resume");
    }
  };

  return (
    <div className="resume-uploader">
      {user ? (
        <>
          <h2>Welcome, {user.displayName || user.email}</h2>
          <form onSubmit={handleSubmit}>
            <input type="file" accept=".docx,.txt" onChange={handleFileChange} />
            <button type="submit">Analyze Resume</button>
          </form>
          {loading && <p>Analyzing resume... ⏳</p>}
          {result && (
            <div className="analysis">
              <h3>📊 Analysis Result</h3>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
          <div className="history">
            <h3>🕘 Previous Analyses</h3>
            {history.length === 0 && <p>No previous analyses</p>}
            {history.map((item, i) => (
              <div key={i}>
                <strong>{new Date(item.date).toLocaleString()}:</strong>
                <pre>{JSON.stringify(item.analysis, null, 2)}</pre>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Please log in to upload resumes.</p>
      )}
    </div>
  );
};

export default ResumeUploader;
