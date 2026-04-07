import "./MessageBubble.css";

const MessageBubble = ({ message }) => {
  return (
    <div className={`message-bubble ${message.role}`}>
      <div className="message-content">
        <p className="message-text">{message.content}</p>
        {message.timestamp && (
          <span className="message-timestamp">{message.timestamp}</span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
