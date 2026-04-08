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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ================= LOAD CHATS =================
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

  // ================= SAVE CHATS =================
  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(previousChats));
  }, [previousChats]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    const chatEnd = document.getElementById("chat-end");
    chatEnd?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= TYPING EFFECT =================
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
    }, 15);
  };

  // ================= SEND MESSAGE =================
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

    // ✅ FIXED: single state update
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

      // ================= TYPING EFFECT =================
      setTypingMessageId(aiMessageId);
      typeText(aiResponse, aiMessageId);

      // ================= SAVE CHAT =================
      if (!activeChat) {
        const chatId = Date.now();

        const newChat = {
          id: chatId,
          title:
            messageContent.slice(0, 30) +
            (messageContent.length > 30 ? "..." : ""),
          messages: [
            userMessage,
            { ...aiMessage, content: aiResponse },
          ],
          createdAt: new Date().toISOString(),
        };

        setPreviousChats((prev) => [newChat, ...prev]);
        setActiveChat(chatId);
      } else {
        setPreviousChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    userMessage,
                    { ...aiMessage, content: aiResponse },
                  ],
                }
              : chat
          )
        );
      }

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

  // ================= ENTER KEY =================
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ================= CHAT ACTIONS =================
  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setActiveChat(null);
    setError(null);
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId) => {
    const selectedChat = previousChats.find((chat) => chat.id === chatId);

    setActiveChat(chatId);
    setMessages(selectedChat?.messages || []);
    setSidebarOpen(false);
    setInput("");
    setError(null);
  };

  const handleDeleteChat = (chatId) => {
    setPreviousChats((prev) =>
      prev.filter((chat) => chat.id !== chatId)
    );

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