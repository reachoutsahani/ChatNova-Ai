import { useEffect, useRef } from "react";
import "./MessagesArea.css";
import MessageBubble from "./MessageBubble";
import TypingMessage from "./TypingMessage";
import WelcomeSection from "./WelcomeSection";
import TypingIndicator from "./TypingIndicator";

/**
 * MessagesArea - Displays all chat messages with auto-scroll
 * Handles:
 * - Regular messages (static display)
 * - Typing animation messages (character-by-character animation)
 * - Streaming messages (real-time chunk updates)
 */
const MessagesArea = ({ messages, isLoading, onSuggestionClick, typingMessageId }) => {
  const messagesEndRef = useRef(null);

  // 🔥 Auto-scroll to latest message whenever messages change or loading state changes
  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "nearest"
      });
    }, 0);

    return () => clearTimeout(scrollTimeout);
  }, [messages, isLoading]);

  return (
    <div className="messages-area">
      {messages.length === 0 ? (
        <WelcomeSection onSuggestionClick={onSuggestionClick} />
      ) : (
        <div className="messages-container">
          {messages.map((msg) => {
            // 🔥 Use TypingMessage for AI responses with typing animation
            // (When using non-streaming endpoint for backward compatibility)
            if (msg.role === "ai" && msg.id === typingMessageId && msg.content) {
              return (
                <TypingMessage key={msg.id} message={msg} />
              );
            }
            // 🔥 Regular message display (for streaming messages or user messages)
            // Streaming messages update in real-time without animation
            return (
              <MessageBubble key={msg.id} message={msg} />
            );
          })}
          {/* Show loading indicator while waiting for AI response */}
          {isLoading && <TypingIndicator />}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessagesArea;
