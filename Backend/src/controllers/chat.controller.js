const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const messageContent = message.trim();

    // 🔥 Simple AI response (safe fallback)
    let aiResponse;
    try {
      aiResponse = await getAIResponse([
        ...conversationHistory,
        { role: "user", content: messageContent },
      ]);
    } catch (err) {
      aiResponse = `You said: ${messageContent}`; // fallback
    }

    // 🔥 IMPORTANT FIX (frontend ke liye)
    return res.status(200).json({
      reply: aiResponse,
    });

  } catch (error) {
    console.error("Error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};