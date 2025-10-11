import React from "react";

export default function Dashboard({ user }) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Welcome, {user.displayName} 🎉</h2>
      <img
        src={user.photos?.[0]?.value}
        alt="Profile"
        style={{ borderRadius: "50%", marginTop: "20px" }}
      />
      <p>{user.emails?.[0]?.value}</p>
    </div>
  );
}
