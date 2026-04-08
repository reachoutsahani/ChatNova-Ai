const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// ✅ PERFECT CORS FIX
const corsOptions = {
  origin: [
    "http://localhost:5173",   // local frontend
    "https://your-frontend-url.vercel.app" // deployed frontend (change this)
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// 🔥 IMPORTANT (preflight fix)
app.options("*", cors(corsOptions));

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