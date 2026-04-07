import "./ErrorBanner.css";

const ErrorBanner = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="error-banner">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p className="error-message">{error}</p>
      </div>
      <button
        className="error-close-btn"
        onClick={onClose}
        aria-label="Close error"
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorBanner;
