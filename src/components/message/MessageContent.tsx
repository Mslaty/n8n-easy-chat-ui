
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, CopyCheck } from 'lucide-react';
import LoadingDots from './LoadingDots';

interface MessageContentProps {
  content: string | undefined;
  isTyping: boolean;
  displayedText: string;
  isUser: boolean;
  copiedCode: string | null;
  handleCopyCode: (code: string) => void;
}

const MessageContent: React.FC<MessageContentProps> = ({
  content,
  isTyping,
  displayedText,
  isUser,
  copiedCode,
  handleCopyCode
}) => {
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

  if (!content) return null;
  
  if (content === 'Agent is typing...') {
    return <LoadingDots />;
  }

  if (isTyping) {
    return (
      <div className="text-sm typing-animation">
        {displayedText}
        <span className="typing-cursor">|</span>
      </div>
    );
  }

  return (
    <div className="markdown-content text-sm">
      <ReactMarkdown className="prose prose-invert prose-sm max-w-none" components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;
