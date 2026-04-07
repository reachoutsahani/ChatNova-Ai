import "./InputSection.css";

const InputSection = ({
  input,
  isLoading,
  onInputChange,
  onKeyPress,
  onSend,
}) => {
  return (
    <div className="input-section">
      <div className="input-wrapper">
        <textarea
          className="message-input"
          value={input}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything..."
          disabled={isLoading}
          rows={1}
        />
        <button
          className={`send-btn ${isLoading ? "loading" : ""} ${!input.trim() ? "disabled" : ""}`}
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          title={isLoading ? "Sending..." : input.trim() ? "Send message (Enter)" : "Type something to send"}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg 
              className="loading-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1" opacity="0.5"></circle>
              <circle cx="16.5" cy="16.5" r="1" opacity="0.3"></circle>
            </svg>
          ) : (
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>
      <p className="input-hint">
        <kbd>↵</kbd> to send • <kbd>⇧↵</kbd> for new line
      </p>
    </div>
  );
};

export default InputSection;
