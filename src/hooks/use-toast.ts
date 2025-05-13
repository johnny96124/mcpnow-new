
import { useState, useEffect } from "react";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";

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

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000;

const toasts: Toast[] = [];

export const toast = ({ title, description, type, duration, variant }: ToastProps) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = { 
    id, 
    title, 
    description, 
    type, 
    duration, 
    variant, 
    open: true 
  };
  
  toasts.push(newToast);
  
  if (toasts.length > TOAST_LIMIT) {
    toasts.shift();
  }

  // Map the type to the appropriate sonner toast function
  switch (type) {
    case 'success':
      return sonnerToast.success(title, {
        description,
        id,
        duration: duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
    case 'error':
      return sonnerToast.error(title, {
        description,
        id,
        duration: duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
    case 'warning':
      return sonnerToast.warning(title, {
        description,
        id,
        duration: duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
    case 'info':
      return sonnerToast.info(title, {
        description,
        id,
        duration: duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
    default:
      return sonnerToast(title || '', {
        description,
        id,
        duration: duration,
        className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : undefined,
      });
  }
};

export const useToast = () => {
  const [localToasts, setLocalToasts] = useState<Toast[]>(toasts);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalToasts([...toasts]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return {
    toast,
    toasts: localToasts,
    dismiss: (toastId: string | number) => {
      const index = toasts.findIndex(t => t.id === toastId);
      if (index !== -1) {
        toasts[index].open = false;
        setTimeout(() => {
          const index = toasts.findIndex(t => t.id === toastId);
          if (index !== -1) {
            toasts.splice(index, 1);
          }
        }, TOAST_REMOVE_DELAY);
      }
      sonnerToast.dismiss(toastId);
    }
  };
};

export type { Toast };
