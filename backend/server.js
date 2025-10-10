// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Example route for resume analysis
app.post("/analyze", (req, res) => {
  // Dummy response, replace with real analysis logic
  res.json({ text: "This is a dummy analysis result" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
