
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add Markdown-specific utility functions if needed
export const isMarkdownText = (text: string): boolean => {
  // Check for common markdown patterns
  const markdownPatterns = [
    /^#+\s/, // Headers
    /\*\*.+\*\*/, // Bold
    /_.+_/, // Italic
    /~~.+~~/, // Strikethrough
    /^\s*[-*+]\s/, // Unordered lists
    /^\s*\d+\.\s/, // Ordered lists
    /^\s*>\s/, // Blockquotes
    /`[^`]+`/, // Inline code
    /```[\s\S]+```/, // Code blocks
    /\[.+\]\(.+\)/, // Links
    /!\[.+\]\(.+\)/ // Images
  ];

  return markdownPatterns.some(pattern => pattern.test(text));
}
