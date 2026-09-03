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

  // Backend API URL
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://chatnova-ai-1-pmt0.onrender.com";

  useEffect(() => {
    const savedChats = localStorage.getItem("chat-history");

    if (savedChats) {
      try {
        setPreviousChats(JSON.parse(savedChats));
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "chat-history",
      JSON.stringify(previousChats)
    );
  }, [previousChats]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input.trim();

    const userMessage = {
      role: "user",
      content: messageContent,
    };

    const aiMessage = {
      role: "ai",
      content: "Typing...",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      aiMessage,
    ]);

    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
        }),
      });

      // Server error check
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                ...msg,
                content:
                  data.reply || "No response received",
              }
            : msg
        )
      );

    } catch (err) {
      console.error("Chat Error:", err);

      setError("Server error. Please try again.");

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                ...msg,
                content:
                  "⚠️ Server error. Please try again.",
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

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChat(null);
  };

  const handleSelectChat = (chat) => {
    setMessages(chat.messages || []);
    setActiveChat(chat.id);
  };

  const handleDeleteChat = (id) => {
    setPreviousChats((prev) =>
      prev.filter((chat) => chat.id !== id)
    );

    if (activeChat === id) {
      setMessages([]);
      setActiveChat(null);
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
    setError,
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