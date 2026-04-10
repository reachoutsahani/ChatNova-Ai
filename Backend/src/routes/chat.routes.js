const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🔐 API KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Chat route working ✅" });
});

// ✅ CHAT ROUTE
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI API KEY MISSING");
      return res.status(500).json({ error: "API key not configured" });
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.time("⚡ Gemini Response");

    // 🔥 FAST MODEL
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);
    const response = await result.response;

    console.timeEnd("⚡ Gemini Response");

    res.json({
      reply: response.text(),
    });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error.message);

    res.status(500).json({
      error: "AI error or server issue",
    });
  }
});

module.exports = router;