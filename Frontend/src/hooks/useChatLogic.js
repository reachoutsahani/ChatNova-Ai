import { useState, useEffect } from "react";

/* ============================================
   USE CHAT LOGIC HOOK
   Manages all chat-related state and logic
   ============================================ */

const useChatLogic = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [previousChats, setPreviousChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);

  // ============================================
  // LOAD CHATS FROM LOCALSTORAGE
  // ============================================
  useEffect(() => {
    const savedChats = localStorage.getItem("chat-history");
    if (savedChats) {
      try {
        setPreviousChats(JSON.parse(savedChats));
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }
  }, []);

  // ============================================
  // SAVE CHATS TO LOCALSTORAGE
  // ============================================
  useEffect(() => {
    if (previousChats.length > 0) {
      localStorage.setItem("chat-history", JSON.stringify(previousChats));
    }
  }, [previousChats]);

  // ============================================
  // SEND MESSAGE TO AI WITH CONVERSATION HISTORY
  // ============================================
  const handleSend = async () => {
    if (!input.trim()) return;

    const messageContent = input.trim();
    const userMessageId = Date.now();
    const aiMessageId = Date.now() + 1;

    // 🔥 Create user message object
    const userMessage = {
      id: userMessageId,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // 🔥 Add user message to chat instantly (don't wait for AI)
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    // 🔥 Pre-create AI message with empty content for typing animation
    const aiMessage = {
      id: aiMessageId,
      role: "ai",
      content: "",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // 🔥 Add placeholder AI message for streaming chunks to update
    setMessages((prev) => [...prev, aiMessage]);
    // 🔥 Don't set typingMessageId - streaming will update content in real-time

    try {
      console.log("📤 Sending message:", messageContent);
      console.log("📍 API Endpoint: http://localhost:3000/api/chat/stream-test");
      console.log(`📊 Conversation history length: ${messages.length}`);

      // 🔥 Build conversation history in OpenAI format
      const conversationHistory = messages
        .filter((msg) => msg.role === "user" || msg.role === "ai")
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content || "",
        }));

      console.log("💭 Sending history with messages:", conversationHistory.length);

      // 🔥 STREAMING: Use EventSource to receive real-time chunks instead of waiting for full response
      console.log("📡 Opening streaming connection...");

      // Prepare request body
      const requestBody = {
        message: messageContent,
        conversationHistory: conversationHistory,
      };

      // 🔥 Create a fetch request that sends POST data and opens an event stream
      const streamResponse = await fetch("http://localhost:3000/api/chat/stream-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📊 Stream Response Status:", streamResponse.status, streamResponse.statusText);

      if (!streamResponse.ok) {
        const errorData = await streamResponse.text();
        console.error("❌ Stream Error Response:", errorData);
        throw new Error(`Stream Error ${streamResponse.status}: ${streamResponse.statusText}`);
      }

      // 🔥 Read the stream and process chunks
      const reader = streamResponse.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamComplete = false;

      // 🔥 Accumulate AI response from chunks
      let fullAIResponse = "";

      while (!streamComplete) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("🏁 Stream reading complete");
          break;
        }

        // 🔥 Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // 🔥 Process complete lines (SSE format: data: ...\n\n)
        const lines = buffer.split("\n\n");
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data: ")) continue;

          try {
            // 🔥 Parse SSE event data
            const eventData = JSON.parse(line.slice(6));

            if (eventData.type === "chunk") {
              // 🔥 Chunk event: token from AI
              const token = eventData.token || "";
              console.log(`💬 Chunk received: ${token.substring(0, 30)}...`);

              fullAIResponse += token;

              // 🔥 Update AI message content progressively (real-time display)
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: fullAIResponse }
                    : msg
                )
              );
            } else if (eventData.type === "complete") {
              // 🔥 Complete event: stream finished successfully
              console.log(
                "✅ Stream complete, full response length:",
                eventData.fullResponse?.length || fullAIResponse.length
              );
              streamComplete = true;

              // 🔥 Ensure full response is set
              if (eventData.fullResponse) {
                fullAIResponse = eventData.fullResponse;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: fullAIResponse }
                      : msg
                  )
                );
              }
            } else if (eventData.type === "error") {
              // 🔥 Error event: something went wrong
              console.error("❌ Stream error:", eventData.error);
              throw new Error(eventData.error || "Stream processing error");
            }
          } catch (parseError) {
            console.warn("⚠️ Warning parsing SSE event:", parseError.message);
            // Continue processing other events
          }
        }
      }

      // 🔥 Create new chat if this is the first message
      if (!activeChat) {
        const chatId = Date.now();
        const newChat = {
          id: chatId,
          title:
            messageContent.slice(0, 30) +
            (messageContent.length > 30 ? "..." : ""),
          createdAt: new Date().toISOString(),
        };
        setPreviousChats((prev) => [newChat, ...prev]);
        setActiveChat(chatId);
        console.log("📝 New chat created with ID:", chatId);
      }
    } catch (err) {
      const errorMsg = err.message || "Something went wrong!";
      console.error("❌ Error in handleSend:", errorMsg);
      setError(errorMsg);

      // 🔥 Update the AI message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: `⚠️ Error: ${errorMsg}. Please try again.`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      // Don't clear typingMessageId - not used for streaming
    }
  };

  // ============================================
  // HANDLE KEYBOARD INPUT
  // ============================================
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ============================================
  // CREATE NEW CHAT
  // ============================================
  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setActiveChat(null);
    setError(null);
    setSidebarOpen(false);
  };

  // ============================================
  // SELECT PREVIOUS CHAT
  // ============================================
  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    setSidebarOpen(false);
    // In a real app, load messages from that chat
    // For now, we're clearing messages when switching chats
    setMessages([]);
    setInput("");
    setError(null);
  };

  // ============================================
  // DELETE CHAT
  // ============================================
  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    setPreviousChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChat === chatId) {
      handleNewChat();
    }
  };

  // ============================================
  // TOGGLE SIDEBAR
  // ============================================
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // ============================================
  // CLOSE SIDEBAR
  // ============================================
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return {
    // State
    messages,
    input,
    previousChats,
    activeChat,
    isLoading,
    error,
    sidebarOpen,
    typingMessageId,

    // Setters
    setInput,
    setError,
    setTypingMessageId,

    // Handlers
    handleSend,
    handleKeyPress,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    toggleSidebar,
    closeSidebar,
  };
};

export default useChatLogic;
