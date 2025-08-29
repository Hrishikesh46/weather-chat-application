# Weather Agent Chat Interface

A modern, responsive chat application that connects to a weather agent API for real-time weather information. Built with React, Vite, and Tailwind CSS, featuring streaming responses and multi-thread conversation management.

# 🔗 Links

- 🌐 Live Demo: https://weather-chat-application.vercel.app/
- 📂 Repository: https://github.com/Hrishikesh46/weather-chat-application

# 🌟 Features

# ⚡ Core Functionality

- Real-time Chat Interface - Interactive messaging with weather agent
- Streaming API Responses - Live text streaming as the AI responds
- Multi-thread Management - Create and manage multiple chat conversations
- Smart Message Formatting - Automatic spacing fixes and proper line breaks
- Conversation History - Persistent chat threads during session

# 🎨 UI/UX

- Responsive Design - Mobile-first approach, works on all devices
- Thread Management - Sidebar with thread switching and search functionality
- Editable Thread Titles - Click to edit conversation names inline
- Auto-scroll - Automatic scrolling to latest messages
- Loading States - Comprehensive loading indicators and animations
- Error Handling - Robust error handling with user feedback
- Clean Interface - Modern design with smooth animations

# 🔧 Technical Features

- Context-based State Management - React Context API for global state
- Custom Hooks - Reusable logic for chat management
- Real-time Streaming - Server-sent events for live response updates

# 🚀 Tech Stack

- Frontend Framework: React 18 with JavaScript
- Build Tool: Vite
- Styling: Tailwind CSS v4
- Icons: Lucide React
- Date Handling: date-fns
- State Management: React Context API + useReducer
- HTTP Client: Fetch API with streaming support

# 📦 Installation

- Prerequisites

Node.js 18 or higher
npm (comes with Node.js) or yarn

# Setup Instructions

- Clone the repository

git clone https://github.com/Hrishikesh46/weather-chat-application.git
cd weather-chat-application

# Install dependencies

npm install

# or if you prefer yarn

yarn install

# Configure API settings

- Open src/utils/api.js and replace the placeholder with your college roll number:

const COLLEGE_ROLL_NUMBER = 'YOUR_ACTUAL_ROLL_NUMBER';

- Start the development server

npm run dev

# or

yarn dev

- Open your browser
- Navigate to http://localhost:5173 to see the application running.

- Build for Production

npm run build

# or

yarn build
The built files will be in the dist directory.
