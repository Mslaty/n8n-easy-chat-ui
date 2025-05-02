
import React from 'react';
import { Message, Attachment } from '../types';
import MessageBubble from './message/MessageBubble';

interface MessageListProps {
  messages: Message[];
  onDeleteMessage?: (id: string) => void;
  onCopyMessage: (content: string) => void;
  onDownloadAttachment: (attachment: Attachment) => void;
  colorTheme?: 'purple' | 'blue' | 'green' | 'orange';
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onDeleteMessage,
  onCopyMessage,
  onDownloadAttachment,
  colorTheme = 'purple'
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onCopyMessage={onCopyMessage}
            onDownloadAttachment={onDownloadAttachment}
            colorTheme={colorTheme}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageList;
