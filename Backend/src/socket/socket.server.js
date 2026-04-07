const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const aiService = require("../services/ai.service");

const {
  createMemory,
  queryMemory,
  getEmbedding
} = require("../services/vector.service");

// 🔥 SMART MEMORY
const isImportantMemory = (text) => {
  const patterns = [
    /my name is/i,
    /i am \d+/i,
    /i live in/i,
    /i like/i,
    /i love/i,
    /my favorite/i,
    /i work as/i
  ];
  return patterns.some(p => p.test(text));
};

// 🔥 STREAM
const streamResponse = (socket, text) => {
  let i = 1;

  const interval = setInterval(() => {
    socket.emit("ai-stream", text.slice(0, i));
    i += 5;

    if (i >= text.length) {
      clearInterval(interval);
      socket.emit("ai-done");
    }
  }, 30);
};

function initSocketServer(httpServer) {

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true
    }
  });

  // 🔐 AUTH
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        socket.user = null;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      socket.user = user || null;
      next();

    } catch (err) {
      socket.user = null;
      next();
    }
  });

  // 🔌 CONNECTION
  io.on("connection", (socket) => {
    console.log("✅ Connected:", socket.id);

    socket.on("ai-message", async (data) => {
      try {
        const chatId = data.chatId || data.chat;
        const message = data.message;

        if (!chatId || !message) return;

        const senderId = socket.user?._id || null;

        // 🔥 PARALLEL
        const [embedding, matches] = await Promise.all([
          getEmbedding(message),
          queryMemory({ text: message, limit: 5, chatId })
        ]);

        // 🔹 SAVE USER MESSAGE
        const userMessage = await messageModel.create({
          chat: chatId,
          sender: senderId,
          content: message,
          role: "user",
          embedding
        });

        socket.emit("ai-response", userMessage);

        // 🔥 MEMORY SAVE (USER)
        if (isImportantMemory(message)) {
          createMemory({
            text: message,
            embedding,
            metadata: {
              role: "user",
              chatId,
              userId: senderId
            }
          });
        }

        // 🔥 MEMORY → SYSTEM FORMAT (IMPORTANT FIX)
        const uniqueMatches = [
          ...new Map(matches.map(m => [m.text, m])).values()
        ];

        const contextMessages = uniqueMatches
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 5)
          .map(m => ({
            role: "system",
            content: `User info: ${m.text}`
          }));

        // ✅ FINAL MESSAGES (NO SYSTEM HERE)
        const finalMessages = [
          ...contextMessages,
          { role: "user", content: message }
        ];

        // 🔥 TYPING ON
        socket.emit("ai-typing", true);

        // 🔹 AI RESPONSE
        const aiReply = await aiService.getAIResponse(finalMessages);

        // 🔥 TYPING OFF
        socket.emit("ai-typing", false);

        // 🔥 EMBEDDING
        let aiEmbedding = null;

        if (isImportantMemory(aiReply)) {
          aiEmbedding = await getEmbedding(aiReply);
        }

        // 🔹 SAVE AI MESSAGE
        const aiMessage = await messageModel.create({
          chat: chatId,
          sender: null,
          content: aiReply,
          role: "assistant",
          embedding: aiEmbedding
        });

        // 🔥 STREAM
        streamResponse(socket, aiReply);

        // ✅ FINAL AI RESPONSE
        socket.emit("ai-response", aiMessage);

        // 🔥 MEMORY SAVE (AI)
        if (aiEmbedding) {
          createMemory({
            text: aiReply,
            embedding: aiEmbedding,
            metadata: {
              role: "assistant",
              chatId,
              userId: senderId
            }
          });
        }

      } catch (err) {
        console.error("❌ Error:", err.message);
        socket.emit("ai-error", "Something went wrong");
      }
    });
  });
}

module.exports = { initSocketServer };