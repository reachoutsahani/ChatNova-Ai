const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// 🔥 MIDDLEWARE (FIXED)
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 🔥 ROUTES (FIXED CLEAN STRUCTURE)
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

module.exports = app;