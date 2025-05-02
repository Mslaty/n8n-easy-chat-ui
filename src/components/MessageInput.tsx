
import React from 'react';
import { Attachment } from '../types';
import { useMessageInput } from '../hooks/useMessageInput';
import AttachmentButton from './input/AttachmentButton';
import VoiceRecordButton from './input/VoiceRecordButton';
import SendButton from './input/SendButton';
import AttachmentPreview from './input/AttachmentPreview';

interface MessageInputProps {
  onSendMessage: (message: string, attachments: Attachment[]) => void;
  isConnected: boolean;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isConnected,
  isLoading
}) => {
  const {
    message,
    setMessage,
    attachments,
    isDragging,
    isRecording,
    recordingDuration,
    fileInputRef,
    textareaRef,
    handleSubmit,
    handleKeyDown,
    handleFileChange,
    handleFileDrop,
    removeAttachment,
    handleDragOver,
    handleDragLeave,
    handleRecordToggle,
    triggerFileInput,
    shouldShowSendButton,
    isConnected: connected,
    isLoading: loading
  } = useMessageInput(onSendMessage, isConnected, isLoading);

  return (
    <div className="">
      <AttachmentPreview 
        attachments={attachments} 
        onRemove={removeAttachment} 
      />
      
      <form 
        onSubmit={handleSubmit} 
        className={`relative ${isDragging ? 'drag-over' : ''}`} 
        onDragOver={handleDragOver} 
        onDragLeave={handleDragLeave} 
        onDrop={handleFileDrop}
      >
        <div className="flex bg-chat-dark-secondary rounded-t-lg mx-[50px] px-[5px] my-0 py-[5px] border-t border-l border-r border-gray-700">
          {/* Left side (attachment button) */}
          <div className="flex pt-2 items-start">
            <AttachmentButton 
              onClick={triggerFileInput} 
              disabled={!isConnected || isLoading} 
            />
          </div>
          
          {/* Center textarea */}
          <div className="flex-1">
            <textarea 
              ref={textareaRef} 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              onKeyDown={handleKeyDown} 
              placeholder="Write your message..." 
              className="w-full bg-transparent text-white placeholder-gray-500 p-3 outline-none resize-none max-h-32" 
              rows={1} 
              disabled={!isConnected || isLoading} 
            />
          </div>
          
          {/* Right side (recording and send buttons) */}
          <div className="flex pt-2 items-center space-x-1">
            <VoiceRecordButton 
              isRecording={isRecording}
              onClick={handleRecordToggle}
              disabled={!isConnected || isLoading}
              recordingDuration={recordingDuration}
            />
            
            <SendButton 
              disabled={!message.trim() && attachments.length === 0 || !isConnected || isLoading}
              visible={shouldShowSendButton}
            />
          </div>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          multiple 
        />
        
        {isDragging && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <p className="text-white">Drop files here</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
