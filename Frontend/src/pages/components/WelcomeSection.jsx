import "./WelcomeSection.css";

const WelcomeSection = ({ onSuggestionClick }) => {
  const suggestions = [
    "Explain quantum computing",
    "Write a poem about nature",
    "How do I learn coding?",
    "What is machine learning?",
  ];

  return (
    <div className="welcome-section">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to ChatNova</h1>
        <p className="welcome-subtitle">
          Start a conversation or choose a suggestion below
        </p>

        <div className="suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-btn"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
