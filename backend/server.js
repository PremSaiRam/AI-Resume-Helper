import express from "express";
import fetch from "node-fetch";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());

// Token verification endpoint
app.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    const data = await response.json();

    if (data.error_description) {
      return res.status(400).json({ error: "Invalid token" });
    }

    res.json({ email: data.email, name: data.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Token verification failed" });
  }
});

// Resume analyze endpoint
app.post("/analyze", upload.single("resume"), (req, res) => {
  // Dummy analysis: return file name
  res.json({ text: `Resume uploaded: ${req.file.originalname}` });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
