
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

export const useCopyMessage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const handleCopy = (content: string) => {
    try {
      // Modern approach using Clipboard API with fallback to execCommand
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content).then(() => {
          // Use sonner toast for a more compact, semi-transparent dark notification
          toast("Copied to clipboard", {
            duration: 2000,
            className: "bg-black/70 text-white text-xs py-1.5 px-3 rounded-md border-0",
            position: "bottom-right",
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
      toast("Failed to copy", {
        duration: 2000,
        className: "bg-black/70 text-red-300 text-xs py-1.5 px-3 rounded-md border-0",
        position: "bottom-right",
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
        toast("Copied to clipboard", {
          duration: 2000,
          className: "bg-black/70 text-white text-xs py-1.5 px-3 rounded-md border-0",
          position: "bottom-right",
        });
      } else {
        throw new Error('Copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Could not copy text: ', err);
      toast("Failed to copy", {
        duration: 2000,
        className: "bg-black/70 text-red-300 text-xs py-1.5 px-3 rounded-md border-0",
        position: "bottom-right",
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
          
          toast("Copied to clipboard", {
            duration: 2000,
            className: "bg-black/70 text-white text-xs py-1.5 px-3 rounded-md border-0",
            position: "bottom-right",
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
      toast("Failed to copy", {
        duration: 2000,
        className: "bg-black/70 text-red-300 text-xs py-1.5 px-3 rounded-md border-0",
        position: "bottom-right",
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
        toast("Copied to clipboard", {
          duration: 2000,
          className: "bg-black/70 text-white text-xs py-1.5 px-3 rounded-md border-0",
          position: "bottom-right",
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
      toast("Failed to copy", {
        duration: 2000,
        className: "bg-black/70 text-red-300 text-xs py-1.5 px-3 rounded-md border-0",
        position: "bottom-right",
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
