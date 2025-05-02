
import { importChatHistory } from '../utils';
import { ChatSettings } from '../types';

export const useChatManagement = (
  settings: ChatSettings,
  setSettings: React.Dispatch<React.SetStateAction<ChatSettings>>,
  saveSettings: (settings: ChatSettings) => void,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
) => {
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

  return {
    handleImportChat
  };
};
