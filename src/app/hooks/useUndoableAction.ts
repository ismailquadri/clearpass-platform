import { useState, useCallback, useRef } from 'react';

interface UndoableAction<T> {
  action: () => Promise<void>;
  undo: () => Promise<void>;
  description: string;
  data?: T;
}

interface UndoableToast {
  id: string;
  message: string;
  onUndo: () => void;
  timestamp: number;
}

interface UseUndoableActionsReturn {
  executeAction: <T>(action: UndoableAction<T>) => Promise<void>;
  undoToast: UndoableToast | null;
  clearUndoToast: () => void;
  isExecuting: boolean;
}

export function useUndoableActions(undoTimeout: number = 5000): UseUndoableActionsReturn {
  const [isExecuting, setIsExecuting] = useState(false);
  const [undoToast, setUndoToast] = useState<UndoableToast | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const executeAction = useCallback(async <T>(action: UndoableAction<T>) => {
    setIsExecuting(true);
    try {
      await action.action();
      
      // Show undo toast
      const toastId = Date.now().toString();
      setUndoToast({
        id: toastId,
        message: action.description,
        onUndo: async () => {
          try {
            await action.undo();
            setUndoToast(null);
          } catch (error) {
            console.error('Undo failed:', error);
          }
        },
        timestamp: Date.now(),
      });

      // Auto-clear toast after timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setUndoToast(null);
      }, undoTimeout);
    } catch (error) {
      console.error('Action failed:', error);
      throw error;
    } finally {
      setIsExecuting(false);
    }
  }, [undoTimeout]);

  const clearUndoToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setUndoToast(null);
  }, []);

  return {
    executeAction,
    undoToast,
    clearUndoToast,
    isExecuting,
  };
}