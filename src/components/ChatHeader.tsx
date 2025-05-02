
import React from 'react';
import { Settings, ArrowLeft } from 'lucide-react';
import { ChatSettings } from '../types';

interface ChatHeaderProps {
  settings: ChatSettings;
  isConnected: boolean;
  onOpenSettings: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  settings, 
  isConnected, 
  onOpenSettings 
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <button className="text-gray-400 hover:text-white p-1 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-white font-medium truncate">
          {settings.chatName}
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-300">
            n8n {isConnected ? 'connected' : 'disconnected'}
          </span>
        </div>
        
        <button 
          onClick={onOpenSettings}
          className="text-gray-400 hover:text-white p-1 rounded-full"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
