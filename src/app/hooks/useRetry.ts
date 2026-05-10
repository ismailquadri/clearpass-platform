import { useState, useCallback } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number) => void;
}

interface RetryResult {
  retry: () => Promise<void>;
  attempt: number;
  isRetrying: boolean;
  error: Error | null;
  reset: () => void;
}

export function useRetry(
  fn: () => Promise<void>,
  options: RetryOptions = {}
): RetryResult {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const retry = useCallback(async () => {
    if (attempt >= maxAttempts) {
      return;
    }

    setIsRetrying(true);
    setError(null);

    const currentAttempt = attempt + 1;
    setAttempt(currentAttempt);

    try {
      await fn();
      setAttempt(0); // Reset on success
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Retry failed');
      setError(error);

      if (currentAttempt < maxAttempts) {
        const backoffDelay = delay * Math.pow(backoffMultiplier, currentAttempt - 1);
        onRetry?.(currentAttempt);
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        // Don't recursively call retry, let user call it again
        setIsRetrying(false);
      } else {
        setIsRetrying(false);
      }
    }
  }, [attempt, maxAttempts, delay, backoffMultiplier, fn, onRetry]);

  const reset = useCallback(() => {
    setAttempt(0);
    setIsRetrying(false);
    setError(null);
  }, []);

  return {
    retry,
    attempt,
    isRetrying,
    error,
    reset,
  };
}