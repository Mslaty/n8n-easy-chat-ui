
import { Attachment } from '../types';

// Convert file to base64 string for storage
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Create object URL for a file
export const createObjectURL = (file: File): string => {
  return URL.createObjectURL(file);
};

// Revoke object URL
export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};

// Check if the file is an image
export const isImageFile = (file: File | null | undefined): boolean => {
  if (!file || !file.type) return false;
  return file.type.startsWith('image/');
};

// Check if an attachment is an audio file
export const isAudioFile = (attachment: Attachment): boolean => {
  // Check both type string and data property
  if (attachment.data) {
    return attachment.data.type.startsWith('audio/');
  }
  return attachment.type && attachment.type.toLowerCase().startsWith('audio/');
};
