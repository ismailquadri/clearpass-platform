import { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, title: string, message?: string) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast: Toast = { id, type, title, message };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          bgColor: '#c5f4dc',
          iconColor: '#1fc16b',
          textColor: '#171717',
          closeOpacity: 0.4,
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: '#ffc0c5',
          iconColor: '#fb3748',
          textColor: '#171717',
          closeOpacity: 0.4,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: '#ffd9c0',
          iconColor: '#fa7319',
          textColor: '#171717',
          closeOpacity: 0.4,
        };
      case 'info':
        return {
          icon: Info,
          bgColor: '#c4edff',
          iconColor: '#47c2ff',
          textColor: '#171717',
          closeOpacity: 0.4,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[390px]"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className="flex items-center gap-2 p-2 rounded-lg shadow-lg animate-in slide-in-from-bottom-5 duration-300"
              style={{ backgroundColor: config.bgColor }}
            >
              <div className="shrink-0 size-4">
                <Icon className="w-4 h-4" style={{ color: config.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="leading-tight text-sm"
                  style={{ color: config.textColor }}
                >
                  {toast.title}
                </p>
                {toast.message && (
                  <p
                    className="leading-tight mt-0.5 text-xs opacity-70"
                    style={{ color: config.textColor }}
                  >
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                className="shrink-0 size-6 flex items-center justify-center transition-opacity hover:opacity-100 min-w-[44px] min-h-[44px]"
                style={{ opacity: config.closeOpacity }}
              >
                <X className="w-4 h-4" style={{ color: config.textColor }} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
