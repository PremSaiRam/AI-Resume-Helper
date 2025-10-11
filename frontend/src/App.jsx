import React from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [user, setUser] = React.useState(null);

  return (
    <div>
      {!user ? <Login setUser={setUser} /> : <Dashboard user={user} />}
    </div>
  );
}
