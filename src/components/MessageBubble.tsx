
import React, { useState } from 'react';
import { Message, Attachment } from '../types';
import { formatFileSize, isImageFile } from '../utils';
import { File, Copy, Download, Play, Pause, Volume2 } from 'lucide-react';

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
  
  const isAudioFile = (file: File): boolean => {
    return file.type.startsWith('audio/');
  };
  
  const toggleAudioPlayback = (attachment: Attachment) => {
    const attachmentId = attachment.id;
    
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
  React.useEffect(() => {
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
      <div className="flex max-w-[80%] md:max-w-[70%]">
        {!isUser && (
          <div className="flex-shrink-0 mr-3 mt-1">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
              AG
            </div>
          </div>
        )}
        
        <div 
          className={`relative group ${isUser ? 'order-1' : 'order-2'}`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-chat-user-bubble text-white' 
              : 'bg-chat-agent-bubble text-gray-200'
          }`}>
            {message.isTyping ? (
              <div className="typing-indicator">
                {message.content.substring(0, message.content.length * 0.3)}
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            )}
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="rounded border border-gray-700 overflow-hidden"
                  >
                    {isImageFile(attachment.data as File) && attachment.previewUrl ? (
                      <div className="relative group">
                        <img 
                          src={attachment.previewUrl} 
                          alt={attachment.name}
                          className="max-w-full rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button 
                            onClick={() => onDownloadAttachment(attachment)}
                            className="p-1 bg-black bg-opacity-50 rounded-full text-white"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    ) : isAudioFile(attachment.data as File) ? (
                      <div className="flex items-center p-2 bg-gray-800 bg-opacity-30">
                        <button
                          onClick={() => toggleAudioPlayback(attachment)}
                          className="p-2 rounded-full bg-gray-700 mr-3 text-white hover:bg-gray-600"
                        >
                          {playingAudio === attachment.id ? 
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
                        <div className="flex items-center">
                          <Volume2 size={14} className="text-gray-400 mr-1" />
                          <button 
                            onClick={() => onDownloadAttachment(attachment)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Download size={16} />
                          </button>
                        </div>
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
          </div>
          
          {showActions && (
            <div className={`absolute ${isUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-0 flex items-center gap-1 p-1`}>
              <button 
                onClick={handleCopy}
                className="p-1 bg-gray-800 rounded text-gray-400 hover:text-white"
                title="Copy message"
              >
                <Copy size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
