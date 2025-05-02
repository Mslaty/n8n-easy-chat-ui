import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Mic, Square, File as FileIcon } from 'lucide-react';
import { Attachment } from '../types';
import { generateId, createObjectURL, startRecording, stopRecording, isImageFile } from '../utils';

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
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingTimerRef = useRef<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() || attachments.length > 0) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: Attachment[] = [];
      Array.from(e.target.files).forEach(file => {
        const isImage = isImageFile(file);
        if (!isImage && file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} exceeds the 10MB limit for non-image files.`);
          return;
        }
        const attachment: Attachment = {
          id: generateId(),
          name: file.name,
          type: file.type,
          data: file,
          size: file.size
        };
        if (isImage) {
          attachment.previewUrl = createObjectURL(file);
        }
        newAttachments.push(attachment);
      });
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newAttachments: Attachment[] = [];
      Array.from(e.dataTransfer.files).forEach(file => {
        const isImage = isImageFile(file);
        if (!isImage && file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} exceeds the 10MB limit for non-image files.`);
          return;
        }
        const attachment: Attachment = {
          id: generateId(),
          name: file.name,
          type: file.type,
          data: file,
          size: file.size
        };
        if (isImage) {
          attachment.previewUrl = createObjectURL(file);
        }
        newAttachments.push(attachment);
      });
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleRecordToggle = async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
        setRecordingDuration(0);
        if (recordingTimerRef.current) {
          window.clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        const audioFile = await stopRecording();
        if (audioFile) {
          const voiceAttachment: Attachment = {
            id: generateId(),
            name: audioFile.name,
            type: audioFile.type,
            data: audioFile,
            size: audioFile.size
          };
          onSendMessage('', [voiceAttachment]);
        }
      } else {
        await startRecording();
        setIsRecording(true);
        setRecordingDuration(0);
        recordingTimerRef.current = window.setInterval(() => {
          setRecordingDuration(prev => prev + 1);
        }, 1000);
      }
    } catch (error) {
      console.error('Error with voice recording:', error);
      alert('Could not access microphone. Please check your browser permissions.');
      setIsRecording(false);
      setRecordingDuration(0);
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const shouldShowSendButton = message.trim().length > 0 || attachments.length > 0;

  return (
    <div className="">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 mx-[50px]">
          {attachments.map(attachment => (
            <div key={attachment.id} className="relative group">
              <div className="flex items-center bg-gray-800 rounded p-1.5 pr-8">
                {attachment.previewUrl ? (
                  <img src={attachment.previewUrl} alt={attachment.name} className="w-8 h-8 object-cover rounded mr-2" />
                ) : (
                  <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mr-2">
                    <FileIcon size={16} className="text-gray-400" />
                  </div>
                )}
                <span className="text-sm text-gray-300 truncate max-w-[150px]">
                  {attachment.name}
                </span>
                <button onClick={() => removeAttachment(attachment.id)} className="absolute right-1 top-1 text-gray-400 hover:text-white p-1">
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit} 
        className={`relative ${isDragging ? 'drag-over' : ''}`} 
        onDragOver={handleDragOver} 
        onDragLeave={handleDragLeave} 
        onDrop={handleFileDrop}
      >
        <div className="flex bg-chat-dark-secondary rounded-t-lg mx-[50px] px-[5px] my-0 py-[5px]">
          {/* Left side (attachment button) - vertically aligned to the top */}
          <div className="flex pt-2 items-start">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="p-2 text-gray-400 hover:text-white rounded-full disabled:opacity-50" 
              disabled={!isConnected || isLoading} 
              aria-label="Attach file"
            >
              <Paperclip size={20} />
            </button>
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
          
          {/* Right side (recording and send buttons) - vertically aligned to the top */}
          <div className="flex pt-2 items-start space-x-1">
            {isRecording && (
              <div className="flex items-center mr-2 text-red-500">
                <span className="text-sm animate-timer-pulse">{formatRecordingTime(recordingDuration)}</span>
              </div>
            )}
            <button 
              type="button" 
              onClick={handleRecordToggle} 
              className={`p-2 rounded-full ${isRecording ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'} disabled:opacity-50`} 
              disabled={!isConnected || isLoading} 
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <Square size={20} /> : <Mic size={20} />}
            </button>
            
            {shouldShowSendButton && (
              <button 
                type="submit" 
                disabled={!message.trim() && attachments.length === 0 || !isConnected || isLoading} 
                aria-label="Send message" 
                className="text-gray-400 hover:text-white p-2 rounded-full transition-opacity duration-300 animate-fade-in"
              >
                <Send size={20} />
              </button>
            )}
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
