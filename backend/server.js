import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "https://ai-resume-helper-1.onrender.com";
const PORT = process.env.PORT || 10000;

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: "GET,POST",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ======== GOOGLE STRATEGY =========
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// ======== ROUTES =========

// Test root route (prevent Cannot GET /)
app.get("/", (req, res) => {
  res.send("✅ AI Resume Helper backend is running!");
});

// Google login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login`,
  }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/dashboard`);
  }
);

// Get current user
app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    const { displayName, emails, id } = req.user;
    res.json({
      success: true,
      user: {
        id,
        name: displayName,
        email: emails?.[0]?.value,
      },
    });
  } else {
    res.json({ success: false });
  }
});

// Update display name (only once)
app.post("/api/set-displayname", (req, res) => {
  if (req.isAuthenticated()) {
    const { name } = req.body;
    req.user.displayName = name;
    req.session.save(() => {
      res.json({ success: true, name });
    });
  } else {
    res.status(401).json({ success: false });
  }
});

// Logout
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect(`${FRONTEND_URL}/login`);
    });
  });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
