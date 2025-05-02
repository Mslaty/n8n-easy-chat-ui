
import { Message, Attachment, ChatSettings, ChatHistoryData } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Convert file to base64 string for storage
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Local storage functions
export const saveMessages = async (messages: Message[], chatId: string): Promise<void> => {
  // Need to process attachments before saving to localStorage
  const processedMessages = await Promise.all(messages.map(async message => {
    if (!message.attachments || message.attachments.length === 0) {
      return message;
    }

    // Process each attachment
    const processedAttachments = await Promise.all(message.attachments.map(async attachment => {
      const processed = { ...attachment };
      
      // Store file data as URL string if available
      if (attachment.data instanceof File) {
        try {
          // If it's an image that already has a previewUrl, use that
          if (attachment.previewUrl && attachment.data.type.startsWith('image/')) {
            processed.url = attachment.previewUrl;
          } 
          // For other files, convert to base64
          else {
            processed.url = await fileToBase64(attachment.data);
          }
        } catch (err) {
          console.error('Failed to convert file to base64:', err);
        }
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
      name: 'Chat ' + (chatHistory.length + 1),
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

export const getMessages = (chatId: string): Message[] => {
  const chatHistory = getChatHistory();
  const chat = chatHistory.find(chat => chat.id === chatId);
  return chat ? chat.messages : [];
};

export const saveSettings = (settings: ChatSettings): void => {
  localStorage.setItem('chatSettings', JSON.stringify(settings));
};

export const getSettings = (): ChatSettings => {
  const defaultSettings: ChatSettings = {
    webhookUrl: '',
    typingAnimation: true,
    chatId: generateId(),
    chatName: 'Chat with n8n'
  };
  
  const savedSettings = localStorage.getItem('chatSettings');
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
};

export const getChatHistory = (): ChatHistoryData[] => {
  const savedHistory = localStorage.getItem('chatHistory');
  return savedHistory ? JSON.parse(savedHistory) : [];
};

export const clearChatHistory = (chatId: string): void => {
  const chatHistory = getChatHistory();
  const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
  localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
};

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
    linkElement.click();
  }
};

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

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create object URL for a file
export const createObjectURL = (file: File): string => {
  return URL.createObjectURL(file);
};

// Revoke object URL
export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};

// Check if the file is an image
export const isImageFile = (file: File | null | undefined): boolean => {
  if (!file || !file.type) return false;
  return file.type.startsWith('image/');
};

// Check if an attachment is an audio file
export const isAudioFile = (attachment: Attachment): boolean => {
  // Check both type string and data property
  if (attachment.data) {
    return attachment.data.type.startsWith('audio/');
  }
  return attachment.type && attachment.type.toLowerCase().startsWith('audio/');
};

// Send message to webhook
export const sendToWebhook = async (
  webhookUrl: string,
  message: string | undefined,
  files: File[] | undefined,
  chatId: string
): Promise<string> => {
  try {
    if (!webhookUrl) {
      throw new Error('Webhook URL is not set');
    }

    const formData = new FormData();
    formData.append('chatId', chatId);
    
    if (message) {
      formData.append('message', message);
    }
    
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Better handling of response formats
    if (typeof data === 'string') {
      return data;
    } else if (data && typeof data.message === 'string') {
      return data.message;
    } else if (data && typeof data.output === 'string') {
      return data.output;
    } else if (Array.isArray(data) && data.length > 0) {
      return typeof data[0] === 'string' ? data[0] : 
             (data[0].message || data[0].output || 'Received response from n8n');
    } else {
      // Inspect the actual response structure for better handling
      console.log("Response data structure:", JSON.stringify(data));
      return 'Received response from n8n';
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

// Handle voice recording
export let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export const startRecording = async (): Promise<void> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    audioChunks = [];
    
    mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });
    
    mediaRecorder.start();
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

export const stopRecording = async (): Promise<File | null> => {
  return new Promise((resolve) => {
    if (!mediaRecorder) {
      resolve(null);
      return;
    }
    
    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, { 
        type: 'audio/webm' 
      });
      
      // Stop all audio tracks
      if (mediaRecorder && mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      
      mediaRecorder = null;
      audioChunks = [];
      
      resolve(audioFile);
    });
    
    mediaRecorder.stop();
  });
};
