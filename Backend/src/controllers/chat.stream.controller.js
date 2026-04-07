const Chat = require("../models/chat.model");
const { getAIResponseStream } = require("../services/ai.stream.service");
const mongoose = require("mongoose");

// ================= CHAT WITH AI STREAMING =================
/**
 * Streams AI response to frontend using Server-Sent Events (SSE)
 * Shows response in real-time like ChatGPT
 */
const chatWithAIStream = async (req, res) => {
  try {
    // 🔥 Extract message and conversation history from request
    const { message, conversationHistory = [] } = req.body;
    console.log("📍 Incoming streaming request - Message:", message);
    console.log("📍 Conversation history length:", conversationHistory.length);

    // 🔥 Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be a non-empty string",
      });
    }

    const messageContent = message.trim();

    // 🔥 Generate user ID
    const TEST_USER_ID = new mongoose.Types.ObjectId("000000000000000000000001");
    const userId = req.user?.id || TEST_USER_ID;

    // 🔥 Build messages array for AI (include full conversation history)
    const messagesForAI = [
      ...conversationHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content || msg.message || ""
      })),
      { role: "user", content: messageContent }
    ];

    console.log("🤖 Sending to streaming AI service - Total messages:", messagesForAI.length);

    // 🔥 Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // 🔥 Track full response for database saving
    let fullAIResponse = "";

    // 🔥 Callback function - called for each chunk received from AI
    const handleChunk = (token) => {
      fullAIResponse += token;
      
      // 🔥 Send chunk to frontend via SSE format
      // Format: data: <json>\n\n
      const eventData = {
        type: "chunk",
        token: token,
        timestamp: new Date().toISOString()
      };

      res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      console.log(`📡 Sent chunk to frontend: ${token.substring(0, 20)}...`);
    };

    // 🔥 Call streaming AI service
    try {
      await getAIResponseStream(messagesForAI, handleChunk);

      console.log("✅ Streaming complete, full response length:", fullAIResponse.length);

      // 🔥 Save complete chat to database (optional)
      try {
        await Chat.create({
          userId,
          message: messageContent,
          response: fullAIResponse,
          lastActivity: new Date(),
        });
        console.log("💾 Chat saved to database");
      } catch (dbError) {
        console.error("⚠️ Database save error:", dbError.message);
        // Don't fail the stream if DB save fails
      }

      // 🔥 Send completion event
      const completeEvent = {
        type: "complete",
        fullResponse: fullAIResponse,
        timestamp: new Date().toISOString()
      };

      res.write(`data: ${JSON.stringify(completeEvent)}\n\n`);
      console.log(`✅ Sent completion event to frontend`);

      // 🔥 Close the stream
      res.end();

    } catch (aiError) {
      console.error("❌ AI Streaming Error:", aiError.message);

      // 🔥 Send error event
      const errorEvent = {
        type: "error",
        error: aiError.message,
        timestamp: new Date().toISOString()
      };

      res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
      res.end();
    }

  } catch (error) {
    // 🔥 Comprehensive error logging
    console.error("❌ ERROR in chatWithAIStream:");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    // 🔥 Try to send error event if headers not yet sent
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Server error: Failed to start stream",
        error: error.message,
      });
    } else {
      // If headers already sent, try to send error via SSE
      try {
        const errorEvent = {
          type: "error",
          error: error.message,
          timestamp: new Date().toISOString()
        };
        res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
        res.end();
      } catch (e) {
        res.end();
      }
    }
  }
};

module.exports = { chatWithAIStream };
