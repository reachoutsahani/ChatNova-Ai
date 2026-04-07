import "./Home.css";
import useChatLogic from "../hooks/useChatLogic";
import {
  Sidebar,
  ChatHeader,
  MessagesArea,
  InputSection,
  ErrorBanner,
} from "./components";

/* ============================================
   HOME PAGE COMPONENT
   Main chat interface container
   ============================================ */

const Home = () => {
  // ============================================
  // USE CUSTOM HOOK FOR CHAT LOGIC
  // ============================================
  const {
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
  } = useChatLogic();

  // ============================================
  // HANDLE SUGGESTION CLICK
  // ============================================
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="home">
      {/* Sidebar - Previous Chats */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        previousChats={previousChats}
        activeChat={activeChat}
        onCloseSidebar={closeSidebar}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Chat Container */}
      <div className="chat-container">
        {/* Chat Header */}
        <ChatHeader onMenuToggle={toggleSidebar} />

        {/* Messages Area */}
        <MessagesArea
          messages={messages}
          isLoading={isLoading}
          typingMessageId={typingMessageId}
          onSuggestionClick={handleSuggestionClick}
        />

        {/* Error Banner */}
        <ErrorBanner error={error} onClose={() => setError(null)} />

        {/* Input Section */}
        <InputSection
          input={input}
          isLoading={isLoading}
          onInputChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

export default Home;