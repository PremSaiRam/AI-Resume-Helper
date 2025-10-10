import ResumeUploader from "./ResumeUploader";
import HistoryPanel from "./HistoryPanel";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard({ user, onLogout }) {
  const logout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Welcome, {user.displayName}</h2>
        <button onClick={logout}>Logout</button>
      </header>
      <main>
        <div className="main-content">
          <ResumeUploader user={user} />
        </div>
        <aside>
          <HistoryPanel user={user} />
        </aside>
      </main>
    </div>
  );
}
