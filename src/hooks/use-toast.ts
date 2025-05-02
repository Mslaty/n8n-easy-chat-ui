
import { toast as sonnerToast } from "sonner";

// Re-export toast function
export const toast = sonnerToast;

// Types
export type ToastProps = React.ComponentProps<typeof sonnerToast.custom>;

export interface ToastActionElement {
  altText?: string;
  action: React.ReactNode;
}

export const useToast = () => {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
    error: sonnerToast.error,
    success: sonnerToast.success,
    warning: sonnerToast.warning,
    info: sonnerToast.info,
    promise: sonnerToast.promise,
    custom: sonnerToast.custom,
  };
};
