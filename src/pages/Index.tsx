
import React, { useState, useEffect } from 'react';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import SettingsModal from '../components/SettingsModal';
import { Message, Attachment, ChatSettings } from '../types';
import { 
  generateId, 
  saveMessages, 
  getMessages, 
  saveSettings, 
  getSettings,
  sendToWebhook,
  importChatHistory
} from '../utils';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ChatSettings>(getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = getMessages(settings.chatId);
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
    
    // Check if webhook URL is set to determine connection status
    setIsConnected(!!settings.webhookUrl);
  }, [settings.chatId]);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages, settings.chatId);
    }
  }, [messages, settings.chatId]);
  
  const handleSendMessage = async (messageText: string, attachments: Attachment[]) => {
    // Create user message
    const userMessage: Message = {
      id: generateId(),
      content: messageText.trim(),
      sender: 'user',
      timestamp: Date.now(),
      attachments
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Prepare typing indicator message
      const typingMessage: Message = {
        id: generateId(),
        content: 'Agent is typing...',
        sender: 'agent',
        timestamp: Date.now(),
        isTyping: settings.typingAnimation
      };
      
      // Show typing indicator if animation is enabled
      if (settings.typingAnimation) {
        setMessages(prev => [...prev, typingMessage]);
      }
      
      // Send message to webhook
      const files = attachments.map(a => a.data).filter(Boolean) as File[];
      const response = await sendToWebhook(
        settings.webhookUrl,
        messageText,
        files,
        settings.chatId
      );
      
      // Remove typing indicator
      if (settings.typingAnimation) {
        setMessages(prev => prev.filter(m => m.id !== typingMessage.id));
      }
      
      // Add agent response
      const agentMessage: Message = {
        id: generateId(),
        content: response,
        sender: 'agent',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator if it exists
      if (settings.typingAnimation) {
        setMessages(prev => prev.filter(m => !m.isTyping));
      }
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        sender: 'agent',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveSettings = (newSettings: ChatSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    setIsConnected(!!newSettings.webhookUrl);
  };
  
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        // Could show a toast notification here
        console.log('Message copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
      });
  };
  
  const handleDownloadAttachment = (attachment: Attachment) => {
    if (attachment.previewUrl) {
      const link = document.createElement('a');
      link.href = attachment.previewUrl;
      link.download = attachment.name;
      link.click();
    } else if (attachment.data) {
      const url = URL.createObjectURL(attachment.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      link.click();
      
      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
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
            
            // Load the messages from the imported chat
            setMessages(importedChat.messages);
            
            // Close the settings modal
            setIsSettingsOpen(false);
            
            // Show a message about successful import
            console.log('Chat history imported successfully');
          }
        } catch (error) {
          console.error('Failed to import chat history:', error);
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
      
      <MessageList 
        messages={messages}
        onCopyMessage={handleCopyMessage}
        onDownloadAttachment={handleDownloadAttachment}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isConnected={isConnected}
        isLoading={isLoading}
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
