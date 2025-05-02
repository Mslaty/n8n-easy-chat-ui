
import { useState, useRef, useEffect, RefObject } from 'react';
import { Attachment } from '../types';
import { generateId, createObjectURL, startRecording, stopRecording, isImageFile } from '../utils';

export const useMessageInput = (
  onSendMessage: (message: string, attachments: Attachment[]) => void,
  onAddAttachment: (file: File) => Attachment,
  textareaRef: RefObject<HTMLTextAreaElement>
) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  const recordingTimerRef = useRef<number | null>(null);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
    };
  }, []);
  
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newAttachments = files.map(file => onAddAttachment(file));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      const audioFile = await stopRecording();
      if (audioFile) {
        const attachment = onAddAttachment(audioFile);
        onSendMessage('', [attachment]);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handleSendClick = () => {
    if (!message.trim() && attachments.length === 0) return;
    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
  };

  const hasContent = message.trim().length > 0;

  return {
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
  };
};
