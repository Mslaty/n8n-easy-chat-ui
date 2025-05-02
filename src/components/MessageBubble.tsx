
import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { Message, Attachment } from '../types';
import AttachmentsList from './AttachmentsList';
import { isAudioFile } from '../utils';

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

  // Check if the message only contains voice attachments and no text content
  const isOnlyVoiceMessage = () => {
    if (!message.attachments || message.attachments.length === 0) return false;
    
    // Check if all attachments are audio files
    const hasOnlyAudioAttachments = message.attachments.every(attachment => 
      attachment.data && isAudioFile(attachment.data)
    );
    
    // Return true if has only audio attachments and no text content
    return hasOnlyAudioAttachments && (!message.content || message.content.trim() === '');
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
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in group relative`}
         onMouseEnter={() => setShowActions(true)} 
         onMouseLeave={() => setShowActions(false)}>
      
      {/* Copy button positioned outside the bubble - for user messages (left side) */}
      {isUser && showActions && !message.isTyping && !isOnlyVoiceMessage() && (
        <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleCopy} 
            className="text-xs text-gray-400 p-1 hover:text-white rounded bg-chat-dark-secondary" 
            aria-label="Copy message"
          >
            <Copy size={14} />
          </button>
        </div>
      )}
      
      <div 
        className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
          isUser ? 'bg-chat-user-bubble text-white' : 'bg-chat-agent-bubble text-gray-200'
        } ${message.isTyping ? 'animate-pulse' : ''}`}
      >
        {message.content && (
          <div className="mb-2">
            {message.isTyping ? (
              <span className="typing-indicator text-sm">{message.content}</span>
            ) : (
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
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
      
      {/* Copy button positioned outside the bubble - for agent messages (right side) */}
      {!isUser && showActions && !message.isTyping && !isOnlyVoiceMessage() && (
        <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleCopy} 
            className="text-xs text-gray-400 p-1 hover:text-white rounded bg-chat-dark-secondary" 
            aria-label="Copy message"
          >
            <Copy size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
