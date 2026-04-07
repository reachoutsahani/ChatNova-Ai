const Chat = require("../models/chat.model");
const { getAIResponse } = require("../services/ai.service");
const mongoose = require("mongoose");

// ================= CHAT WITH AI (IMPROVED) =================
const chatWithAI = async (req, res) => {
  try {
    // 🔥 Extract message and conversation history from request
    const { message, conversationHistory = [] } = req.body;
    console.log("📍 Incoming request - Message:", message);
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

    console.log("🤖 Sending to AI service - Total messages:", messagesForAI.length);

    // 🔥 Call AI service with conversation history
    let aiResponse;
    try {
      aiResponse = await getAIResponse(messagesForAI);
    } catch (aiError) {
      console.error("❌ AI Service Error:", aiError.message);
      // Fallback response
      aiResponse = `I encountered an error processing your request: ${aiError.message}`;
    }

    // 🔥 Validate AI response
    if (!aiResponse || typeof aiResponse !== "string") {
      aiResponse = "I'm having trouble generating a response. Please try again.";
    }

    console.log("✅ AI Response received, length:", aiResponse.length);

    // 🔥 Save to database (optional - for chat history)
    let savedChat = null;
    try {
      savedChat = await Chat.create({
        userId,
        message: messageContent,
        response: aiResponse,
        lastActivity: new Date(),
      });
      console.log("💾 Chat saved to database:", savedChat._id);
    } catch (dbError) {
      console.error("⚠️ Database save error:", dbError.message);
      // Don't fail the API response if DB save fails
    }

    // 🔥 Return ChatGPT-like response format
    res.status(200).json({
      success: true,
      chat: {
        _id: savedChat?._id || new mongoose.Types.ObjectId(),
        message: messageContent,
        response: aiResponse,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    // 🔥 Comprehensive error logging
    console.error("❌ ERROR in chatWithAI:");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    // 🔥 Return error response
    res.status(500).json({
      success: false,
      message: "Server error: Failed to process chat request",
      error: error.message,
    });
  }
};


// ================= GET USER CHATS =================
const getUserChats = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const chats = await Chat.find({ userId: req.user.id })
      .sort({ lastActivity: -1 });

    res.status(200).json({
      success: true,
      chats,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ================= GET SINGLE CHAT =================
const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id, // 🔥 secure
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ================= DELETE CHAT =================
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id, // 🔥 secure
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    await chat.deleteOne();

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  chatWithAI,
  getUserChats,
  getSingleChat,
  deleteChat,
};