
import { useState, useEffect } from 'react';

export const useAudioElements = () => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});

  // Reset function to clear all audio states
  const resetAudioStates = () => {
    setPlayingAudio(null);
  };

  // Cleanup audio elements on component unmount
  useEffect(() => {
    return () => {
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        if (audio.src.startsWith('blob:')) {
          URL.revokeObjectURL(audio.src);
        }
      });
    };
  }, [audioElements]);

  return {
    playingAudio,
    setPlayingAudio,
    audioElements,
    setAudioElements,
    resetAudioStates
  };
};
