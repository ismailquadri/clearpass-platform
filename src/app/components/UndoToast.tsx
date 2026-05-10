import { X, Undo2 } from 'lucide-react';
import { useEffect } from 'react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  remainingTime?: number;
}

export function UndoToast({ message, onUndo, onDismiss, remainingTime = 5 }: UndoToastProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-card border border-border rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md animate-in slide-in-from-bottom-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p style={{ fontSize: '14px', fontWeight: 500 }} className="mb-1">
            {message}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onUndo}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FF3000] text-white rounded-md hover:bg-[#e52d00] transition-colors text-sm font-medium"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>
            <span className="text-xs text-muted-foreground">
              Auto-dismiss in {remainingTime}s
            </span>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}