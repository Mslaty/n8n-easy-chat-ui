
import { useState, useEffect } from 'react';
import { Message, Attachment, ChatSettings } from '../types';
import { importChatHistory, generateId, saveMessages, getMessages } from '../utils';
import { useChatWebhook } from './useChatWebhook';

export const useChatManagement = (settings: ChatSettings) => {
  const [messages, setMessages] = useState<Message[]>(getMessages(settings.chatId));
  const [isTyping, setIsTyping] = useState(false);
  
  const { isLoading, sendMessageToWebhook } = useChatWebhook(
    settings.webhookUrl,
    settings.chatId,
    settings.typingAnimation || false
  );
  
  // Save messages to localStorage when they change
  useEffect(() => {
    saveMessages(messages, settings.chatId);
  }, [messages, settings.chatId]);
  
  const handleSendMessage = async (content: string, attachments: Attachment[] = []) => {
    // Create a unique ID for this message
    const id = generateId();
    
    // Create the message object
    const userMessage: Message = {
      id,
      content,
      sender: 'user',
      timestamp: Date.now(),
      attachments
    };
    
    // Add the user message to the messages array
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Show typing indicator while sending message to webhook
    setIsTyping(true);
    
    try {
      // Send message to webhook if connected
      if (settings.webhookUrl) {
        await sendMessageToWebhook(content, attachments, setMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleAddAttachment = (file: File): Attachment => {
    const attachment: Attachment = {
      id: generateId(),
      name: file.name,
      type: file.type,
      data: file,
      size: file.size
    };
    
    // For image files, add a preview URL
    if (file.type.startsWith('image/')) {
      attachment.previewUrl = URL.createObjectURL(file);
    }
    
    return attachment;
  };
  
  const handleDeleteMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
  };
  
  const handleImportChat = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const importedChat = importChatHistory(e.target.result as string);
          
          if (importedChat) {
            setMessages(importedChat.messages);
          }
        } catch (error) {
          console.error('Failed to import chat history:', error);
        }
      }
    };
    
    reader.readAsText(file);
  };

  return {
    messages,
    isTyping,
    isLoading,
    handleSendMessage,
    handleAddAttachment,
    handleDeleteMessage,
    handleImportChat
  };
};
