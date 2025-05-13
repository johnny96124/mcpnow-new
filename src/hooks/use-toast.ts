
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  variant?: 'default' | 'destructive';
};

export const toast = ({ title, description, type, duration, variant }: ToastProps) => {
  const options = {
    duration: duration,
    className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
  };

  // Map the type to the appropriate sonner toast function
  switch (type) {
    case 'success':
      return sonnerToast.success(title, {
        description,
        ...options,
      });
    case 'error':
      return sonnerToast.error(title, {
        description,
        ...options,
      });
    case 'warning':
      return sonnerToast.warning(title, {
        description,
        ...options,
      });
    case 'info':
      return sonnerToast.info(title, {
        description,
        ...options,
      });
    default:
      return sonnerToast(title || '', {
        description,
        ...options,
      });
  }
};

export const useToast = () => {
  return { toast };
};

export type { ToastProps };
