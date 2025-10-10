// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

/* Paste your Firebase web config here: do NOT commit secrets other than this config (this config is public-ish) */
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export async function googleLogin() {
  const result = await signInWithPopup(auth, provider);
  return result.user; // has email, displayName, photoURL
}

export function doLogout() {
  return signOut(auth);
}
