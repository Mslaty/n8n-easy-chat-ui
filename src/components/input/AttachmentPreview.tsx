
import React from 'react';
import { FileIcon } from 'lucide-react';
import { Attachment } from '../../types';

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachments, onRemove }) => {
  if (attachments.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-3 mx-[50px]">
      {attachments.map(attachment => (
        <div key={attachment.id} className="relative group">
          <div className="flex items-center bg-gray-800 rounded p-1.5 pr-8">
            {attachment.previewUrl ? (
              <img src={attachment.previewUrl} alt={attachment.name} className="w-8 h-8 object-cover rounded mr-2" />
            ) : (
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center mr-2">
                <FileIcon size={16} className="text-gray-400" />
              </div>
            )}
            <span className="text-sm text-gray-300 truncate max-w-[150px]">
              {attachment.name}
            </span>
            <button onClick={() => onRemove(attachment.id)} className="absolute right-1 top-1 text-gray-400 hover:text-white p-1">
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttachmentPreview;
