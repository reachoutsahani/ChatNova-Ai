import { useState, useEffect } from "react";

const useChatLogic = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [previousChats, setPreviousChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);

  // 🔥 FINAL FIX (NO localhost fallback)
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedChats = localStorage.getItem("chat-history");
    if (savedChats) {
      try {
        setPreviousChats(JSON.parse(savedChats));
      } catch (err) {
        console.error("Error loading chats:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(previousChats));
  }, [previousChats]);

  useEffect(() => {
    const chatEnd = document.getElementById("chat-end");
    chatEnd?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typeText = (text, messageId) => {
    let index = 0;

    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: text.slice(0, index) }
            : msg
        )
      );

      index++;
      if (index > text.length) {
        clearInterval(interval);
        setTypingMessageId(null);
      }
    }, 10);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input.trim();
    const userMessageId = Date.now();
    const aiMessageId = Date.now() + 1;

    const userMessage = {
      id: userMessageId,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString(),
    };

    const aiMessage = {
      id: aiMessageId,
      role: "ai",
      content: "Typing...",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);

    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.reply || "No response";

      setTypingMessageId(aiMessageId);
      typeText(aiResponse, aiMessageId);

    } catch (err) {
      console.error("API Error:", err);
      setError(err.message);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: "⚠️ Error: Try again" }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    messages,
    input,
    previousChats,
    activeChat,
    isLoading,
    error,
    sidebarOpen,
    typingMessageId,

    setInput,
    handleSend,
    handleKeyPress,
  };
};

export default useChatLogic;