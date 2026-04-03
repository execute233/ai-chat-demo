import React, { useState } from 'react';

function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="flex space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-150 disabled:bg-blue-300"
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default ChatInput;