
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useCopyMessage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleCopy = (content: string) => {
    try {
      // Create a textarea element to copy from
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      toast({
        title: "Copied!",
        description: "Message copied to clipboard"
      });
    } catch (err) {
      console.error('Failed to copy message:', err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleCopyCode = (code: string) => {
    try {
      // Create a textarea element to copy from
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      setCopiedCode(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard"
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      toast({
        title: "Error",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  return {
    copiedCode,
    handleCopy,
    handleCopyCode
  };
};
