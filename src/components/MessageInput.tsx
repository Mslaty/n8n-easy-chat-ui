
import React, { useState, useRef, useEffect } from 'react';
import { Attachment } from '../types';
import { useMessageInput } from '../hooks/useMessageInput';
import SendButton from './input/SendButton';
import AttachmentButton from './input/AttachmentButton';
import VoiceRecordButton from './input/VoiceRecordButton';
import AttachmentPreview from './input/AttachmentPreview';

interface MessageInputProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  onAddAttachment: (file: File) => Attachment;
  isConnected: boolean;
  typingIndicator: boolean;
  colorTheme?: 'purple' | 'blue' | 'green' | 'orange'; 
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onAddAttachment,
  isConnected,
  typingIndicator,
  colorTheme = 'purple'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    message,
    setMessage,
    attachments,
    setAttachments,
    isRecording,
    setIsRecording,
    recordingSeconds,
    handleStartRecording,
    handleStopRecording,
    handleTextareaKeyDown,
    handleRemoveAttachment,
    handleFileChange,
    handleSendClick,
    hasContent
  } = useMessageInput(onSendMessage, onAddAttachment, textareaRef);
  
  // Automatically adjust textarea height as content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(40, scrollHeight), 120)}px`;
    }
  }, [message]);
  
  // Focus textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="border-t border-gray-800">
      {attachments.length > 0 && (
        <div className="px-4 pt-3 pb-1 gap-2 flex flex-wrap">
          {attachments.map((attachment) => (
            <AttachmentPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={() => handleRemoveAttachment(attachment.id)}
            />
          ))}
        </div>
      )}
      
      <form 
        className="flex items-end p-3 rounded-b-lg space-x-2 relative" 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendClick();
        }}
      >
        {/* File Input (Hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        
        {/* Attachment Button */}
        <AttachmentButton 
          onClick={() => fileInputRef.current?.click()}
          disabled={!isConnected || isRecording}
          colorTheme={colorTheme}
        />

        {/* Voice Recording Button */}
        <VoiceRecordButton
          isRecording={isRecording}
          recordingSeconds={recordingSeconds}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          disabled={!isConnected}
          colorTheme={colorTheme}
        />
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder={isConnected ? "Type a message..." : "Connect to n8n webhook first..."}
            className="w-full p-3 pr-10 resize-none rounded-lg bg-gray-900/40 border-gray-700 focus:border-gray-600 focus:ring-0 text-white placeholder-gray-500"
            disabled={!isConnected || isRecording}
            rows={1}
          />
        </div>
        
        {/* Send Button */}
        <SendButton
          onClick={handleSendClick}
          disabled={!isConnected || (!hasContent && !attachments.length) || typingIndicator}
          visible={!isRecording}
          colorTheme={colorTheme}
        />
      </form>
    </div>
  );
};

export default MessageInput;
