
import { Message, Attachment, ChatSettings, ChatHistoryData } from '../types';
import { fileToBase64 } from './fileUtils';
import { generateId } from './generalUtils';

// Save messages to localStorage
export const saveMessages = async (messages: Message[], chatId: string): Promise<void> => {
  // Need to process attachments before saving to localStorage
  const processedMessages = await Promise.all(messages.map(async message => {
    if (!message.attachments || message.attachments.length === 0) {
      return message;
    }

    // Process each attachment
    const processedAttachments = await Promise.all(message.attachments.map(async attachment => {
      const processed = { ...attachment };
      
      // Store file data as base64 string if available
      if (attachment.data instanceof File) {
        try {
          // Always convert to base64 for persistent storage
          processed.url = await fileToBase64(attachment.data);
          
          // For images, also store the preview URL as the same base64 string
          if (attachment.type.startsWith('image/')) {
            processed.previewUrl = processed.url;
          }
        } catch (err) {
          console.error('Failed to convert file to base64:', err);
        }
      }
      // If we have a blob URL but no base64 data (e.g., after loading from localStorage)
      else if (attachment.previewUrl && attachment.previewUrl.startsWith('blob:') && !processed.url) {
        console.warn('Found blob URL without base64 data, image may not persist after reload');
      }
      
      // Remove the File object as it can't be serialized
      delete processed.data;
      
      return processed;
    }));

    return {
      ...message,
      attachments: processedAttachments
    };
  }));
  
  const chatHistory = getChatHistory();
  const existingChatIndex = chatHistory.findIndex(chat => chat.id === chatId);
  
  if (existingChatIndex !== -1) {
    chatHistory[existingChatIndex].messages = processedMessages;
  } else if (chatId) {
    chatHistory.push({
      id: chatId,
      name: 'Chat',
      messages: processedMessages,
      settings: getSettings()
    });
  }
  
  try {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    // Handle localStorage quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Remove oldest chat histories to free up space
      const reducedHistory = chatHistory.slice(-3); // Keep only the 3 most recent chats
      localStorage.setItem('chatHistory', JSON.stringify(reducedHistory));
    }
  }
};

// Get messages from localStorage
export const getMessages = (chatId: string): Message[] => {
  const chatHistory = getChatHistory();
  const chat = chatHistory.find(chat => chat.id === chatId);
  return chat ? chat.messages : [];
};

// Save settings to localStorage
export const saveSettings = (settings: ChatSettings): void => {
  localStorage.setItem('chatSettings', JSON.stringify(settings));
};

// Get settings from localStorage
export const getSettings = (): ChatSettings => {
  const defaultSettings: ChatSettings = {
    webhookUrl: '',
    typingAnimation: true,
    chatId: generateId(),
    chatName: 'Chat'
  };
  
  const savedSettings = localStorage.getItem('chatSettings');
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
};

// Get chat history from localStorage
export const getChatHistory = (): ChatHistoryData[] => {
  const savedHistory = localStorage.getItem('chatHistory');
  return savedHistory ? JSON.parse(savedHistory) : [];
};

// Clear chat history from localStorage
export const clearChatHistory = (chatId: string): void => {
  const chatHistory = getChatHistory();
  const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
  localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
};
