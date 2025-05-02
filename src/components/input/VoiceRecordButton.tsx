
import React from 'react';
import { Mic, Square, X } from 'lucide-react';

interface VoiceRecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
  onCancel?: () => void;
  disabled: boolean;
  recordingDuration: number;
}

const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({
  isRecording,
  onClick,
  onCancel,
  disabled,
  recordingDuration
}) => {
  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex items-center">
      {isRecording && (
        <div className="flex items-center mr-2 text-red-500">
          <span className="text-sm animate-timer-pulse">{formatRecordingTime(recordingDuration)}</span>
        </div>
      )}
      <button 
        type="button" 
        onClick={onClick} 
        className={`p-2 rounded-full ${isRecording ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'} disabled:opacity-50 flex items-center justify-center`} 
        disabled={disabled} 
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? <Square size={20} /> : <Mic size={20} />}
      </button>
      {isRecording && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="ml-1 p-2 rounded-full text-gray-400 hover:text-white flex items-center justify-center"
          aria-label="Cancel recording"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default VoiceRecordButton;
