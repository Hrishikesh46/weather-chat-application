import React, { useState } from 'react';
import {
  Plus,
  MessageCircle,
  Trash2,
  Download,
  Search,
  X,
  Menu,
} from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

export const ThreadSidebar = ({ isOpen, onToggle }) => {
  const {
    threadList,
    activeThreadId,
    createThread,
    setActiveThread,
    deleteThread,
    exportThread,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredThreads = threadList.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleCreateThread = () => {
    const title = `Weather Chat `;
    createThread(title);
  };

  const handleDeleteThread = (threadId, e) => {
    e.stopPropagation();
    deleteThread(threadId);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Chat Threads
            </h2>
            <button
              onClick={onToggle}
              className="md:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Thread Button */}
          <button
            onClick={handleCreateThread}
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          {/* Search */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No matching chats found' : 'No chats yet'}
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`
                  p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                  ${
                    activeThreadId === thread.id
                      ? 'bg-blue-50 border-blue-200'
                      : ''
                  }
                `}
                onClick={() => setActiveThread(thread.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <MessageCircle
                      className={`w-4 h-4 mt-1 flex-shrink-0 ${
                        activeThreadId === thread.id
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-800 truncate">
                        {thread.title}
                      </h3>

                      {thread.messages.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {thread.messages[thread.messages.length - 1].content}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(thread.lastActivity)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {thread.messages.length} messages
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thread Actions */}
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => handleDeleteThread(thread.id, e)}
                      className={`p-1 rounded transition-colors ${
                        showDeleteConfirm === thread.id
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-100'
                      }`}
                      title={
                        showDeleteConfirm === thread.id
                          ? 'Click again to confirm'
                          : 'Delete thread'
                      }
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
