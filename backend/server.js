// backend/server.js
import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import mammoth from "mammoth";

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL; // set in environment
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || "replace-me";

if (!FRONTEND_URL) {
  console.warn("FRONTEND_URL is not set in environment. Set it to your frontend URL.");
}

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// In-memory users store (email => { displayName, history: [] })
// NOTE: in production persist this to a DB. This is for demo/dev.
const users = {};

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

// --- Auth endpoints ---
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // ensure the user has an entry in users store
    const email = req.user?.emails?.[0]?.value;
    if (email && !users[email]) users[email] = { displayName: null, history: [] };
    // redirect to frontend with query telling it login happened
    res.redirect(`${FRONTEND_URL}?logged_in=true`);
  }
);

// Check current user and whether they have a displayName set
app.get("/api/user", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  const email = req.user.emails?.[0]?.value;
  if (!email) return res.status(500).json({ message: "No email in Google profile" });
  if (!users[email]) users[email] = { displayName: null, history: [] };
  return res.json({
    user: {
      id: req.user.id,
      emails: req.user.emails,
      photos: req.user.photos,
      name: req.user.name,
    },
    displayName: users[email].displayName,
  });
});

// Set display name for current logged in user
app.post("/api/user/displayName", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  const { displayName } = req.body;
  if (!displayName || typeof displayName !== "string") {
    return res.status(400).json({ message: "Invalid displayName" });
  }
  const email = req.user.emails?.[0]?.value;
  if (!email) return res.status(500).json({ message: "No email in profile" });
  if (!users[email]) users[email] = { displayName: null, history: [] };
  users[email].displayName = displayName.trim();
  return res.json({ success: true, displayName: users[email].displayName });
});

// Logout (POST)
app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.error("Logout error:", err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

// --- Resume analysis ---
// Accept .docx and .txt
const upload = multer({ dest: "uploads/" });

app.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  if (!req.file) return res.status(400).json({ message: "Missing file" });

  try {
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    let resumeText = "";

    if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ path: filePath });
      resumeText = result.value;
    } else if (mimetype === "text/plain") {
      resumeText = fs.readFileSync(filePath, "utf-8");
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Only DOCX or TXT resumes are supported." });
    }

    fs.unlinkSync(filePath);
    if (!resumeText.trim()) return res.json({ text: "No text found in resume." });

    // Call OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional resume analyzer." },
          {
            role: "user",
            content: `Analyze this resume and return ONLY JSON with:
{
"score": <0-100>,
"strengths": [...],
"weaknesses": [...],
"suggestions": [...]
}

Resume:
${resumeText}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    const openaiJson = await openaiRes.json();
    const analysisText = openaiJson.choices?.[0]?.message?.content || "{}";
    let analysisJSON;
    try {
      analysisJSON = JSON.parse(analysisText);
    } catch (err) {
      // If not valid JSON, wrap raw text
      analysisJSON = { raw: analysisText };
    }

    // Save to per-user in-memory history
    const email = req.user.emails?.[0]?.value;
    if (email) {
      if (!users[email]) users[email] = { displayName: null, history: [] };
      users[email].history.unshift({ ...analysisJSON, date: new Date().toISOString() });
      // keep history size reasonable
      if (users[email].history.length > 200) users[email].history.length = 200;
    }

    return res.json({ text: analysisJSON });
  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ error: "Failed to analyze resume" });
  }
});

app.get("/api/history", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  const email = req.user.emails?.[0]?.value;
  if (!email) return res.json([]);
  return res.json(users[email]?.history || []);
});

// Root
app.get("/", (req, res) => res.send("✅ Backend running"));

app.listen(PORT, () => console.log(`✅ Server listening on ${PORT}`));
