
import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Attachment } from '../types';
import { useChatManagement } from '../hooks/useChatManagement';

interface ChatContainerProps {
  settings: any;
  isConnected: boolean;
  onCopyMessage: (content: string) => void;
  onDownloadAttachment: (attachment: Attachment) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  settings, 
  isConnected,
  onCopyMessage,
  onDownloadAttachment
}) => {
  const { 
    messages,
    isTyping,
    handleSendMessage,
    handleAddAttachment,
    handleDeleteMessage
  } = useChatManagement(settings);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      files.forEach(file => {
        handleAddAttachment(file);
      });
    }
  };
  
  return (
    <div 
      className={`flex-1 flex flex-col overflow-hidden ${isDragging ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <MessageList 
        messages={messages} 
        onDeleteMessage={handleDeleteMessage}
        onCopyMessage={onCopyMessage}
        onDownloadAttachment={onDownloadAttachment}
        colorTheme={settings.colorTheme || 'purple'}
      />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        onAddAttachment={handleAddAttachment}
        isConnected={isConnected}
        typingIndicator={isTyping}
        colorTheme={settings.colorTheme || 'purple'}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
