import { useState, useCallback } from 'react';

interface OptimisticUpdateOptions<T> {
  onMutate: (data: T) => Promise<void>;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export function useOptimisticUpdate<T>(options: OptimisticUpdateOptions<T>) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (data: T) => {
      setIsUpdating(true);
      setError(null);

      try {
        await options.onMutate(data);
        options.onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Update failed');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [options]
  );

  return {
    execute,
    isUpdating,
    error,
    resetError: () => setError(null),
  };
}