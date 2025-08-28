// src/contexts/ChatContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import { createWeatherRequest, sendWeatherMessage } from '../utils/api';

const ChatContext = createContext();

// Action types
const ACTIONS = {
  CREATE_THREAD: 'CREATE_THREAD',
  SET_ACTIVE_THREAD: 'SET_ACTIVE_THREAD',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  SET_LOADING: 'SET_LOADING',
  SET_STREAMING: 'SET_STREAMING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_THREAD: 'CLEAR_THREAD',
  DELETE_THREAD: 'DELETE_THREAD',
  UPDATE_THREAD_TITLE: 'UPDATE_THREAD_TITLE',
  SET_PENDING_MESSAGE: 'SET_PENDING_MESSAGE',
  CLEAR_PENDING_MESSAGE: 'CLEAR_PENDING_MESSAGE',
};

const initialState = {
  threads: {},
  activeThreadId: null,
  isLoading: false,
  isStreaming: false,
  error: null,
  pendingUserMessage: null,
};

// Reducer function
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CREATE_THREAD:
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.payload.id]: {
            id: action.payload.id,
            title: action.payload.title,
            messages: [],
            createdAt: new Date(),
            lastActivity: new Date(),
          },
        },
        activeThreadId: action.payload.id,
      };

    case ACTIONS.SET_ACTIVE_THREAD:
      return {
        ...state,
        activeThreadId: action.payload,
        error: null,
      };

    case ACTIONS.ADD_MESSAGE:
      const { threadId, message } = action.payload;
      return {
        ...state,
        threads: {
          ...state.threads,
          [threadId]: {
            ...state.threads[threadId],
            messages: [...(state.threads[threadId]?.messages || []), message],
            lastActivity: new Date(),
          },
        },
      };

    case ACTIONS.UPDATE_MESSAGE:
      const { threadId: updateThreadId, messageId, updates } = action.payload;
      return {
        ...state,
        threads: {
          ...state.threads,
          [updateThreadId]: {
            ...state.threads[updateThreadId],
            messages: state.threads[updateThreadId].messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
            lastActivity: new Date(),
          },
        },
      };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_STREAMING:
      return { ...state, isStreaming: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.CLEAR_THREAD:
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.payload]: {
            ...state.threads[action.payload],
            messages: [],
          },
        },
      };

    case ACTIONS.DELETE_THREAD:
      const newThreads = { ...state.threads };
      delete newThreads[action.payload];
      const threadIds = Object.keys(newThreads);
      return {
        ...state,
        threads: newThreads,
        activeThreadId:
          state.activeThreadId === action.payload
            ? threadIds.length > 0
              ? threadIds[0]
              : null
            : state.activeThreadId,
      };

    case ACTIONS.SET_PENDING_MESSAGE:
      return { ...state, pendingUserMessage: action.payload };

    case ACTIONS.CLEAR_PENDING_MESSAGE:
      return { ...state, pendingUserMessage: null };

    case ACTIONS.UPDATE_THREAD_TITLE:
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.payload.threadId]: {
            ...state.threads[action.payload.threadId],
            title: action.payload.title,
          },
        },
      };

    default:
      return state;
  }
};

// Chat Provider Component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Create new thread
  const createThread = useCallback((title = 'New Chat') => {
    const threadId = `thread-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    dispatch({
      type: ACTIONS.CREATE_THREAD,
      payload: { id: threadId, title },
    });
    return threadId;
  }, []);

  // Set active thread
  const setActiveThread = useCallback((threadId) => {
    dispatch({
      type: ACTIONS.SET_ACTIVE_THREAD,
      payload: threadId,
    });
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (content, threadId = state.activeThreadId) => {
      if (!content.trim() || state.isLoading) return;

      console.log('Sending message:', content);

      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.SET_STREAMING, payload: true });
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });

      let targetThreadId = threadId;
      let streamingContent = '';
      let assistantMessageId;

      // If no active thread, store the pending message
      if (!targetThreadId) {
        dispatch({ type: ACTIONS.SET_PENDING_MESSAGE, payload: content });
      } else {
        // Add user message to existing thread
        const userMessage = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: content.trim(),
          timestamp: new Date(),
          status: 'sent',
        };
        dispatch({
          type: ACTIONS.ADD_MESSAGE,
          payload: { threadId: targetThreadId, message: userMessage },
        });

        // Create assistant message placeholder
        assistantMessageId = `assistant-${Date.now()}`;
        const assistantMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          status: 'streaming',
        };
        dispatch({
          type: ACTIONS.ADD_MESSAGE,
          payload: { threadId: targetThreadId, message: assistantMessage },
        });
      }

      try {
        // Get conversation history
        const conversationHistory = targetThreadId
          ? (state.threads[targetThreadId]?.messages || []).map((msg) => ({
              role: msg.role,
              content: msg.content,
            }))
          : [];

        const request = createWeatherRequest(content, conversationHistory);

        await sendWeatherMessage(
          request,
          (chunk) => {
            streamingContent += chunk;

            // If no thread exists yet, create one with both user and assistant messages
            if (!targetThreadId) {
              // Generate title from user message
              const title =
                content.length > 30
                  ? content.substring(0, 30) + '...'
                  : content;

              targetThreadId = `thread-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`;

              // Create the thread
              dispatch({
                type: ACTIONS.CREATE_THREAD,
                payload: { id: targetThreadId, title },
              });

              // Add user message
              const userMessage = {
                id: `user-${Date.now()}`,
                role: 'user',
                content: content.trim(),
                timestamp: new Date(),
                status: 'sent',
              };
              dispatch({
                type: ACTIONS.ADD_MESSAGE,
                payload: { threadId: targetThreadId, message: userMessage },
              });

              // Add assistant message with first chunk
              assistantMessageId = `assistant-${Date.now()}`;
              const assistantMessage = {
                id: assistantMessageId,
                role: 'assistant',
                content: streamingContent,
                timestamp: new Date(),
                status: 'streaming',
              };
              dispatch({
                type: ACTIONS.ADD_MESSAGE,
                payload: {
                  threadId: targetThreadId,
                  message: assistantMessage,
                },
              });

              // Clear pending message
              dispatch({ type: ACTIONS.CLEAR_PENDING_MESSAGE });
            } else {
              // Update existing assistant message
              dispatch({
                type: ACTIONS.UPDATE_MESSAGE,
                payload: {
                  threadId: targetThreadId,
                  messageId: assistantMessageId,
                  updates: { content: streamingContent },
                },
              });
            }
          },
          () => {
            // Mark message as complete
            dispatch({
              type: ACTIONS.UPDATE_MESSAGE,
              payload: {
                threadId: targetThreadId,
                messageId: assistantMessageId,
                updates: { status: 'sent' },
              },
            });
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            dispatch({ type: ACTIONS.SET_STREAMING, payload: false });
          },
          (errorMsg) => {
            dispatch({ type: ACTIONS.SET_ERROR, payload: errorMsg });

            if (assistantMessageId) {
              dispatch({
                type: ACTIONS.UPDATE_MESSAGE,
                payload: {
                  threadId: targetThreadId,
                  messageId: assistantMessageId,
                  updates: {
                    content:
                      streamingContent ||
                      'Sorry, I encountered an error. Please try again.',
                    status: 'error',
                  },
                },
              });
            }

            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            dispatch({ type: ACTIONS.SET_STREAMING, payload: false });
            dispatch({ type: ACTIONS.CLEAR_PENDING_MESSAGE });
          }
        );
      } catch (err) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: 'Failed to send message',
        });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        dispatch({ type: ACTIONS.SET_STREAMING, payload: false });
        dispatch({ type: ACTIONS.CLEAR_PENDING_MESSAGE });
      }
    },
    [
      state.activeThreadId,
      state.isLoading,
      state.threads,
      state.pendingUserMessage,
    ]
  );

  const updateThreadTitle = useCallback((threadId, newTitle) => {
    dispatch({
      type: ACTIONS.UPDATE_THREAD_TITLE,
      payload: { threadId, title: newTitle },
    });
  }, []);

  // Clear thread
  const clearThread = useCallback(
    (threadId = state.activeThreadId) => {
      if (threadId) {
        dispatch({ type: ACTIONS.CLEAR_THREAD, payload: threadId });
      }
    },
    [state.activeThreadId]
  );

  // Delete thread
  const deleteThread = useCallback((threadId) => {
    dispatch({ type: ACTIONS.DELETE_THREAD, payload: threadId });
  }, []);

  // Get active thread messages
  const getActiveMessages = useCallback(() => {
    return state.activeThreadId
      ? state.threads[state.activeThreadId]?.messages || []
      : [];
  }, [state.activeThreadId, state.threads]);

  // Export thread
  const exportThread = useCallback(
    (threadId = state.activeThreadId) => {
      if (!threadId || !state.threads[threadId]) return;

      const thread = state.threads[threadId];
      const exportData = {
        thread: {
          id: thread.id,
          title: thread.title,
          createdAt: thread.createdAt,
          messages: thread.messages,
        },
        exportedAt: new Date().toISOString(),
        totalMessages: thread.messages.length,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute(
        'download',
        `weather-chat-${thread.title}-${
          new Date().toISOString().split('T')[0]
        }.json`
      );
      linkElement.click();
    },
    [state.activeThreadId, state.threads]
  );

  const value = {
    // State
    threads: state.threads,
    activeThreadId: state.activeThreadId,
    isLoading: state.isLoading,
    isStreaming: state.isStreaming,
    error: state.error,

    // Actions
    createThread,
    setActiveThread,
    sendMessage,
    clearThread,
    deleteThread,
    exportThread,
    updateThreadTitle,

    // Computed
    activeMessages: getActiveMessages(),
    threadList: Object.values(state.threads).sort(
      (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
    ),
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
