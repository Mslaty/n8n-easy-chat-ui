
import React from 'react';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  position: 'left' | 'right';
  onClick: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ position, onClick }) => {
  const positionClasses = position === 'left' 
    ? "left-0 -translate-x-2" 
    : "right-0 translate-x-2";

  return (
    <div className={`absolute ${positionClasses} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`}>
      <button 
        onClick={onClick} 
        className="text-xs text-gray-400 p-1 hover:text-white rounded bg-chat-dark-secondary" 
        aria-label="Copy message"
      >
        <Copy size={14} />
      </button>
    </div>
  );
};

export default CopyButton;
