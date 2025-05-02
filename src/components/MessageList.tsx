
import React, { useEffect, useRef } from 'react';
import { Message, Attachment } from '../types';
import MessageBubble from './message/MessageBubble';
import { ScrollArea } from './ui/scroll-area';

interface MessageListProps {
  messages: Message[];
  onCopyMessage: (content: string) => void;
  onDownloadAttachment: (attachment: Attachment) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages = [], // Provide default empty array to prevent undefined error
  onCopyMessage,
  onDownloadAttachment
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <ScrollArea className="flex-1 relative">
      <div className="px-[50px] py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <div>
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">Save the n8n webhook link and type your first message</p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onCopyMessage={onCopyMessage} 
              onDownloadAttachment={onDownloadAttachment} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
