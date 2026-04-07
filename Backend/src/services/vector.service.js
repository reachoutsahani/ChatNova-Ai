const axios = require("axios");
const mongoose = require("mongoose");

require("dotenv").config();

// ✅ SCHEMA
const memorySchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
  chatId: String,
  role: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Memory = mongoose.model("Memory", memorySchema);

// 🔹 EMBEDDING
const getEmbedding = async (text) => {
  try {
    if (!text || text.trim() === "") return [];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/embeddings",
      {
        model: "openai/text-embedding-3-small",
        input: text
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const embedding = response?.data?.data?.[0]?.embedding;

    console.log("🔢 Embedding length:", embedding?.length);

    return embedding || [];

  } catch (err) {
    console.error("❌ Embedding Error:", err.response?.data || err.message);
    return [];
  }
};

// 🔹 SAVE MEMORY
const createMemory = async ({ text, metadata = {} }) => {
  try {
    if (!text) return;

    const embedding = await getEmbedding(text);
    if (!embedding.length) return;

    await Memory.create({
      text,
      embedding,
      chatId: metadata.chatId || null,
      role: metadata.role || "user",
      userId: metadata.userId || null
    });

    console.log("✅ Memory Saved");

  } catch (err) {
    console.error("❌ Memory Save Error:", err.message);
  }
};

// 🔹 QUERY MEMORY
const queryMemory = async ({ text, limit = 5, chatId }) => {
  try {
    if (!text) return [];

    const embedding = await getEmbedding(text);
    if (!embedding.length) return [];

    const results = await Memory.aggregate([
      {
        $vectorSearch: {
          index: "chatnova",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: limit,
          filter: {
            chatId: { $eq: chatId }
          }
        }
      }
    ]);

    return results;

  } catch (err) {
    console.error("❌ Memory Query Error:", err.message);
    return [];
  }
};

module.exports = {
  createMemory,
  queryMemory,
  getEmbedding // 🔥 added
};