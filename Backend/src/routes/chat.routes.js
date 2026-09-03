const express = require("express");
const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Chat route working ✅"
  });
});

// AI CHAT ROUTE
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // Message validation
    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "⚠️ Message is required"
      });
    }

    // API Key validation
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY is missing");

      return res.status(500).json({
        reply: "⚠️ Server API key is missing"
      });
    }

    console.log("📩 User:", message);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://chat-nova-ai-three.vercel.app",
          "X-Title": "ChatNova AI"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content: "Reply helpfully and concisely."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OpenRouter Status:", response.status);

    // OpenRouter error
    if (!response.ok) {
      console.error("❌ OpenRouter Error:", data);

      return res.status(response.status).json({
        reply: "⚠️ AI service error",
        error: data?.error?.message || "Unknown error"
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("❌ CHAT SERVER ERROR:", error);

    return res.status(500).json({
      reply: "⚠️ AI server error. Please try again."
    });
  }
});

module.exports = router;
