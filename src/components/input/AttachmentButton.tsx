
import React from 'react';
import { FileUp } from 'lucide-react';

interface AttachmentButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({ onClick, disabled }) => {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="p-2 text-gray-400 hover:text-chat-accent transition-colors rounded-full disabled:opacity-50 disabled:hover:text-gray-400" 
      disabled={disabled} 
      aria-label="Attach file"
      title="Attach files"
    >
      <FileUp size={20} />
    </button>
  );
};

export default AttachmentButton;
