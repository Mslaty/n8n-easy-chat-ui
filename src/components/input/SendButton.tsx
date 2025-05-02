
import React from 'react';
import { Send } from 'lucide-react';

interface SendButtonProps {
  onClick?: () => void;
  disabled: boolean;
  visible: boolean;
  colorTheme?: 'purple' | 'blue' | 'green' | 'orange';
}

const SendButton: React.FC<SendButtonProps> = ({ 
  onClick, 
  disabled, 
  visible,
  colorTheme = 'purple'
}) => {
  if (!visible) return null;
  
  return (
    <button 
      type="submit" 
      disabled={disabled} 
      aria-label="Send message" 
      onClick={onClick}
      className={`text-gray-400 hover:text-chat-${colorTheme} p-2 rounded-full transition-opacity duration-300 animate-fade-in disabled:opacity-50`}
    >
      <Send size={20} />
    </button>
  );
};

export default SendButton;
