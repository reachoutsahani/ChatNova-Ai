const express = require("express");
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3-8b-instruct";

// ✅ TEST
router.get("/test", (req, res) => {
  res.json({ message: "Chat route working ✅" });
});

// ✅ CHAT
router.post("/", async (req, res) => {
  try {
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

    // 🔥 MAIN REQUEST
    let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chat-nova-ai-three.vercel.app",
        "X-Title": "ChatNova"
      },
      body: JSON.stringify({
        model: MODEL, // 🔥 env based
        messages: [
          ...(conversationHistory || []),
          { role: "user", content: message },
        ],
      }),
      signal: controller.signal,
    });

    let data = await response.json();

    // 🔥 AUTO FALLBACK (agar model fail ho)
    if (!response.ok) {
      console.warn("⚠️ Primary model failed, switching to fallback...");

      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct", // fallback
          messages: [
            ...(conversationHistory || []),
            { role: "user", content: message },
          ],
        }),
      });

      data = await response.json();
    }

    console.timeEnd("AI Response");

    const reply = data?.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error.message);
    res.status(500).json({ error: "Server error or timeout" });
  }
});

module.exports = router;