import { useState, useCallback } from 'react';

interface OptimisticMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables) => void;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
}

interface OptimisticMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  isPending: boolean;
  error: Error | null;
  reset: () => void;
}

export function useOptimisticMutation<TData = unknown, TVariables = void>(
  options: OptimisticMutationOptions<TData, TVariables>
): OptimisticMutationResult<TData, TVariables> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      setIsPending(true);
      setError(null);

      try {
        // Call onMutate callback for optimistic UI update
        if (options.onMutate) {
          options.onMutate(variables);
        }

        // Execute the actual mutation
        const data = await options.mutationFn(variables);

        // Success callback
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }

        // Settled callback
        if (options.onSettled) {
          options.onSettled(data, null, variables);
        }

        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Mutation failed');
        setError(error);

        // Error callback
        if (options.onError) {
          options.onError(error, variables);
        }

        // Settled callback with error
        if (options.onSettled) {
          options.onSettled(undefined, error, variables);
        }

        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsPending(false);
  }, []);

  return {
    mutate,
    isPending,
    error,
    reset,
  };
}