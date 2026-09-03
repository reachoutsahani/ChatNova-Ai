const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://chat-nova-ai-three.vercel.app",
  "https://chat-nova-ai-uzn8.vercel.app",
  "https://chat-nova-ai-git-main-reachoutsahanis-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman / server requests
      if (!origin) {
        return callback(null, true);
      }

      // Exact allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all ChatNova Vercel deployments
      if (
        origin.startsWith("https://chat-nova-") &&
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("❌ CORS Blocked:", origin);

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(cookieParser());

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ChatNova API is working 🚀",
  });
});

module.exports = app;