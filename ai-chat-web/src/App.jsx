import React, { useState, useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';

// --- Storage Utility Functions ---
const STORAGE_KEY = 'chatMessages';

const loadMessagesFromStorage = () => {
  try {
    const storedMessages = localStorage.getItem(STORAGE_KEY);
    if (storedMessages) {
      return JSON.parse(storedMessages);
    }
    return [];
  } catch (error) {
    console.error("Error loading messages from localStorage:", error);
    return [];
  }
};

const saveMessagesToStorage = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to localStorage:", error);
  }
};
// ---------------------------------


// Function to fetch AI response from the backend
const fetchAiResponse = async (message) => {
  const apiUrl = 'http://127.0.0.1:18080/v1/chat/completions'; // Backend API endpoint

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gemma-4-e2b-it-Q8_0.gguf", // Updated model name as requested
        messages: [
          { role: "user", content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error ? errorData.error.message : 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error; // Re-throw the error to be caught in ChatApp
  }
};

function ChatApp() {
  // 1. Load messages from storage on initial mount
  const [messages, setMessages] = useState(loadMessagesFromStorage);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 2. Effect to scroll to bottom whenever messages change
  useEffect(scrollToBottom, [messages]);

  // 3. Effect to save messages to storage after every state update
  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  const handleSendMessage = async (message) => {
    // 1. Add user message immediately
    const userMessage = { sender: 'user', text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // 2. Fetch AI response
      const aiResponseText = await fetchAiResponse(message);

      // 3. Add AI response
      const aiMessage = { sender: 'ai', text: aiResponseText };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = { sender: 'ai', text: `Error: ${error.message}` };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50"> {/* Changed bg-gray-100 to bg-gray-50 for a softer look */}
      {/* Chat Window Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-lg'
                  : 'bg-white text-gray-800 rounded-tl-lg border border-gray-200 shadow-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 p-4 rounded-2xl shadow-md rounded-tl-lg border border-gray-200">
              AI is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatApp;