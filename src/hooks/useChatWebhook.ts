
import { useState } from 'react';
import { Message, Attachment } from '../types';
import { 
  generateId, 
  sendToWebhook
} from '../utils';

export const useChatWebhook = (webhookUrl: string, chatId: string, typingAnimation: boolean) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessageToWebhook = async (messageText: string, attachments: Attachment[], 
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>): Promise<void> => {
    
    setIsLoading(true);
    
    try {
      // Create a unique ID for the typing indicator message
      const typingId = generateId();
      
      // Prepare typing indicator message
      const typingMessage: Message = {
        id: typingId,
        content: 'Agent is typing...',
        sender: 'agent',
        timestamp: Date.now(),
        isTyping: false // We don't use isTyping flag here as we always want to show the dots animation
      };
      
      // Always show typing indicator, either as dots animation or with typing effect based on settings
      setMessages(prev => [...prev, typingMessage]);
      
      // Send message to webhook
      const files = attachments.map(a => a.data).filter(Boolean) as File[];
      const response = await sendToWebhook(
        webhookUrl,
        messageText,
        files,
        chatId
      );
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== typingId));
      
      // Add agent response
      const agentMessage: Message = {
        id: generateId(),
        content: response,
        sender: 'agent',
        timestamp: Date.now(),
        // If typing animation is enabled, mark this message for animation
        isTyping: typingAnimation
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator if it exists
      setMessages(prev => prev.filter(m => m.isTyping));
      
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

  return {
    isLoading,
    sendMessageToWebhook
  };
};
