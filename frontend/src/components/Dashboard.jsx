import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });
    navigate("/");
  };

  const openProfile = () => navigate("/profile");

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to AI Resume Helper</h1>
      <button
        onClick={openProfile}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-3 hover:bg-blue-600"
      >
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
