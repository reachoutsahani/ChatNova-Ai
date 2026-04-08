const express = require("express");
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Chat route working ✅" });
});

// ✅ CHAT ROUTE
router.post("/", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "ChatNova AI",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          ...(conversationHistory || []),
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      return res.status(response.status).json({ error: "API Error" });
    }

    const reply =
      data?.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

module.exports = router;