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
      return res.status(500).json({
        reply: "Server error: API key missing",
      });
    }

    if (!message) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    console.time("⚡ Gemini Response");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);
    const response = await result.response;

    console.timeEnd("⚡ Gemini Response");

    res.json({
      reply: response.text() || "No response from AI",
    });

  } catch (error) {
    console.error("❌ SERVER ERROR FULL:", error);

    res.status(500).json({
      reply: "⚠️ AI error, try again later",
    });
  }
});

module.exports = router;