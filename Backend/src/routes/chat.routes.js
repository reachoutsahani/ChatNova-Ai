const express = require("express");
const router = express.Router();

const {
  chatWithAI,
  getUserChats,
  getSingleChat,
  deleteChat
} = require("../controllers/chat.controller");

const { chatWithAIStream } = require("../controllers/chat.stream.controller");

const authMiddleware = require("../middleware/auth.middleware");

// 🔹 Test endpoint (no auth required - for debugging)
router.post("/test", chatWithAI);

// 🔹 Streaming test endpoint (no auth required - for debugging)
// Returns Server-Sent Events with real-time response chunks
router.post("/stream-test", chatWithAIStream);

// 🔹 Create chat (requires auth)
router.post("/chat", authMiddleware, chatWithAI);

// 🔹 Get all chats
router.get("/chats", authMiddleware, getUserChats);

// 🔹 Get single chat
router.get("/chat/:id", authMiddleware, getSingleChat);

// 🔹 Delete chat
router.delete("/chat/:id", authMiddleware, deleteChat);

// 🔹 Health check
router.get("/health", (req, res) => {
  res.send("Chat API working ✅");
});

module.exports = router;