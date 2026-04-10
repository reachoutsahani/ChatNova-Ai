const express = require("express");
const router = express.Router();

// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Chat route working ✅" });
});

// ✅ FAST FREE AI ROUTE (OpenRouter AUTO)
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // ❌ Message check
    if (!message || !message.trim()) {
      return res.json({
        reply: "⚠️ Message is required",
      });
    }

    console.log("📩 User:", message);
    console.time("⚡ AI Response");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto", // 🔥 FASTEST FREE MODEL
        messages: [
          { role: "system", content: "Reply short and fast" },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    console.timeEnd("⚡ AI Response");

    const reply =
      data?.choices?.[0]?.message?.content ||
      `You said: ${message}`;

    res.json({ reply });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);

    res.json({
      reply: "⚠️ AI error, try again",
    });
  }
});

module.exports = router;