import "./ChatHeader.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ChatHeader = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="chat-header">
      <div className="header-content">

        {/* LEFT */}
        <div className="left-section">
          <button className="menu-toggle-btn" onClick={onMenuToggle}>
            ☰
          </button>
          <h2 className="chat-title">ChatNova</h2>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          {user ? (
            <>
              <span style={{ color: "white" }}>👤 {user.name}</span>

              <button className="auth-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="auth-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="auth-btn register-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default ChatHeader;