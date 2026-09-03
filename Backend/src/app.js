const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  "https://chat-nova-ai-three.vercel.app",
  "https://chat-nova-ai-uzn8.vercel.app",
  "https://chat-nova-ai-git-main-reachoutsahanis-projects.vercel.app",
];

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost
      if (
        origin === "http://localhost:5173" ||
        origin === "http://localhost:3000"
      ) {
        return callback(null, true);
      }

      // Allow all your Vercel deployments
      if (
        origin.startsWith("https://chat-nova-ai") &&
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("❌ CORS Blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

module.exports = app;