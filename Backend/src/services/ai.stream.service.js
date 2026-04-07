const axios = require("axios");

// 🔥 SYSTEM INSTRUCTION - ChatGPT-Like Behavior
const systemPrompt = `You are ChatNova, a helpful, friendly, and intelligent AI assistant inspired by ChatGPT.

PERSONALITY:
- Conversational and natural tone
- Genuinely helpful and empathetic
- Not robotic or overly formal
- Can be slightly witty when appropriate

COMMUNICATION STYLE:
- Start with a direct answer
- Use clear, simple language
- Break complex topics into digestible pieces
- Use formatting when helpful: bullet points, numbered lists, headers
- Include examples to illustrate concepts
- Ask clarifying questions if needed

RESPONSE QUALITY:
- Be thorough but concise
- Provide useful specific advice
- Explain the "why" when helpful
- Acknowledge limitations honestly
- Offer alternatives when relevant

SAFETY & ETHICS:
- Don't provide harmful content
- Be honest about uncertainty
- Respect privacy
- Stay impartial on controversial topics

MEMORY:
- Use conversation history to provide continuity
- Reference previous messages naturally when relevant
- Don't repeat information already provided

ALWAYS:
- Be helpful and friendly
- Tailor responses to the user's needs
- Format responses for readability`;

/**
 * Get AI response stream using OpenRouter API
 * Streams response chunks in real-time (like ChatGPT)
 * @param {Array} messages - Array of message objects with role and content
 * @param {Function} onChunk - Callback function called for each chunk received
 * @returns {Promise<string>} - Full AI response text
 */
const getAIResponseStream = async (messages, onChunk) => {
  try {
    // Validate messages format
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid message format: messages must be a non-empty array");
    }

    // 🔥 Validate each message has required fields
    const validMessages = messages.filter(msg => {
      if (!msg.role || !msg.content) {
        console.warn("⚠️ Skipping invalid message:", msg);
        return false;
      }
      return true;
    });

    if (validMessages.length === 0) {
      throw new Error("No valid messages provided");
    }

    console.log("📤 Starting streaming response from AI:");
    validMessages.forEach((msg, idx) => {
      console.log(`  [${idx + 1}] ${msg.role}: ${msg.content.substring(0, 40)}...`);
    });

    // 🔥 Build messages with system prompt
    const finalMessages = [
      { role: "system", content: systemPrompt },
      ...validMessages
    ];

    // 🔥 Make streaming request to OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000,
        stream: true, // 🔥 ENABLE STREAMING
        messages: finalMessages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ChatNova"
        },
        responseType: "stream" // 🔥 IMPORTANT: Set response type to stream
      }
    );

    console.log("🌊 Stream started, receiving chunks...");

    // 🔥 Process streaming response
    let fullResponse = "";
    let chunkCount = 0;

    return new Promise((resolve, reject) => {
      response.data.on("data", (chunk) => {
        try {
          chunkCount++;
          
          // 🔥 Parse SSE format: "data: {json}\n\n"
          const lines = chunk.toString().split("\n");

          lines.forEach((line) => {
            // Skip empty lines and non-data lines
            if (!line || !line.startsWith("data: ")) return;

            // Remove "data: " prefix
            const jsonStr = line.slice(6);

            // Handle stream termination
            if (jsonStr === "[DONE]") {
              console.log(`✅ Stream complete after ${chunkCount} chunks`);
              resolve(fullResponse);
              return;
            }

            try {
              // 🔥 Parse JSON chunk
              const parsed = JSON.parse(jsonStr);
              const token = parsed?.choices?.[0]?.delta?.content;

              if (token) {
                fullResponse += token;
                console.log(`💬 Chunk ${chunkCount}: ${token.substring(0, 30)}...`);

                // 🔥 Call callback with streaming token
                if (onChunk && typeof onChunk === "function") {
                  onChunk(token);
                }
              }
            } catch (parseError) {
              // Silent fail on JSON parse errors (some lines may not be valid JSON)
            }
          });
        } catch (error) {
          console.error("❌ Error processing chunk:", error.message);
        }
      });

      // 🔥 Handle stream end
      response.data.on("end", () => {
        console.log("🏁 Stream ended");
        if (fullResponse) {
          resolve(fullResponse);
        } else {
          reject(new Error("No response received from AI"));
        }
      });

      // 🔥 Handle stream errors
      response.data.on("error", (error) => {
        console.error("❌ Stream error:", error.message);
        reject(error);
      });
    });

  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error("❌ AI STREAM SERVICE ERROR:", errorMsg);

    // Handle specific API errors
    if (error.response?.status === 429) {
      throw new Error("API rate limit exceeded. Please try again in a moment.");
    }
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please check API key configuration.");
    }

    throw error;
  }
};

module.exports = { getAIResponseStream };
