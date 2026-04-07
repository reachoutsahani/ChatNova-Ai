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

  // 🔥 IMPORTANT: API URL (FROM ENV)
  const API_URL = import.meta.env.VITE_API_URL;

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

  useEffect(() => {
    if (previousChats.length > 0) {
      localStorage.setItem("chat-history", JSON.stringify(previousChats));
    }
  }, [previousChats]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageContent = input.trim();
    const userMessageId = Date.now();
    const aiMessageId = Date.now() + 1;

    const userMessage = {
      id: userMessageId,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    const aiMessage = {
      id: aiMessageId,
      role: "ai",
      content: "",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      if (!API_URL) {
        throw new Error("API URL not set in .env");
      }

      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content || "",
      }));

      const requestBody = {
        message: messageContent,
        conversationHistory,
      };

      // ✅ FIXED API CALL
      const response = await fetch(`${API_URL}/api/chat/stream-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse = data.reply || data.message || "No response";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: aiResponse }
            : msg
        )
      );

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
      }
    } catch (err) {
      const errorMsg = err.message || "Something went wrong!";
      setError(errorMsg);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: `⚠️ Error: ${errorMsg}`,
              }
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

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setActiveChat(null);
    setError(null);
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    setSidebarOpen(false);
    setMessages([]);
    setInput("");
    setError(null);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    setPreviousChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChat === chatId) {
      handleNewChat();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
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
    setError,
    setTypingMessageId,
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