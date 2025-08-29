// src/components/ChatInterface.jsx
import { useRef, useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { ThreadSidebar } from './ThreadSidebar';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ErrorMessage } from './ErrorMessage';

export const ChatInterface = () => {
  const {
    activeMessages,
    activeThreadId,
    isLoading,
    error,
    sendMessage,
    clearThread,
    exportThread,
    threadList,
    updateThreadTitle,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSendMessage = (content) => {
    // Always call sendMessage - thread creation will be handled in context
    sendMessage(content);
  };

  const renderMainContent = () => {
    if (activeThreadId && activeMessages.length > 0) {
      // Show messages if we have an active thread with messages
      return (
        <>
          {activeMessages.map((message, index) => (
            <MessageBubble key={`${message.id}-${index}`} message={message} />
          ))}
        </>
      );
    }

    // Show welcome screen (whether we have threads or not)
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-6xl mb-6 animate-bounce">🌤️</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Weather Agent</h2>
        <p className="text-gray-600 text-lg max-w-md mb-6">
          Ask me about weather conditions anywhere in the world!
        </p>

        {threadList.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Try these examples:
            </p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• "What's the weather in Tokyo?"</li>
              <li>• "Will it rain in London today?"</li>
              <li>• "Weather forecast for New York"</li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Select a chat from the sidebar or start a new conversation below
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Thread Sidebar */}
      <ThreadSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile Header with Menu */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-3"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Weather Chat</h1>
        </div>

        {/* Show header only if we have an active thread */}
        {activeThreadId && (
          <ChatHeader
            onClear={() => clearThread(activeThreadId)}
            onExport={() => exportThread(activeThreadId)}
            onEditTitle={(newTitle) =>
              updateThreadTitle(activeThreadId, newTitle)
            }
            messageCount={activeMessages.length}
            threadTitle={
              threadList.find((t) => t.id === activeThreadId)?.title ||
              'Weather Chat'
            }
          />
        )}

        {/* Messages Area - Always visible */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {renderMainContent()}
          {error && <ErrorMessage message={error} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Always visible */}
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
