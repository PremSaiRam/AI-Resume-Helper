import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ResumeUploader from "./components/ResumeUploader";
import Dashboard from "./components/Dashboard";
import "./index.css";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyBKkEfqKajj_5OouYFRROIvF6FFgeT5N8o",
  authDomain: "ai-resume-helper-5d28a.firebaseapp.com",
  projectId: "ai-resume-helper-5d28a",
  storageBucket: "ai-resume-helper-5d28a.appspot.com",
  messagingSenderId: "401881371287",
  appId: "1:401881371287:web:557cd250bd02ca4c6ecfd2",
};

// Initialize Firebase
initializeApp(firebaseConfig);
getAuth();

// ===== Backend URL =====
const backendUrl = "https://ai-resume-helper-35j6.onrender.com";

// ===== Render the app =====
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/analyze"
          element={<ResumeUploader backendUrl={backendUrl} />}
        />
        <Route path="/dashboard" element={<Dashboard backendUrl={backendUrl} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
