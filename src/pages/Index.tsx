
import React, { useState, useEffect } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatContainer from '../components/ChatContainer';
import SettingsModal from '../components/SettingsModal';
import { Attachment, ChatSettings } from '../types';
import { 
  saveSettings, 
  getSettings,
  importChatHistory
} from '../utils';
import { downloadAttachment } from '../utils/attachmentHandlers';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [settings, setSettings] = useState<ChatSettings>(getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Check connection status when settings change
  useEffect(() => {
    setIsConnected(!!settings.webhookUrl);
  }, [settings.webhookUrl]);
  
  const handleSaveSettings = (newSettings: ChatSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    setIsConnected(!!newSettings.webhookUrl);
  };
  
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast("Copied to clipboard", {
          duration: 2000,
          className: "bg-black/70 text-white text-xs py-1.5 px-3 rounded-md border-0",
          position: "bottom-right",
        });
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
        toast("Failed to copy", {
          duration: 2000,
          className: "bg-black/70 text-red-300 text-xs py-1.5 px-3 rounded-md border-0",
          position: "bottom-right",
        });
      });
  };
  
  const handleDownloadAttachment = (attachment: Attachment) => {
    downloadAttachment(attachment);
  };
  
  const handleImportChat = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const importedChat = importChatHistory(e.target.result as string);
          
          if (importedChat) {
            // Update the settings to point to the imported chat
            const newSettings = {
              ...settings,
              chatId: importedChat.id,
              chatName: importedChat.name
            };
            
            setSettings(newSettings);
            saveSettings(newSettings);
            
            // Close the settings modal
            setIsSettingsOpen(false);
            
            toast("Chat history imported successfully", {
              duration: 2000,
              className: "bg-black/70 text-white text-xs py-1.5 px-3 rounded-md border-0",
              position: "bottom-right",
            });
            
            // Force reload to load the new chat history
            window.location.reload();
          }
        } catch (error) {
          console.error('Failed to import chat history:', error);
          toast("Failed to import chat history", {
            duration: 2000,
            className: "bg-black/70 text-red-300 text-xs py-1.5 px-3 rounded-md border-0",
            position: "bottom-right",
          });
        }
      }
    };
    
    reader.readAsText(file);
  };
  
  // Show settings modal on first load if webhook URL is not set
  useEffect(() => {
    if (!settings.webhookUrl) {
      setIsSettingsOpen(true);
    }
  }, [settings.webhookUrl]);
  
  return (
    <div className="flex flex-col h-screen bg-chat-dark text-white">
      <ChatHeader 
        settings={settings}
        isConnected={isConnected}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <ChatContainer 
        settings={settings}
        isConnected={isConnected}
        onCopyMessage={handleCopyMessage}
        onDownloadAttachment={handleDownloadAttachment}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        chatId={settings.chatId}
        onImportChat={handleImportChat}
      />
    </div>
  );
};

export default Index;
