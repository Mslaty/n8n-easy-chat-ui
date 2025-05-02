
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useCopyMessage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleCopy = (content: string) => {
    try {
      // Modern approach using Clipboard API with fallback to execCommand
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content).then(() => {
          toast({
            title: "Copied!",
            description: "Message copied to clipboard"
          });
        }).catch(err => {
          console.error('Failed to copy with Clipboard API:', err);
          fallbackCopyToClipboard(content);
        });
      } else {
        fallbackCopyToClipboard(content);
      }
    } catch (err) {
      console.error('Failed to copy message:', err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    // Create a textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast({
          title: "Copied!",
          description: "Message copied to clipboard"
        });
      } else {
        throw new Error('Copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Could not copy text: ', err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleCopyCode = (code: string) => {
    try {
      // Use the same approach as handleCopy for consistency
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(() => {
          setCopiedCode(code);
          toast({
            title: "Copied!",
            description: "Code copied to clipboard"
          });
          
          // Reset copied state after 2 seconds
          setTimeout(() => {
            setCopiedCode(null);
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy with Clipboard API:', err);
          fallbackCopyCodeToClipboard(code);
        });
      } else {
        fallbackCopyCodeToClipboard(code);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
      toast({
        title: "Error",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const fallbackCopyCodeToClipboard = (code: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedCode(code);
        toast({
          title: "Copied!",
          description: "Code copied to clipboard"
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopiedCode(null);
        }, 2000);
      } else {
        throw new Error('Copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Could not copy code: ', err);
      toast({
        title: "Error",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    } finally {
      document.body.removeChild(textarea);
    }
  };

  return {
    copiedCode,
    handleCopy,
    handleCopyCode
  };
};
