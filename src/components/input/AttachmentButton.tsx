
import React from 'react';
import { Paperclip } from 'lucide-react';

interface AttachmentButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({ onClick, disabled }) => {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="p-2 text-gray-400 hover:text-white rounded-full disabled:opacity-50" 
      disabled={disabled} 
      aria-label="Attach file"
    >
      <Paperclip size={20} />
    </button>
  );
};

export default AttachmentButton;
