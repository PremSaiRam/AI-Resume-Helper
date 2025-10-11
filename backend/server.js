import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";

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
    secret: "resume-helper-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serialize user
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
      return done(null, profile);
    }
  )
);

// 🔹 Google auth routes
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

// 🔹 Endpoint to get logged-in user
app.get("/api/user", (req, res) => {
  if (req.user) res.json(req.user);
  else res.status(401).json({ message: "Not logged in" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
