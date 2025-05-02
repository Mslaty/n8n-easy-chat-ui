
import React from 'react';
import { 
  FileAudio, 
  FileImage, 
  FileVideo, 
  FileText, 
  FileArchive, 
  FileCode,
  File,
  Download
} from 'lucide-react';
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
  const isVoiceMessage = isAudioFile(attachment);
  
  // Select the appropriate icon based on file type
  const getFileIcon = () => {
    const type = attachment.type.toLowerCase();
    
    if (type.includes('audio')) {
      return <FileAudio size={18} className="text-gray-400 mr-4 flex-shrink-0" />;
    } else if (type.includes('image')) {
      return <FileImage size={18} className="text-gray-400 mr-4 flex-shrink-0" />;
    } else if (type.includes('video')) {
      return <FileVideo size={18} className="text-gray-400 mr-4 flex-shrink-0" />;
    } else if (type.includes('pdf')) {
      return <File size={18} className="text-gray-400 mr-4 flex-shrink-0" />;
    } else if (type.includes('zip') || type.includes('rar') || type.includes('tar') || type.includes('7z')) {
      return <FileArchive size={18} className="text-gray-400 mr-4 flex-shrink-0" />;
    } else if (type.includes('html') || type.includes('css') || type.includes('javascript') || type.includes('json') || type.includes('xml')) {
      return <FileCode size={18} className="text-gray-400 mr-4 flex-shrink-0" />;
    } else {
      return <FileText size={18} className="text-gray-400 mr-4 flex-shrink-0" />;
    }
  };
  
  return (
    <div className="flex items-center px-3 py-3 bg-opacity-30 bg-transparent">
      {getFileIcon()}
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
