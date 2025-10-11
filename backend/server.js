// backend/server.js
import express from "express";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "somesecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth setup
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // You can save user info to DB here if needed
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully!");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: `${process.env.FRONTEND_URL}/dashboard`,
  })
);

app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
