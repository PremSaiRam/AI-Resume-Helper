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

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(session({ secret: "resume-helper-secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

let users = {}; // email -> { displayName, history: [] }

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GoogleStrategy.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect(`${process.env.FRONTEND_URL}?logged_in=true`)
);

app.get("/api/user", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  const email = req.user.emails[0].value;
  if (!users[email]) users[email] = { displayName: null, history: [] };
  res.json({ user: req.user, displayName: users[email].displayName });
});

app.post("/api/user/displayName", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  const email = req.user.emails[0].value;
  const { displayName } = req.body;
  users[email].displayName = displayName;
  res.json({ success: true });
});

app.post("/api/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

const upload = multer({ dest: "uploads/" });

app.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional resume analyzer." },
          { role: "user", content: `Analyze this resume and return JSON:
{
"score": <0-100>,
"strengths": [...],
"weaknesses": [...],
"suggestions": [...]
}
Resume:
${resumeText}` }
        ]
      })
    });

    const result = await response.json();
    const analysisText = result.choices?.[0]?.message?.content || "{}";
    let analysisJSON;
    try { analysisJSON = JSON.parse(analysisText); } catch { analysisJSON = { raw: analysisText }; }

    const email = req.user.emails[0].value;
    users[email].history.unshift({ ...analysisJSON, date: new Date().toISOString() });

    res.json({ text: analysisJSON });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

app.get("/api/history", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  const email = req.user.emails[0].value;
  res.json(users[email]?.history || []);
});

app.get("/", (_, res) => res.send("✅ Backend running successfully"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
