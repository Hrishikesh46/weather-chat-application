// src/components/MessageBubble.jsx
import React from 'react';
import { format } from 'date-fns';
import { User, Bot, Clock, AlertCircle } from 'lucide-react';

const fixSpacing = (content) => {
  if (!content) return '';

  return (
    content
      // First convert \n to actual line breaks
      .replace(/\\n/g, '\n')

      // Remove escaped quotes
      .replace(/\\"/g, '"')

      // Fix spacing issues with numbers and units
      .replace(/Temperature:(\d+\.?\d*°C)/g, 'Temperature: $1')
      .replace(/Humidity:(\d+%)/g, 'Humidity: $1')
      .replace(/level of(\d+%)/g, 'level of $1')
      .replace(/Conditions:(\w)/g, 'Conditions: $1')
      .replace(/Wind Speed:(\d+\.?\d*\s*km\/h)/g, 'Wind Speed: $1')
      .replace(/speed of(\d+\.?\d*\s*km\/h)/g, 'speed of $1')
      .replace(/up to(\d+\.?\d*\s*km\/h)/g, 'up to $1')
      .replace(/gusts(\d+\.?\d*\s*km\/h)/g, 'gusts $1')
      .replace(/to(\d+\.?\d*\s*km\/h)/g, 'to $1')
      .replace(/of(\d+\.?\d*°C)/g, 'of $1')
      .replace(/is(\d+\.?\d*°C)/g, 'is $1')
      .replace(/like(\d+\.?\d*°C)/g, 'like $1')
      .replace(/at(\d+%)/g, 'at $1')
      .replace(/is(\d+%)/g, 'is $1')
      .replace(/(\d)km\/h/g, '$1 km/h')
      .replace(/,(\s*with)/g, ', $1')
  );
};

export const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isStreaming = message.status === 'streaming';

  const displayContent = fixSpacing(message.content);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex items-start space-x-3 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
        {!isUser && (
          <div className="avatar avatar--sm avatar--bot">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}

        <div className={`relative group ${isUser ? 'order-last' : ''}`}>
          <div
            className={`
              message-bubble
              ${
                isUser
                  ? 'message-bubble--user'
                  : isError
                  ? 'message-bubble--error'
                  : 'message-bubble--assistant'
              }
              ${isStreaming ? 'message-bubble--streaming' : ''}
            `}
          >
            <div className="message-content">
              {isStreaming && !message.content ? (
                <div className="text-gray-500 italic">Thinking...</div>
              ) : (
                <div className="leading-relaxed whitespace-pre-line">
                  {displayContent}
                </div>
              )}
            </div>

            {isError && (
              <div className="flex items-center mt-2 text-xs text-red-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Failed to send
              </div>
            )}
          </div>

          <div
            className={`
            text-xs text-gray-500 mt-1 flex items-center
            ${isUser ? 'justify-end' : 'justify-start'}
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
          `}
          >
            <Clock className="w-3 h-3 mr-1" />
            {format(new Date(message.timestamp), 'HH:mm')}
          </div>
        </div>

        {isUser && (
          <div className="avatar avatar--sm avatar--user">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};
