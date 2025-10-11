import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setDisplayName(data.displayName);
        }
      })
      .catch(() => setUser(null));
  }, []);

  if (!user) return <Login />;

  if (!displayName) return <Login user={user} setDisplayName={setDisplayName} />;

  return <Dashboard user={user} displayName={displayName} setUser={setUser} setDisplayName={setDisplayName} />;
}

export default App;
