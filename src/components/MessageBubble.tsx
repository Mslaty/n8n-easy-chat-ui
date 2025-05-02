
import React, { useState, useEffect } from 'react';
import { Message, Attachment } from '../types';
import { formatFileSize, isImageFile, isAudioFile } from '../utils';
import { File, Copy, Download, Play, Pause } from 'lucide-react';

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
  const [audioElements, setAudioElements] = useState<{[key: string]: HTMLAudioElement}>({});
  const isUser = message.sender === 'user';
  
  const handleCopy = () => {
    onCopyMessage(message.content);
  };
  
  const toggleAudioPlayback = (attachment: Attachment) => {
    const attachmentId = attachment.id || '';
    
    // If no audio element exists for this attachment, create one
    if (!audioElements[attachmentId] && attachment.data) {
      const url = URL.createObjectURL(attachment.data);
      const audio = new Audio(url);
      
      audio.addEventListener('ended', () => {
        setPlayingAudio(null);
      });
      
      setAudioElements(prev => ({
        ...prev,
        [attachmentId]: audio
      }));
      
      audio.play();
      setPlayingAudio(attachmentId);
      return;
    }
    
    // If an audio element exists, toggle play/pause
    const audio = audioElements[attachmentId];
    if (audio) {
      if (playingAudio === attachmentId) {
        audio.pause();
        setPlayingAudio(null);
      } else {
        // Pause any currently playing audio
        if (playingAudio && audioElements[playingAudio]) {
          audioElements[playingAudio].pause();
        }
        
        audio.play();
        setPlayingAudio(attachmentId);
      }
    }
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
          isUser 
            ? 'bg-chat-user-bubble text-white' 
            : 'bg-chat-agent-bubble text-gray-200'
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
          <div className="space-y-2 mt-2">
            {message.attachments.map((attachment) => (
              <div 
                key={attachment.id || attachment.name}
                className="rounded border border-gray-700"
              >
                {attachment.previewUrl && isImageFile(attachment.data) ? (
                  <div className="relative group">
                    <img 
                      src={attachment.previewUrl} 
                      alt={attachment.name || 'Image attachment'}
                      className="rounded max-h-60 w-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={() => onDownloadAttachment(attachment)}
                        className="p-2 rounded-full bg-gray-800 bg-opacity-70 text-white hover:bg-opacity-100"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ) : attachment.data && isAudioFile(attachment.data) ? (
                  <div className="flex items-center p-2 bg-gray-800 bg-opacity-30">
                    <button
                      onClick={() => toggleAudioPlayback(attachment)}
                      className="p-2 rounded-full bg-gray-700 mr-3 text-white hover:bg-gray-600"
                    >
                      {playingAudio === (attachment.id || '') ? 
                        <Pause size={16} /> : 
                        <Play size={16} />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{attachment.name}</div>
                      {attachment.size && (
                        <div className="text-xs text-gray-400">
                          {formatFileSize(attachment.size)}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => onDownloadAttachment(attachment)}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center p-2 bg-gray-800 bg-opacity-30">
                    <File size={18} className="text-gray-400 mr-2" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{attachment.name}</div>
                      {attachment.size && (
                        <div className="text-xs text-gray-400">
                          {formatFileSize(attachment.size)}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => onDownloadAttachment(attachment)}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
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
