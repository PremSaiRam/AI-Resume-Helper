import React, { useState } from "react";
import axios from "axios";

const Login = ({ fetchUser, user }) => {
  const [nameInput, setNameInput] = useState("");

  const handleDisplayName = async () => {
    if (!nameInput.trim()) return alert("Please enter your display name first!");
    await axios.post(`${import.meta.env.VITE_API_URL}/api/user/displayName`, { displayName: nameInput }, { withCredentials: true });
    fetchUser();
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>AI Resume Helper</h1>
        <a href={`${import.meta.env.VITE_API_URL}/auth/google`}>
          <button>Continue with Google</button>
        </a>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Welcome, first time user!</h2>
      <input
        placeholder="Enter display name"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />
      <button onClick={handleDisplayName}>Continue</button>
    </div>
  );
};

export default Login;
