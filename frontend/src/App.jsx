import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, { withCredentials: true });
      setUser(res.data.user);
      setDisplayName(res.data.displayName);
    } catch {
      setUser(null);
      setDisplayName(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <Login fetchUser={fetchUser} />;
  if (!displayName) return <Login fetchUser={fetchUser} user={user} />;

  return <Dashboard user={user} displayName={displayName} setDisplayName={setDisplayName} />;
};

export default App;
