// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Google OAuth Config - add these as environment variables in Render
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI; 
// e.g. https://ai-resume-helper-xxxx.onrender.com/auth/google/callback

// Redirect user to Google login
app.get("/auth/google", (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = querystring.stringify(options);
  res.redirect(`${rootUrl}?${qs}`);
});

// Callback endpoint Google redirects to
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for access token
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = data;

    // Fetch user info
    const userInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );

    // Send user info to frontend (you can generate JWT here too)
    res.json({ user: userInfo.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// Example root route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
