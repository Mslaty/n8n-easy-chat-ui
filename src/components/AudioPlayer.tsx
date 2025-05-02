
import React, { useState } from 'react';
import { Play, Pause, Download } from 'lucide-react';
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
    if (!audioElements[attachmentId] && attachment.data) {
      const url = URL.createObjectURL(attachment.data);
      const audio = new Audio(url);
      audio.addEventListener('ended', () => {
        setPlayingAudio(null);
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
        audio.play();
        setPlayingAudio(attachmentId);
      }
    }
  };
  return <div className="flex items-center p-2 bg-opacity-30 bg-transparent px-[8px] mx-0">
      <button onClick={toggleAudioPlayback} className="p-2 rounded-full mr-3 text-white bg-white/[0.17]">
        {playingAudio === attachmentId ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">Voice message</div>
      </div>
      <button onClick={() => onDownloadAttachment(attachment)} className="p-1 text-gray-400 hover:text-white mx-[10px] px-[4px] my-0">
        <Download size={16} />
      </button>
    </div>;
};
export default AudioPlayer;
