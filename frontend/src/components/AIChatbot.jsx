import { useState } from "react";
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

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

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
        "http://localhost:5000/api/ai/chat",
        {
          message: userMessage,
        }
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: response.data.reply,
        },
      ]);

    } catch (error) {
      console.error(error);

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <button
        className="ai-chat-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "×" : "AI"}
      </button>

      {isOpen && (
        <div className="ai-chatbox">

          <div className="ai-chat-header">
            <div>
              <h3>AI Property Assistant</h3>
              <span>Mahadev Developer</span>
            </div>

            <button onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="ai-chat-messages">

            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ai-message user-message"
                    : "ai-message bot-message"
                }
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="ai-message bot-message">
                Thinking...
              </div>
            )}

          </div>

          <div className="ai-chat-input">

            <input
              type="text"
              placeholder="Ask about properties..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIChatbot;