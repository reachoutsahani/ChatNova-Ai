/* ============================================
   TYPING INDICATOR COMPONENT
   Shows loading state while AI is processing
   ============================================ */

const TypingIndicator = () => {
  return (
    <div className="message-wrapper ai">
      <div className="message-bubble loading">
        <span className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
