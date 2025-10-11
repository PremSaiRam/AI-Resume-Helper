// ... (keep all imports)
export default function Dashboard({ user }) {
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setHistory(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeHistory", JSON.stringify(history));
  }, [history]);

  const onResult = (result) => {
    if (!result) return;
    setAnalysis(result);
    if (result?.score) {
      const entry = {
        id: Date.now(),
        name: result?.metaName || `Resume ${new Date().toLocaleString()}`,
        score: result.score,
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        suggestions: result.suggestions || [],
        date: new Date().toLocaleString(),
      };
      setHistory((s) => [entry, ...s]);
    }
  };

  const onSaving = (v) => setLoading(v);
  const clearHistory = () => {
    if (!confirm("Delete all saved resume history?")) return;
    setHistory([]);
    localStorage.removeItem("resumeHistory");
  };

  const filtered = history.filter((h) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return h.name.toLowerCase().includes(q) || String(h.score).includes(q);
  });

  const sparkValues = React.useMemo(() => history.slice(0, 10).map((h) => h.score).reverse(), [history]);
  const latestScore = history[0]?.score ?? null;

  const handleLogout = () => {
    window.location.href = "https://ai-resume-helper-35j6.onrender.com/logout";
  };

  const displayName = user.displayName || user?.displayName || "User";
  const photo = user?.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2f9bff&color=fff&size=128`;

  // ... rest of Dashboard.jsx stays identical
}
