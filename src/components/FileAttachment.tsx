
import React from 'react';
import { Music, Download } from 'lucide-react';
import { Attachment } from '../types';
import { formatFileSize, isAudioFile } from '../utils';

interface FileAttachmentProps {
  attachment: Attachment;
  onDownloadAttachment: (attachment: Attachment) => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  attachment,
  onDownloadAttachment
}) => {
  // Check if it's an audio file to display "Voice message" instead of filename
  const isVoiceMessage = attachment.data && isAudioFile(attachment.data);
  
  return (
    <div className="flex items-center px-3 py-2 bg-opacity-30 bg-transparent">
      <Music size={18} className="text-gray-400 mr-4 flex-shrink-0" />
      <div className="flex-1 min-w-0 flex items-center">
        <div>
          <div className="text-sm truncate">
            {isVoiceMessage ? "Voice message" : attachment.name}
          </div>
          {attachment.size && !isVoiceMessage && (
            <div className="text-xs text-gray-400">
              {formatFileSize(attachment.size)}
            </div>
          )}
        </div>
      </div>
      <button 
        onClick={() => onDownloadAttachment(attachment)} 
        className="p-2 text-gray-400 hover:text-white ml-4 flex-shrink-0"
      >
        <Download size={16} />
      </button>
    </div>
  );
};

export default FileAttachment;
