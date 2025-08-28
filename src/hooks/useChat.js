// src/hooks/useChat.js - Simplified version without localStorage
import { useState, useCallback, useRef } from 'react';
import { createWeatherRequest, sendWeatherMessage } from '../utils/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const streamingMessageRef = useRef('');

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isLoading) return;

      console.log('Sending message:', content);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
        status: 'sent',
      };

      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        status: 'streaming',
      };

      // Add both messages at once
      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      setIsLoading(true);
      setIsStreaming(true);
      setError(null);
      streamingMessageRef.current = '';

      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const request = createWeatherRequest(content, conversationHistory);

      try {
        await sendWeatherMessage(
          request,
          (chunk) => {
            streamingMessageRef.current += chunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: streamingMessageRef.current }
                  : msg
              )
            );
          },
          () => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? { ...msg, status: 'sent' } : msg
              )
            );
            setIsLoading(false);
            setIsStreaming(false);
          },
          (errorMsg) => {
            setError(errorMsg);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: 'Error occurred', status: 'error' }
                  : msg
              )
            );
            setIsLoading(false);
            setIsStreaming(false);
          }
        );
      } catch (err) {
        setError('Failed to send message');
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [messages, isLoading]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const exportChat = useCallback(() => {
    const dataStr = JSON.stringify({ messages }, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'weather-chat.json');
    linkElement.click();
  }, [messages]);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearChat,
    exportChat,
  };
};
