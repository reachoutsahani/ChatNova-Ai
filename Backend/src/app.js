const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// ✅ FIXED CORS (IMPORTANT)
app.use(cors({
  origin: "*",   // allow all (Vercel + local)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
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