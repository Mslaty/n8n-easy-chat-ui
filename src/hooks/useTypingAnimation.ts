
import { useState, useEffect } from 'react';
import { Message } from '../types';

export const useTypingAnimation = (message: Message, isUser: boolean) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
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

  return { displayedText, isTyping };
};
