const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// ✅ SIMPLE & WORKING CORS
app.use(cors({
  origin: true,   // sab allow karega (safe for now)
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