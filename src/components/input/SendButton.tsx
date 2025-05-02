
import React from 'react';
import { Send } from 'lucide-react';

interface SendButtonProps {
  onClick?: () => void;
  disabled: boolean;
  visible: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled, visible }) => {
  if (!visible) return null;
  
  return (
    <button 
      type="submit" 
      disabled={disabled} 
      aria-label="Send message" 
      onClick={onClick}
      className="text-gray-400 hover:text-white p-2 rounded-full transition-opacity duration-300 animate-fade-in"
    >
      <Send size={20} />
    </button>
  );
};

export default SendButton;
