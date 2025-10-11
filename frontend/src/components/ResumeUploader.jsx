import React, { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ResumeUploader() {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return alert("Select a file first");
    alert(`File uploaded: ${file.name}`);
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload Resume</button>
    </form>
  );
}
