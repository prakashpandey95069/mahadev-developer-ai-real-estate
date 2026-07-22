import { useEffect, useRef, useState } from "react";
import axios from "axios";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! Main Mahadev Developer ka AI Property Assistant hoon. Aap kis type ki property dhundh rahe hain?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Automatically scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const userMessage = input.trim();

    if (!userMessage || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/chat`,
        {
          message: userMessage,
        }
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            response.data.reply ||
            "Sorry, mujhe response nahi mila.",
        },
      ]);
    } catch (error) {
      console.error(
        "AI Chat Error:",
        error.response?.data || error.message
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: "Sorry, AI assistant abhi available nahi hai. Aap 9935926414 par contact kar sakte hain.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-wrapper">
      {/* Chat Box */}
      {isOpen && (
        <div className="ai-chatbox">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <div className="ai-avatar">
                AI
              </div>

              <div>
                <h3>AI Property Assistant</h3>
                <span>
                  ● Online • Mahadev Developer
                </span>
              </div>
            </div>

            <button
              type="button"
              className="ai-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ${
                  message.role === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="ai-message bot-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Ask about properties..."
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={
                loading || !input.trim()
              }
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        className={`ai-chat-button ${
          isOpen ? "chat-open" : ""
        }`}
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
        aria-label="Open AI Property Assistant"
      >
        {isOpen ? "×" : "AI"}
      </button>
    </div>
  );
}

export default AIChatbot;