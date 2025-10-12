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

// ✅ Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "resume-helper-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// ✅ Passport Google Auth
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

// ✅ Authentication Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}?logged_in=true`);
  }
);

app.get("/api/user", (req, res) => {
  if (req.user) res.json(req.user);
  else res.status(401).json({ message: "Not logged in" });
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
});

// ✅ Resume Analyzer Route
const upload = multer({ dest: "uploads/" });

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    let resumeText = "";

    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      resumeText = result.value;
    } else if (mimetype === "text/plain") {
      resumeText = fs.readFileSync(filePath, "utf-8");
    } else {
      fs.unlinkSync(filePath);
      return res
        .status(400)
        .json({ error: "Only DOCX or TXT resumes are supported." });
    }

    fs.unlinkSync(filePath);
    if (!resumeText.trim())
      return res.json({ text: "No text found in resume." });

    // ✅ OpenAI API Call
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

    const result = await response.json();
    const analysisText = result.choices?.[0]?.message?.content || "{}";
    let analysisJSON;

    try {
      analysisJSON = JSON.parse(analysisText);
    } catch {
      analysisJSON = { text: analysisText };
    }

    res.json({ text: analysisJSON });
  } catch (err) {
    console.error("❌ Error analyzing resume:", err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// ✅ Root route (for backend testing)
app.get("/", (req, res) => {
  res.json({ message: "AI Resume Helper Backend is running 🚀" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
