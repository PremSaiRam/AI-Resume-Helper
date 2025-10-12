import React, { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://ai-resume-helper.onrender.com/api/user", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    window.location.href = "https://ai-resume-helper.onrender.com/logout";
  };

  const openProfile = () => {
    window.location.href = "/profile";
  };

  return (
    <div className="dashboard">
      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <img
            src={user.photo}
            alt="profile"
            width={60}
            height={60}
            onClick={openProfile}
            style={{ cursor: "pointer", borderRadius: "50%" }}
          />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
}

export default Dashboard;
