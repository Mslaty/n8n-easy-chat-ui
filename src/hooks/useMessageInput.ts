
import { useState, useRef, useEffect } from 'react';
import { Attachment } from '../types';
import { generateId, createObjectURL, startRecording, stopRecording, isImageFile } from '../utils';

export const useMessageInput = (
  onSendMessage: (message: string, attachments: Attachment[]) => void,
  isConnected: boolean,
  isLoading: boolean
) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

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
      addFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const addFiles = (files: File[]) => {
    const newAttachments: Attachment[] = [];
    files.forEach(file => {
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
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const shouldShowSendButton = message.trim().length > 0 || attachments.length > 0;

  return {
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
    isConnected,
    isLoading
  };
};
