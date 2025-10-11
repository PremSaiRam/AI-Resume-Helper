import React, { useState, useEffect } from "react";

export default function Dashboard({ user }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setHistory(saved);
  }, []);

  // Save to localStorage whenever history updates
  useEffect(() => {
    localStorage.setItem("resumeHistory", JSON.stringify(history));
  }, [history]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a resume file first!");
    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:10000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const result = data.text;

      if (result?.score) {
        setAnalysis(result);

        const newEntry = {
          id: Date.now(),
          name: file.name,
          score: result.score,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          suggestions: result.suggestions,
          date: new Date().toLocaleString(),
        };

        setHistory([newEntry, ...history]);
      } else {
        setAnalysis({ text: "No valid analysis returned." });
      }
    } catch (err) {
      console.error(err);
      setAnalysis({ text: "Error analyzing resume." });
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(h.score).includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Section */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Welcome, {user.name} 🎉
        </h1>

        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded-2xl shadow-md"
        >
          <input
            type="file"
            accept=".docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Analyze Resume
          </button>
        </form>

        {loading && (
          <p className="mt-4 text-blue-600 font-semibold">
            Analyzing resume... please wait ⏳
          </p>
        )}

        {analysis && (
          <div className="bg-white mt-6 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-3">
              📊 Resume Analysis
            </h2>
            {analysis.score ? (
              <>
                <p><strong>Score:</strong> {analysis.score}/100</p>
                <p><strong>Strengths:</strong> {analysis.strengths.join(", ")}</p>
                <p><strong>Weaknesses:</strong> {analysis.weaknesses.join(", ")}</p>
                <p><strong>Suggestions:</strong> {analysis.suggestions.join(", ")}</p>
              </>
            ) : (
              <p>{analysis.text}</p>
            )}
          </div>
        )}
      </div>

      {/* History Sidebar */}
      <div className="w-1/3 bg-white p-6 border-l shadow-md">
        <h2 className="text-lg font-bold mb-3 text-blue-700">📁 Resume History</h2>
        <input
          type="text"
          placeholder="Search by name or score..."
          className="border p-2 w-full mb-4 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="max-h-[70vh] overflow-y-auto space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setAnalysis(item)}
                className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition"
              >
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Score: <span className="font-bold text-blue-600">{item.score}</span>
                </p>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No previous analyses found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
