import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import mammoth from "mammoth";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// In-memory history (email -> [analyses]); simple and works without DB
const history = {};

// POST /analyze  (multipart/form-data: resume file, email field)
app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const email = req.body.email || null; // comes from frontend FormData
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const mimetype = file.mimetype;
    let resumeText = "";

    if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // DOCX
      const result = await mammoth.extractRawText({ path: file.path });
      resumeText = result.value || "";
    } else if (mimetype === "text/plain") {
      resumeText = fs.readFileSync(file.path, "utf-8");
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Only DOCX or TXT supported for now." });
    }

    fs.unlinkSync(file.path);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.json({ text: "No text found in resume." });
    }

    // Ask OpenAI for structured JSON (score, strengths, weaknesses, suggestions)
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional resume analyst that outputs JSON." },
          {
            role: "user",
            content: `Analyze the resume below and return ONLY a JSON object exactly in this shape:

{
  "score": 0-100,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."]
}

Resume:
${resumeText}`
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      })
    });

    const openaiJson = await openaiResp.json();
    const text = openaiJson?.choices?.[0]?.message?.content || "{}";

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (err) {
      // model didn't return strict JSON — wrap fallback
      analysis = { score: 0, strengths: [], weaknesses: [], suggestions: [], raw: text };
    }

    // Save history per email (simple in-memory store)
    if (email) {
      if (!history[email]) history[email] = [];
      history[email].unshift({ ...analysis, date: new Date().toLocaleString() });
      // keep at most 20 records
      if (history[email].length > 20) history[email].pop();
    }

    return res.json(analysis);
  } catch (err) {
    console.error("Analyze error:", err);
    return res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// GET /history?email=...
app.get("/history", (req, res) => {
  const email = req.query.email;
  return res.json(history[email] || []);
});

// Serve built frontend (Vite output -> frontend/dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
