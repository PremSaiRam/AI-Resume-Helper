import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const app = express();

// ✅ Allow frontend to talk to backend
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Session setup (needed for passport)
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Google OAuth Strategy setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // You can store user info in DB here if needed
      return done(null, profile);
    }
  )
);

// ✅ Serialize & deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ✅ Routes

// Start Google OAuth flow
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle callback from Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Redirect to frontend after successful login
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// ✅ Basic route to check backend
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
