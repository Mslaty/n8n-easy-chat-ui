
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useCopyMessage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
      .catch(err => {
        console.error('Failed to copy message:', err);
      });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedCode(code);
        toast({
          title: "Copied!",
          description: "Code copied to clipboard"
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopiedCode(null);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
        toast({
          title: "Error",
          description: "Failed to copy code to clipboard",
          variant: "destructive"
        });
      });
  };

  return {
    copiedCode,
    handleCopy,
    handleCopyCode
  };
};
