
import React from 'react';
import { Download } from 'lucide-react';
import { Attachment } from '../types';

interface ImageAttachmentProps {
  attachment: Attachment;
  onDownloadAttachment: (attachment: Attachment) => void;
}

const ImageAttachment: React.FC<ImageAttachmentProps> = ({
  attachment,
  onDownloadAttachment
}) => {
  // Use either the previewUrl or the url property
  const imageUrl = attachment.previewUrl || attachment.url;
  
  return (
    <div className="relative group">
      <img 
        src={imageUrl} 
        alt={attachment.name || 'Image attachment'} 
        className="rounded max-h-60 w-auto object-contain" 
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button 
          onClick={() => onDownloadAttachment(attachment)} 
          className="p-2 rounded-full bg-gray-800 bg-opacity-70 text-white hover:bg-opacity-100"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export default ImageAttachment;
