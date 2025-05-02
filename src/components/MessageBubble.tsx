
import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { Message, Attachment } from '../types';
import AttachmentsList from './AttachmentsList';

interface MessageBubbleProps {
  message: Message;
  onCopyMessage: (content: string) => void;
  onDownloadAttachment: (attachment: Attachment) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onCopyMessage,
  onDownloadAttachment
}) => {
  const [showActions, setShowActions] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});
  
  const isUser = message.sender === 'user';
  
  const handleCopy = () => {
    onCopyMessage(message.content);
  };

  // Cleanup audio elements on component unmount
  useEffect(() => {
    return () => {
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        if (audio.src.startsWith('blob:')) {
          URL.revokeObjectURL(audio.src);
        }
      });
    };
  }, [audioElements]);
  
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} message-appear`}>
      <div 
        className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
          isUser ? 'bg-chat-user-bubble text-white' : 'bg-chat-agent-bubble text-gray-200'
        } ${message.isTyping ? 'animate-pulse' : ''}`} 
        onMouseEnter={() => setShowActions(true)} 
        onMouseLeave={() => setShowActions(false)}
      >
        {message.content && (
          <div className="mb-2">
            {message.isTyping ? (
              <span className="typing-indicator">{message.content}</span>
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>
        )}
        
        {!message.isTyping && message.attachments && message.attachments.length > 0 && (
          <AttachmentsList 
            attachments={message.attachments}
            onDownloadAttachment={onDownloadAttachment}
            audioElements={audioElements}
            playingAudio={playingAudio}
            setPlayingAudio={setPlayingAudio}
            setAudioElements={setAudioElements}
          />
        )}
        
        {showActions && !message.isTyping && (
          <div className="flex justify-end mt-1">
            <button 
              onClick={handleCopy} 
              className="text-xs text-gray-400 p-1 hover:text-white" 
              aria-label="Copy message"
            >
              <Copy size={14} />
            </button>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-1 text-right">
          {message.timestamp && (
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
