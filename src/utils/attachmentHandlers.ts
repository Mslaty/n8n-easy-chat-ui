
import { Attachment } from '../types';
import { createObjectURL, revokeObjectURL } from './index';

export const downloadAttachment = (attachment: Attachment): void => {
  if (attachment.url) {
    // For base64 data URLs
    if (attachment.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } 
    // For blob URLs
    else {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      link.click();
    }
  } else if (attachment.previewUrl) {
    const link = document.createElement('a');
    link.href = attachment.previewUrl;
    link.download = attachment.name;
    link.click();
  } else if (attachment.data) {
    const url = createObjectURL(attachment.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name;
    link.click();
    
    // Clean up the URL
    setTimeout(() => revokeObjectURL(url), 100);
  }
};
