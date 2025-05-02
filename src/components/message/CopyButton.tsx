
import React from 'react';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  position: 'left' | 'right';
  onClick: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ position, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="text-xs text-gray-400 p-1 hover:text-white rounded bg-chat-dark-secondary z-20" 
      aria-label="Copy message"
    >
      <Copy size={14} />
    </button>
  );
};

export default CopyButton;
