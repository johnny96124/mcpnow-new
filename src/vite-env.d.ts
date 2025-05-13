
/// <reference types="vite/client" />

// Toast type declarations
interface ToastProps {
  title?: string;
  description?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  variant?: 'default' | 'destructive';
  id?: string | number;
  open?: boolean;
  action?: React.ReactNode;
}

type Toast = ToastProps & {
  id: string | number;
  open: boolean;
}
