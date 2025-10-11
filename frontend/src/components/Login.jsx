import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Login({ fetchUser, user }) {
  // If user is provided, show the display-name entry UI.
  const [name, setName] = useState("");

  const handleStartOAuth = () => {
    // Directly open backend OAuth endpoint - do not require name upfront.
    window.location.href = `${API}/auth/google`;
  };

  const submitDisplayName = async () => {
    if (!name.trim()) return alert("Please enter your display name");
    try {
      await fetch(`${API}/api/user/displayName`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ displayName: name.trim() }),
      });
      // fetch fresh user info
      await fetchUser();
    } catch (err) {
      console.error(err);
      alert("Failed to save display name");
    }
  };

  // If OAuth hasn't happened yet (no user), show big OAuth button
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "radial-gradient(circle at 10% 20%, #0f172a 0%, rgba(12, 9, 39, 0.7) 20%, rgba(18, 15, 50, 0.6) 40%, rgba(14, 73, 93, 0.6) 100%)", padding: 20 }}>
        <div style={{ width: 760, maxWidth: "95%", background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", borderRadius: 16, padding: 36, color: "#fff", textAlign: "center", boxShadow: "0 12px 40px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
          <h2 style={{ marginBottom: 12 }}>AI Resume Helper</h2>
          <p style={{ marginBottom: 18 }}>Sign in with Google to upload resumes and track improvements.</p>
          <button onClick={handleStartOAuth} style={{ padding: "12px 18px", borderRadius: 10, background: "#fff", color: "#111827", fontWeight: 700 }}>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  // If user exists but displayName isn't set, ask for it
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ width: 560, maxWidth: "95%", background: "#fff", padding: 28, borderRadius: 12, textAlign: "center" }}>
        <h3>Welcome, {user.name?.givenName || "User"}</h3>
        <p>Please enter your display name (this will be shown in the dashboard)</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" style={{ padding: 10, width: "80%", marginTop: 8 }} />
        <div style={{ marginTop: 12 }}>
          <button onClick={submitDisplayName}>Save & Continue</button>
        </div>
      </div>
    </div>
  );
}
