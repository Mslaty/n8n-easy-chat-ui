
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { ChatSettings } from '../types';
import { exportChatHistory, clearChatHistory } from '../utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

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
  const [colorTheme, setColorTheme] = useState(settings.colorTheme || 'purple');
  
  useEffect(() => {
    setWebhookUrl(settings.webhookUrl);
    setTypingAnimation(settings.typingAnimation);
    setChatName(settings.chatName || 'Chat');
    setColorTheme(settings.colorTheme || 'purple');
  }, [settings, isOpen]);
  
  const handleSave = () => {
    onSaveSettings({
      ...settings,
      webhookUrl,
      typingAnimation,
      chatName: chatName || 'Chat',
      colorTheme
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

  const colorOptions = [
    { value: 'purple', label: 'Purple', color: '#8B5CF6' },
    { value: 'blue', label: 'Blue', color: '#3B82F6' },
    { value: 'green', label: 'Green', color: '#10B981' },
    { value: 'orange', label: 'Orange', color: '#F97316' },
  ];
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-chat-dark-secondary rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-white/5">
        <div className="flex items-center justify-between p-6 border-b border-gray-800/60">
          <h2 className="text-xl font-medium text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatName" className="text-gray-300">
                Chat Name
              </Label>
              <Input
                id="chatName"
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                className="bg-gray-800/30 text-white border-0 focus-visible:ring-1 focus-visible:ring-chat-accent focus-visible:ring-offset-0 placeholder:text-gray-500"
                placeholder="Chat"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">
                Color Theme
              </Label>
              <div className="flex justify-around pt-2">
                {colorOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColorTheme(option.value as 'purple' | 'blue' | 'green' | 'orange')}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                      colorTheme === option.value 
                        ? 'ring-2 ring-white/40' 
                        : 'ring-1 ring-white/10 hover:ring-white/30'
                    }`}
                    style={{ backgroundColor: option.color }}
                    aria-label={option.label}
                  >
                    {colorTheme === option.value && (
                      <Check size={16} className="text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhookUrl" className="text-gray-300">
                n8n Webhook URL
              </Label>
              <Input
                id="webhookUrl"
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-gray-800/30 text-white border-0 focus-visible:ring-1 focus-visible:ring-chat-accent focus-visible:ring-offset-0 placeholder:text-gray-500"
                placeholder="Enter production webhook link"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="typingAnimation"
                checked={typingAnimation}
                onCheckedChange={(checked) => setTypingAnimation(checked as boolean)} 
                className="data-[state=checked]:bg-chat-accent border-gray-600"
              />
              <Label htmlFor="typingAnimation" className="text-gray-300">
                Enable typing animation
              </Label>
            </div>
          </div>
          
          <Separator className="bg-gray-800/60" />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Chat History</h3>
            <div className="space-y-3">
              <Button
                onClick={handleExportChat}
                variant="outline"
                className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-800/50 hover:text-white"
              >
                Export Chat History
              </Button>
              
              <Button
                onClick={handleClearChat}
                variant="outline"
                className="w-full bg-transparent border-red-900/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-900/50"
              >
                Clear Chat History
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-800/60">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Created by <a href="https://www.threads.com/@simplpear" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-chat-accent transition-colors">@simplpear</a>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="bg-transparent border-gray-700 text-white hover:bg-gray-800/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className={`bg-chat-${colorTheme} hover:bg-chat-${colorTheme}-hover text-white`}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
