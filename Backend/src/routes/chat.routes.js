const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🔐 API KEY INIT
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Chat route working ✅" });
});

// ✅ CHAT ROUTE (FINAL FIXED)
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // ❌ API KEY CHECK
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI API KEY MISSING");
      return res.json({
        reply: "⚠️ Server config error (API key missing)",
      });
    }

    // ❌ MESSAGE CHECK
    if (!message || !message.trim()) {
      return res.json({
        reply: "⚠️ Message is required",
      });
    }

    console.log("📩 User:", message);
    console.time("⚡ Gemini Response");

    // 🔥 UPDATED MODEL
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    let replyText = "";

    try {
      const result = await model.generateContent(message);
      const response = await result.response;
      replyText = response.text();
    } catch (aiError) {
      console.error("❌ Gemini Error:", aiError.message);

      // 🔥 FALLBACK RESPONSE (VERY IMPORTANT)
      replyText = `You said: ${message}`;
    }

    console.timeEnd("⚡ Gemini Response");

    res.json({
      reply: replyText || "No response from AI",
    });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);

    res.json({
      reply: "⚠️ Server error, try again later",
    });
  }
});

module.exports = router;