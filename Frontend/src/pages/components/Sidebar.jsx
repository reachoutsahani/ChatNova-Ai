import "./Sidebar.css";

const Sidebar = ({
  sidebarOpen,
  previousChats,
  activeChat,
  onCloseSidebar,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""} ${!sidebarOpen ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">ChatNova</h3>
          <button
            className="sidebar-close-btn"
            onClick={onCloseSidebar}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <button
          className="new-chat-btn"
          onClick={onNewChat}
          title="Start a new conversation"
        >
          <span className="btn-icon">+</span>
          <span className="btn-text">New Chat</span>
        </button>

        <div className="chats-list">
          {previousChats.length === 0 ? (
            <p className="no-chats-message">No chats yet</p>
          ) : (
            previousChats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${activeChat === chat.id ? "active" : ""}`}
                onClick={() => onSelectChat(chat.id)}
                title={chat.title}
              >
                <span className="chat-title">{chat.title}</span>
                <button
                  className="delete-chat-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  aria-label="Delete chat"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
