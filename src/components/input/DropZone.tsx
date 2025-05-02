
import React from 'react';
import { FileUp } from 'lucide-react';

interface DropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  if (!isDragging) return null;
  
  return (
    <div 
      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 border-2 border-dashed border-chat-accent transition-all duration-200"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <FileUp size={48} className="text-chat-accent mb-2 animate-bounce" />
      <p className="text-white text-lg font-medium">Drop files here</p>
      <p className="text-gray-400 text-sm">Files will be attached to your message</p>
    </div>
  );
};

export default DropZone;
