import { useState, useEffect } from "react";
import "./MessageBubble.css";

/**
 * TypingMessage - Displays AI response with character-by-character typing animation
 * Creates a smooth, ChatGPT-like typing effect
 */
const TypingMessage = ({ message, onTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!message?.content) return;

    let currentIndex = 0;
    const fullText = message.content;
    
    // 🔥 Typing speed: 30-50ms per character for natural feel
    const typingSpeed = 30;

    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;

        // If we've typed all characters, mark as complete
        if (currentIndex > fullText.length) {
          setIsComplete(true);
          onTypingComplete?.();
          clearInterval(timer);
        }
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [message?.content, onTypingComplete]);

  return (
    <div className={`message-bubble ${message.role}`}>
      <div className="message-content">
        {/* Display typed text with cursor effect */}
        <p className="message-text">
          {displayedText}
          {!isComplete && <span className="typing-cursor">▋</span>}
        </p>
        {message.timestamp && (
          <span className="message-timestamp">{message.timestamp}</span>
        )}
      </div>
    </div>
  );
};

export default TypingMessage;
