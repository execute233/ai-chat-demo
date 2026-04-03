import React from 'react';

function MessageBubble({ sender, text }) {
  const isUser = sender === 'user';
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-3xl p-3 rounded-xl shadow-md ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default MessageBubble;