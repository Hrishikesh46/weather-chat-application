// src/components/ChatHeader.jsx
import React, { useState } from 'react';
import { Trash2, Download, MessageCircle, Edit3, Check, X } from 'lucide-react';

export const ChatHeader = ({
  onClear,
  onExport,
  onEditTitle,
  messageCount,
  threadTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(threadTitle);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditTitle(threadTitle);
  };

  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== threadTitle) {
      onEditTitle(trimmedTitle);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(threadTitle);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveEdit}
                  autoFocus
                  className="text-lg font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none text-gray-900 min-w-0 flex-1"
                  maxLength={50}
                />
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-green-600 hover:text-green-700"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <h1
                  className="text-lg font-semibold text-gray-900 truncate min-w-0 flex-1"
                  title={threadTitle} // Show full title on hover
                >
                  {threadTitle}
                </h1>
                <button
                  onClick={handleStartEdit}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title="Edit thread title"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500">{messageCount} messages</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {messageCount > 0 && (
            <>
              <button
                onClick={onClear}
                className="btn btn--danger"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5 ml-4 mb-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
