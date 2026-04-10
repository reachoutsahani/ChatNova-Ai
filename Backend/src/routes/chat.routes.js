const express = require("express");
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ✅ TEST
router.get("/test", (req, res) => {
  res.json({ message: "Chat route working ✅" });
});

// ✅ CHAT
router.post("/", async (req, res) => {
  try {
    // 🔥 API KEY CHECK
    if (!OPENROUTER_API_KEY) {
      console.error("❌ API KEY MISSING");
      return res.status(500).json({ error: "API key not configured" });
    }

    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.time("AI Response");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chat-nova-ai-three.vercel.app", // 🔥 optional but good
        "X-Title": "ChatNova"
      },
      body: JSON.stringify({
        // ✅ FIXED MODEL (WORKING)
     model: "mistralai/mistral-7b-instruct:free",

        messages: [
          ...(conversationHistory || []),
          { role: "user", content: message },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("❌ Invalid JSON");
      return res.status(500).json({ error: "Invalid response from AI" });
    }

    console.timeEnd("AI Response");

    if (!response.ok) {
      console.error("❌ OPENROUTER ERROR:", data);
      return res.status(500).json({
        error: data?.error?.message || "OpenRouter API Error"
      });
    }

    const reply = data?.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error.message);
    res.status(500).json({ error: "Server error or timeout" });
  }
});

module.exports = router;