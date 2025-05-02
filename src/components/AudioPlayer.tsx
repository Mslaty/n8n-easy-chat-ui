
import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
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
    <div className="flex items-center bg-opacity-30 bg-transparent px-3 py-3">
      <button 
        onClick={toggleAudioPlayback} 
        className="p-2.5 rounded-full mr-4 text-white bg-white/[0.17] flex-shrink-0"
      >
        {playingAudio === attachmentId ? <Pause size={16} /> : <Play size={16} />}
      </button>
      
      <div className="flex-1 min-w-0 flex items-center">
        <div className="text-sm truncate">Voice message</div>
      </div>
    </div>
  );
};

export default AudioPlayer;
