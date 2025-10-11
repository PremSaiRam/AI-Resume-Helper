import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("https://ai-resume-helper-35j6.onrender.com/api/user", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        if (!data.user.name) setShowNamePrompt(true);
      } else {
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);

  const saveDisplayName = async () => {
    await fetch("https://ai-resume-helper-35j6.onrender.com/api/set-displayname", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    setShowNamePrompt(false);
    setUser({ ...user, name });
  };

  const handleLogout = () => {
    window.location.href = "https://ai-resume-helper-35j6.onrender.com/logout";
  };

  if (showNamePrompt) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Welcome! Please set your display name:</h2>
        <input
          type="text"
          placeholder="Enter display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", marginTop: "10px" }}
        />
        <button onClick={saveDisplayName} style={{ marginLeft: "10px", padding: "8px" }}>
          Save
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#e6f2ff", height: "100vh", textAlign: "center" }}>
      <h1 style={{ padding: "30px", color: "#007acc" }}>
        Welcome, {user?.name || user?.email || "User"}!
      </h1>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#007acc",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
