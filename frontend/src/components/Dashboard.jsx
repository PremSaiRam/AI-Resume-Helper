import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [displayName, setDisplayName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedName = localStorage.getItem("displayName");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedName) {
      setDisplayName(storedName);
    } else if (storedUser) {
      // fallback to Google name if no custom name
      const data = JSON.parse(storedUser);
      setDisplayName(data.name || "User");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://ai-resume-helper-35j6.onrender.com/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("displayName");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div
        style={{
          backgroundColor: "#0088cc",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          flexDirection: "column",
        }}
      >
        <h2>Session expired. Please log in again.</h2>
        <button
          style={{
            backgroundColor: "white",
            color: "#0088cc",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px",
          }}
          onClick={() => (window.location.href = "/")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f4f8fb",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <div
        style={{
          backgroundColor: "#0088cc",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Welcome, {displayName} 👋</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "white",
            color: "#0088cc",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>

      {/* === Main Resume Section === */}
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#0088cc", marginBottom: "20px" }}>
          Resume Analyzer Dashboard
        </h2>
        <p>
          Here you can upload your resume, analyze job descriptions, and get AI
          feedback to improve your resume.
        </p>
      </div>
    </div>
  );
}
