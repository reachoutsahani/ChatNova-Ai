import "./ChatHeader.css";

const ChatHeader = ({ onMenuToggle }) => {
  return (
    <header className="chat-header">
      <div className="header-content">
        <button
          className="menu-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          ☰
        </button>
        <h2 className="chat-title">ChatNova</h2>
      </div>
    </header>
  );
};

export default ChatHeader;
