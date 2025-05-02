
import React from 'react';
import { Mic, StopCircle } from 'lucide-react';

interface VoiceRecordButtonProps {
  isRecording: boolean;
  recordingSeconds: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled: boolean;
  colorTheme?: 'purple' | 'blue' | 'green' | 'orange';
}

const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({
  isRecording,
  recordingSeconds,
  onStartRecording,
  onStopRecording,
  disabled,
  colorTheme = 'purple'
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (isRecording) {
    return (
      <button
        type="button"
        onClick={onStopRecording}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 animate-timer-pulse"
        aria-label="Stop recording"
      >
        <StopCircle size={18} />
        <span className="text-sm font-medium">{formatTime(recordingSeconds)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onStartRecording}
      disabled={disabled}
      className={`p-2 text-gray-400 hover:text-chat-${colorTheme} transition-colors disabled:opacity-50`}
      aria-label="Record voice message"
    >
      <Mic size={20} />
    </button>
  );
};

export default VoiceRecordButton;
