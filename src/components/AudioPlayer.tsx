
import React, { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { Attachment } from '../types';

interface AudioPlayerProps {
  attachment: Attachment;
  onDownloadAttachment: (attachment: Attachment) => void;
  audioElements: {
    [key: string]: HTMLAudioElement;
  };
  playingAudio: string | null;
  setPlayingAudio: (id: string | null) => void;
  setAudioElements: React.Dispatch<React.SetStateAction<{
    [key: string]: HTMLAudioElement;
  }>>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  attachment,
  onDownloadAttachment,
  audioElements,
  playingAudio,
  setPlayingAudio,
  setAudioElements
}) => {
  const attachmentId = attachment.id || '';
  const isPlaying = playingAudio === attachmentId;
  
  const toggleAudioPlayback = () => {
    // If no audio element exists for this attachment, create one
    if (!audioElements[attachmentId]) {
      // Use the persisted URL if available, otherwise create a new object URL
      const url = attachment.url || (attachment.data ? URL.createObjectURL(attachment.data) : '');
      
      if (!url) {
        console.error('No audio URL available for playback');
        return;
      }
      
      const audio = new Audio(url);
      audio.addEventListener('ended', () => {
        setPlayingAudio(null);
        // Reset audio position to beginning when it ends
        audio.currentTime = 0;
      });
      setAudioElements(prev => ({
        ...prev,
        [attachmentId]: audio
      }));
      audio.play();
      setPlayingAudio(attachmentId);
      return;
    }

    // If an audio element exists, toggle play/pause
    const audio = audioElements[attachmentId];
    if (audio) {
      if (playingAudio === attachmentId) {
        audio.pause();
        // Reset audio to beginning when stopped
        audio.currentTime = 0;
        setPlayingAudio(null);
      } else {
        // Pause any currently playing audio
        if (playingAudio && audioElements[playingAudio]) {
          audioElements[playingAudio].pause();
        }
        
        // Reset audio to beginning if it has ended
        if (audio.ended || audio.currentTime === audio.duration) {
          audio.currentTime = 0;
        }
        
        audio.play();
        setPlayingAudio(attachmentId);
      }
    }
  };
  
  return (
    <div className="flex items-center justify-center bg-opacity-30 bg-transparent py-2 px-2 max-w-xs">
      <button 
        onClick={toggleAudioPlayback} 
        className={`p-2 rounded-full mr-3 ${
          isPlaying 
            ? 'text-white bg-chat-accent animate-pulse' 
            : 'text-white bg-white/[0.17]'
        } flex-shrink-0`}
        aria-label={isPlaying ? 'Stop voice message' : 'Play voice message'}
      >
        {isPlaying ? <Square size={14} /> : <Play size={14} />}
      </button>
      
      <div className={`text-sm ${isPlaying ? 'text-chat-accent' : ''}`}>Voice message</div>
    </div>
  );
};

export default AudioPlayer;
