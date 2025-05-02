
import React from 'react';
import { Attachment } from '../types';
import { isImageFile, isAudioFile } from '../utils';
import ImageAttachment from './ImageAttachment';
import AudioPlayer from './AudioPlayer';
import FileAttachment from './FileAttachment';

interface AttachmentsListProps {
  attachments: Attachment[];
  onDownloadAttachment: (attachment: Attachment) => void;
  audioElements: {
    [key: string]: HTMLAudioElement;
  };
  playingAudio: string | null;
  setPlayingAudio: (id: string | null) => void;
  setAudioElements: React.Dispatch<
    React.SetStateAction<{
      [key: string]: HTMLAudioElement;
    }>
  >;
}

const AttachmentsList: React.FC<AttachmentsListProps> = ({
  attachments,
  onDownloadAttachment,
  audioElements,
  playingAudio,
  setPlayingAudio,
  setAudioElements
}) => {
  return (
    <div className="space-y-2 mt-2">
      {attachments.map(attachment => (
        <div key={attachment.id || attachment.name} className="rounded-md overflow-hidden">
          {(attachment.previewUrl || (attachment.type?.startsWith('image/'))) ? (
            <ImageAttachment 
              attachment={attachment} 
              onDownloadAttachment={onDownloadAttachment} 
            />
          ) : isAudioFile(attachment) ? (
            <AudioPlayer 
              attachment={attachment} 
              onDownloadAttachment={onDownloadAttachment}
              audioElements={audioElements}
              playingAudio={playingAudio}
              setPlayingAudio={setPlayingAudio}
              setAudioElements={setAudioElements}
            />
          ) : (
            <FileAttachment 
              attachment={attachment} 
              onDownloadAttachment={onDownloadAttachment} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AttachmentsList;
