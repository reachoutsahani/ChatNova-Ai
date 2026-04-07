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
 * Get AI response using OpenRouter API
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<string>} - AI response text
 */
const getAIResponse = async (messages) => {
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

    console.log("📤 Sending conversation history to AI:");
    validMessages.forEach((msg, idx) => {
      console.log(`  [${idx + 1}] ${msg.role}: ${msg.content.substring(0, 50)}...`);
    });

    // 🔥 Build messages with system prompt
    const finalMessages = [
      { role: "system", content: systemPrompt },
      ...validMessages
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000,
        messages: finalMessages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ChatNova"
        }
      }
    );

    // 🔥 Safely extract AI response
    const aiText = response?.data?.choices?.[0]?.message?.content?.trim();

    if (!aiText) {
      console.warn("⚠️ AI returned empty response");
      throw new Error("AI returned empty response");
    }

    console.log("✅ AI Response received:", aiText.substring(0, 100) + "...");
    return aiText;

  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error("❌ AI SERVICE ERROR:", errorMsg);
    console.error("Full error:", error.response?.data || error);

    // Return user-friendly error message
    if (error.response?.status === 429) {
      return "API rate limit exceeded. Please try again in a moment.";
    }
    if (error.response?.status === 401) {
      return "Authentication failed. Please check API key configuration.";
    }
    
    return `Error: ${errorMsg}`;
  }
};

module.exports = { getAIResponse };