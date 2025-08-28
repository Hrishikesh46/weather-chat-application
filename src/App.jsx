// src/App.jsx
import React from 'react';
import { ChatProvider } from './contexts/ChatContext';
import { ChatInterface } from './components/ChatInterface';
import './index.css';

function App() {
  return (
    <ChatProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <ChatInterface />
      </div>
    </ChatProvider>
  );
}

export default App;
