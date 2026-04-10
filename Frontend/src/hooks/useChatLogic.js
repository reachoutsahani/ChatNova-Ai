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

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://chatnova-ai-hmq5.onrender.com";

  useEffect(() => {
    const savedChats = localStorage.getItem("chat-history");
    if (savedChats) {
      setPreviousChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(previousChats));
  }, [previousChats]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input.trim();
    const userMessage = { role: "user", content: messageContent };
    const aiMessage = { role: "ai", content: "Typing..." };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageContent }),
      });

      const data = await res.json();

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { ...msg, content: data.reply || "No response" }
            : msg
        )
      );
    } catch (err) {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // 🔥 Added missing functions
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const handleNewChat = () => setMessages([]);

  const handleSelectChat = (chat) => {
    setMessages(chat.messages);
    setActiveChat(chat.id);
  };

  const handleDeleteChat = (id) => {
    setPreviousChats((prev) => prev.filter((c) => c.id !== id));
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