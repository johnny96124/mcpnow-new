
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  variant?: 'default' | 'destructive';
  id?: string | number;
  open?: boolean;
  action?: React.ReactNode;
};

type Toast = ToastProps & {
  id: string | number;
  open: boolean;
};

export const toast = ({ title, description, type, duration = 4000, variant }: ToastProps) => {
  const id = Math.random().toString(36).substring(2, 9);
  
  // Map the type to the appropriate sonner toast function
  switch (type) {
    case 'success':
      return sonnerToast.success(title, {
        description,
        id,
        duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
    case 'error':
      return sonnerToast.error(title, {
        description,
        id,
        duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
    case 'warning':
      return sonnerToast.warning(title, {
        description,
        id,
        duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
    case 'info':
      return sonnerToast.info(title, {
        description,
        id,
        duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
    default:
      return sonnerToast(title || '', {
        description,
        id,
        duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
  }
};

export const useToast = () => {
  return {
    toast,
    toasts: [],
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    }
  };
};

export type { Toast };
