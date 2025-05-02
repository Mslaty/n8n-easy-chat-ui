
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ChatSettings } from '../types';
import { exportChatHistory, clearChatHistory } from '../utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSaveSettings: (settings: ChatSettings) => void;
  chatId: string;
  onImportChat: (file: File) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSaveSettings,
  chatId,
  onImportChat
}) => {
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl);
  const [typingAnimation, setTypingAnimation] = useState(settings.typingAnimation);
  const [chatName, setChatName] = useState(settings.chatName || 'Chat');
  
  useEffect(() => {
    setWebhookUrl(settings.webhookUrl);
    setTypingAnimation(settings.typingAnimation);
    setChatName(settings.chatName || 'Chat');
  }, [settings, isOpen]);
  
  const handleSave = () => {
    onSaveSettings({
      ...settings,
      webhookUrl,
      typingAnimation,
      chatName: chatName || 'Chat'
    });
    onClose();
  };
  
  const handleExportChat = () => {
    exportChatHistory(chatId);
  };
  
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
      clearChatHistory(chatId);
      window.location.reload();
    }
  };
  
  const handleImportChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportChat(e.target.files[0]);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-chat-dark-secondary rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-medium text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Chat Name
            </label>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-chat-accent focus:ring-1 focus:ring-chat-accent outline-none"
              placeholder="Chat"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              n8n Webhook URL
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-chat-accent focus:ring-1 focus:ring-chat-accent outline-none"
              placeholder="Enter production webhook link"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="typingAnimation"
              checked={typingAnimation}
              onChange={(e) => setTypingAnimation(e.target.checked)}
              className="h-4 w-4 text-chat-accent rounded border-gray-700 focus:ring-chat-accent"
            />
            <label htmlFor="typingAnimation" className="ml-2 text-sm text-gray-300">
              Enable typing animation
            </label>
          </div>
          
          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Chat History</h3>
            <div className="space-y-2">
              <button
                onClick={handleExportChat}
                className="w-full text-white bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded text-sm"
              >
                Export Chat History
              </button>
              
              <button
                onClick={handleClearChat}
                className="w-full text-white bg-red-700 hover:bg-red-600 py-2 px-4 rounded text-sm"
              >
                Clear Chat History
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="mr-2 text-white bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-white bg-chat-accent hover:bg-chat-accent-hover py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
