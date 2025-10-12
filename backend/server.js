import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
  credentials: true,
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- MongoDB Connection ----------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ---------- User Schema ----------
const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  photo: String,
});

const User = mongoose.model("User", userSchema);

// ---------- Passport Google Strategy ----------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ["profile", "email"],
      prompt: "select_account" // Forces account selection
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            photo: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("✅ AI Resume Helper Backend is Running!");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send("Logout failed");
    req.session.destroy(() => {
      res.redirect(process.env.FRONTEND_URL || "/");
    });
  });
});

app.get("/api/user", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  res.json(req.user);
});

// ---------- Profile Update (Name + Photo) ----------
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/profile", upload.single("photo"), async (req, res) => {
  try {
    const { email, name } = req.body;
    const photo = req.file ? req.file.buffer.toString("base64") : null;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (photo) user.photo = `data:image/png;base64,${photo}`;
    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
