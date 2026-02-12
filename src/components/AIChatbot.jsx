import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import './AIChatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{ sender: 'ai', text: 'Hello! How can I help you with your real estate questions today?' }]);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiAPI.getChatResponse(input);
      setMessages([...newMessages, { sender: 'ai', text: response.answer }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chatbot">
      <div className={`chat-icon ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        <img src="https://cdn-icons-png.flaticon.com/512/7510/7510364.png" alt="AI Chat" />
      </div>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>AI Real Estate Assistant</h3>
            <button onClick={toggleChat} className="close-btn">&times;</button>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="chat-message ai">Thinking...</div>}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
