import React, { useState, useEffect } from 'react';
import { Copy, CopyCheck, CircleEllipsis } from 'lucide-react';
import { Message, Attachment } from '../types';
import AttachmentsList from './AttachmentsList';
import { isAudioFile } from '../utils';
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  
  const isUser = message.sender === 'user';
  
  // Handle typing animation effect when message changes
  useEffect(() => {
    // If the message is "Agent is typing...", we don't need any typing animation
    if (message.content === 'Agent is typing...') {
      setDisplayedText(message.content);
      setIsTyping(false);
      return;
    }
    
    // Check if this is a new message that should have typing animation
    // Only apply typing animation to agent messages that have the isTyping flag
    if (message.isTyping && !isUser && message.content) {
      setIsTyping(true);
      setDisplayedText('');
      
      let index = 0;
      const content = message.content;
      
      // Start the typing animation
      const interval = setInterval(() => {
        setDisplayedText(content.substring(0, index + 1));
        index++;
        
        if (index >= content.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15); // Typing speed
      
      return () => clearInterval(interval);
    } else {
      // For regular messages or existing messages on page reload, just show the full content
      setDisplayedText(message.content || '');
      setIsTyping(false);
    }
  }, [message.content, message.isTyping, isUser]);
  
  const handleCopy = () => {
    onCopyMessage(message.content);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedCode(code);
        toast({
          title: "Copied!",
          description: "Code copied to clipboard"
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopiedCode(null);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
        toast({
          title: "Error",
          description: "Failed to copy code to clipboard",
          variant: "destructive"
        });
      });
  };

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
  
  // Custom renderer for code blocks to add copy button
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      
      if (!inline && code) {
        const isCopied = copiedCode === code;
        
        return (
          <div className="relative group/code">
            <code className={className} {...props}>
              {children}
            </code>
            <button
              onClick={() => handleCopyCode(code)}
              className="absolute right-2 top-2 p-1 rounded bg-gray-800/50 text-gray-400 opacity-0 group-hover/code:opacity-100 hover:bg-gray-700/50 hover:text-white transition-opacity"
              aria-label="Copy code"
            >
              {isCopied ? <CopyCheck size={18} /> : <Copy size={18} />}
            </button>
          </div>
        );
      }
      
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  // Loading animation for agent typing
  const LoadingDots = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <CircleEllipsis size={20} className="text-chat-accent animate-pulse" />
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "300ms" }} />
          <div className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: "600ms" }} />
        </div>
      </div>
    );
  };
  
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
        className={`rounded-lg px-4 py-2 max-w-[80%] break-words flex items-center justify-center ${
          isUser ? 'bg-chat-user-bubble text-white' : 'bg-chat-agent-bubble text-gray-200'
        } ${message.content === 'Agent is typing...' ? 'animate-pulse' : ''}`}
      >
        {message.content && message.content === 'Agent is typing...' ? (
          <LoadingDots />
        ) : message.content && (
          <div className="mb-2 w-full text-center">
            {isTyping ? (
              <div className="text-sm typing-animation">
                {displayedText}
                <span className="typing-cursor">|</span>
              </div>
            ) : (
              <div className="markdown-content text-sm">
                <ReactMarkdown className="prose prose-invert prose-sm max-w-none" components={components}>
                  {message.content}
                </ReactMarkdown>
              </div>
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
