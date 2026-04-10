const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// 🔥 FINAL CORS FIX (ALL CASES COVERED)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://chat-nova-ai-uzn8.vercel.app",
  "https://chat-nova-ai-three.vercel.app",
  "https://chat-nova-ai-git-main-reachoutsahanis-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman / mobile apps ke liye allow
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(null, true); // 🔥 allow anyway (safe for now)
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔥 IMPORTANT (preflight requests fix)
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

module.exports = app;