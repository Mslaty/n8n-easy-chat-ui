
import React from 'react';
import { Bot } from 'lucide-react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Bot size={20} className="text-chat-accent animate-pulse" />
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "300ms" }} />
        <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "600ms" }} />
      </div>
    </div>
  );
};

export default LoadingDots;
