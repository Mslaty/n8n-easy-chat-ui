
import React, { useState, useEffect } from 'react';
import { Message, Attachment } from '../../types';
import AttachmentsList from '../AttachmentsList';
import { isAudioFile } from '../../utils';
import CopyButton from './CopyButton';
import MessageContent from './MessageContent';
import { useAudioElements } from '../../hooks/useAudioElements';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { useCopyMessage } from '../../hooks/useCopyMessage';

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
  const [showActions, setShowActions] = useState(false); // Initially hide actions until hover
  const isUser = message.sender === 'user';
  
  const { playingAudio, setPlayingAudio, audioElements, setAudioElements, resetAudioStates } = useAudioElements();
  const { displayedText, isTyping } = useTypingAnimation(message, isUser);
  const { copiedCode, handleCopy, handleCopyCode } = useCopyMessage();

  // Reset audio states when message changes
  useEffect(() => {
    resetAudioStates();
  }, [message.id, resetAudioStates]);

  // Check if the message only contains voice attachments and no text content
  const isOnlyVoiceMessage = () => {
    if (!message.attachments || message.attachments.length === 0) return false;
    
    // Check if all attachments are audio files
    const hasOnlyAudioAttachments = message.attachments.every(attachment => 
      isAudioFile(attachment)
    );
    
    // Return true if has only audio attachments and no text content
    return hasOnlyAudioAttachments && (!message.content || message.content.trim() === '');
  };

  // Check if this is a loading message with three dots
  const isLoadingDotsMessage = () => {
    return message.content === 'Agent is typing...';
  };

  const handleCopyClick = () => {
    if (message.content) {
      handleCopy(message.content);
      onCopyMessage(message.content);
    }
  };
  
  return (
    <div 
      className="flex mb-4 relative group"
      style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}
      onMouseEnter={() => setShowActions(true)} 
      onMouseLeave={() => setShowActions(false)} 
      data-testid={`message-bubble-${message.id}`}
    >
      <div 
        className={`rounded-lg px-4 py-3 max-w-[80%] break-words flex items-center relative ${
          isUser ? 'bg-chat-user-bubble text-white justify-center' : 'bg-chat-agent-bubble text-gray-200 justify-start'
        }`}
      >
        {/* Only show copy button for agent messages when hovering and not for loading messages */}
        {!isUser && !isOnlyVoiceMessage() && !isLoadingDotsMessage() && showActions && (
          <div 
            className="absolute top-1 right-1"
            style={{ 
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              zIndex: 100 // Increased z-index for better visibility
            }}
            data-testid="copy-button-agent"
          >
            <CopyButton 
              position="right" 
              onClick={handleCopyClick} 
            />
          </div>
        )}
        
        {message.content && (
          <div className={`w-full ${isUser ? 'text-center' : 'text-left'}`}>
            <MessageContent 
              content={message.content}
              isTyping={isTyping}
              displayedText={displayedText}
              isUser={isUser}
              copiedCode={copiedCode}
              handleCopyCode={handleCopyCode}
            />
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
      </div>
    </div>
  );
};

export default MessageBubble;
