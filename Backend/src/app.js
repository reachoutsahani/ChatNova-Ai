const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// ✅ UPDATED CORS (ALL FRONTEND URLs)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://chat-nova-ai-uzn8.vercel.app",
    "https://chat-nova-ai-three.vercel.app" // 🔥 NEW URL ADD
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// ✅ TEST
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

module.exports = app;