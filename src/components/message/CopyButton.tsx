
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  position: 'left' | 'right';
  onClick: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ position, onClick }) => {
  return (
    <Button 
      onClick={onClick} 
      variant="ghost" 
      size="icon"
      className="bg-chat-dark-secondary hover:bg-gray-700 text-gray-400 hover:text-white p-1 h-auto w-auto z-20" 
      aria-label="Copy message"
    >
      <Copy size={14} />
    </Button>
  );
};

export default CopyButton;
