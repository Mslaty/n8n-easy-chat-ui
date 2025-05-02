
import { ChatHistoryData } from '../types';
import { getChatHistory } from './storageUtils';
import { generateId } from './generalUtils';

// Export chat history
export const exportChatHistory = (chatId: string): void => {
  const chatHistory = getChatHistory();
  const chat = chatHistory.find(chat => chat.id === chatId);
  
  if (chat) {
    const dataStr = JSON.stringify(chat, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `chat-history-${chat.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  }
};

// Import chat history
export const importChatHistory = (fileData: string): ChatHistoryData | null => {
  try {
    const importedChat = JSON.parse(fileData) as ChatHistoryData;
    
    if (!importedChat.id || !importedChat.messages) {
      throw new Error('Invalid chat history format');
    }
    
    const chatHistory = getChatHistory();
    
    // Generate a new ID to avoid conflicts
    importedChat.id = generateId();
    importedChat.name = `${importedChat.name} (imported)`;
    
    chatHistory.push(importedChat);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    return importedChat;
  } catch (error) {
    console.error('Failed to import chat history:', error);
    return null;
  }
};
