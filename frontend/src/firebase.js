// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKkEfqKajj_5OouYFRROIvF6FFgeT5N8o",
  authDomain: "ai-resume-helper-5d28a.firebaseapp.com",
  projectId: "ai-resume-helper-5d28a",
  storageBucket: "ai-resume-helper-5d28a.appspot.com",
  messagingSenderId: "401881371287",
  appId: "1:401881371287:web:557cd250bd02ca4c6ecfd2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
