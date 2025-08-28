// src/components/MessageInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

export const MessageInput = ({ onSendMessage, disabled, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isLoading ? 'Waiting for response...' : 'Ask about weather...'
            }
            disabled={disabled}
            rows={1}
            spellCheck="false"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            className="message-input"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="btn btn--primary absolute bottom-2 right-2"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 mb-3 mr-2 animate-spin" />
            ) : (
              <Send className="w-5 h-5 mb-3 mr-2" />
            )}
          </button>
        </div>
      </form>

      <div className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </div>
    </div>
  );
};
