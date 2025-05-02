
import React from 'react';
import { PaperclipIcon } from 'lucide-react';

interface AttachmentButtonProps {
  onClick: () => void;
  disabled: boolean;
  colorTheme?: 'purple' | 'blue' | 'green' | 'orange';
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({ 
  onClick, 
  disabled,
  colorTheme = 'purple'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 text-gray-400 hover:text-chat-${colorTheme} transition-colors disabled:opacity-50`}
      aria-label="Add attachment"
    >
      <PaperclipIcon size={20} />
    </button>
  );
};

export default AttachmentButton;
