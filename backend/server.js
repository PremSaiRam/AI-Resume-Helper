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

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

const usersDB = {}; // simple in-memory DB: { googleId: { name, email, history: [] } }

// Passport setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// Auth routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // check if user exists in DB
    const googleId = req.user.id;
    if (!usersDB[googleId]) {
      // new user, redirect to display name page
      res.redirect(`${process.env.FRONTEND_URL}/set-name?googleId=${googleId}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}?logged_in=true`);
    }
  }
);

// Save display name
app.post("/api/set-name", (req, res) => {
  const { googleId, displayName, email } = req.body;
  if (!googleId || !displayName) return res.status(400).json({ error: "Missing data" });

  usersDB[googleId] = { name: displayName, email, history: [] };
  req.session.user = usersDB[googleId];
  res.json({ success: true });
});

// Get current user
app.get("/api/user", (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ message: "Not logged in" });
  res.json(user);
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Resume Analysis
const upload = multer({ dest: "uploads/" });

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
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

    // OpenAI API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional resume analyzer." },
          { role: "user", content: `Analyze this resume and return ONLY JSON with:
{
"score": <0-100>,
"strengths": [...],
"weaknesses": [...],
"suggestions": [...]
}

Resume:
${resumeText}` },
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    const resultJSON = await response.json();
    const analysisText = resultJSON.choices?.[0]?.message?.content || "{}";

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      analysis = { text: analysisText };
    }

    // Save to user's history
    const user = req.session.user;
    if (user) {
      const googleId = Object.keys(usersDB).find(id => usersDB[id].email === user.email);
      if (googleId) usersDB[googleId].history.push({ resumeText, analysis });
    }

    res.json({ analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// Get user's resume history
app.get("/api/history", (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ message: "Not logged in" });

  const googleId = Object.keys(usersDB).find(id => usersDB[id].email === user.email);
  const history = googleId ? usersDB[googleId].history : [];
  res.json(history);
});

app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
