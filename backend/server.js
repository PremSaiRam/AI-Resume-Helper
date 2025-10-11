import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://ai-resume-helper-1.onrender.com"], // your FRONTEND Render URL
    credentials: true,
  })
);

app.use(
  session({
    secret: "resume-helper-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get("/", (req, res) => {
  res.send("✅ Backend running for AI Resume Helper");
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    res.redirect("https://ai-resume-helper-1.onrender.com/dashboard");
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.send("Logged out successfully");
  });
});

app.listen(10000, () => console.log("✅ Server running on port 10000"));
