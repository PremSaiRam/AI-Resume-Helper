import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login({ onLogin }) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Failed to sign in. Try again.");
    }
  };

  return (
    <div className="login-page">
      <h1>AI Resume Analyzer</h1>
      <p>Sign in to continue</p>
      <button onClick={handleGoogleLogin} className="google-btn">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
        Continue with Google
      </button>
    </div>
  );
}
