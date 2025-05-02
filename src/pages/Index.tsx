
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
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [settings, setSettings] = useState<ChatSettings>(getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  
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
        toast({
          title: "Copied!",
          description: "Message copied to clipboard"
        });
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
        toast({
          title: "Error",
          description: "Failed to copy message",
          variant: "destructive"
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
            
            toast({
              title: "Success",
              description: "Chat history imported successfully"
            });
            
            // Force reload to load the new chat history
            window.location.reload();
          }
        } catch (error) {
          console.error('Failed to import chat history:', error);
          toast({
            title: "Error",
            description: "Failed to import chat history",
            variant: "destructive"
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
