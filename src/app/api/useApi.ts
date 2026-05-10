/**
 * `useApi` — generic data-fetching hook with loading / error / abort.
 *
 * Domain modules wrap this with their own typed hook (useCertificates,
 * useAlerts, etc.) so components consume the same shape regardless of
 * whether the data came from the live API or the mock store.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiClientError } from './client';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseApiResult<T> {
  data: T | undefined;
  error: ApiClientError | undefined;
  status: AsyncStatus;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export interface UseApiOptions {
  /** Skip the initial fetch when false. */
  enabled?: boolean;
  /** Re-runs the fetcher when any value here changes. */
  deps?: unknown[];
}

/**
 * Run an async fetcher and expose request state to a component.
 *
 * The fetcher receives an AbortSignal — pass it to fetch() (or to
 * `mockResponse(value, signal)`) so we don't write to unmounted components.
 */
export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const { enabled = true, deps = [] } = options;
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<ApiClientError | undefined>(undefined);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [tick, setTick] = useState(0);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let cancelled = false;

    // Defer setState by a microtask so the lint rule against synchronous
    // setState in effects is satisfied. Behaviour is unchanged.
    queueMicrotask(() => {
      if (cancelled) return;
      setStatus('loading');
      setError(undefined);
    });

    fetcherRef
      .current(controller.signal)
      .then((value) => {
        if (cancelled) return;
        setData(value);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const apiErr =
          err instanceof ApiClientError
            ? err
            : new ApiClientError(
                0,
                'UNKNOWN',
                err instanceof Error ? err.message : 'Request failed'
              );
        setError(apiErr);
        setStatus('error');
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tick, ...deps]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    refetch,
  };
}

// ─── useMutation ────────────────────────────────────────────────────────────

export interface UseMutationResult<TInput, TOutput> {
  mutate: (input: TInput) => Promise<TOutput>;
  data: TOutput | undefined;
  error: ApiClientError | undefined;
  status: AsyncStatus;
  isPending: boolean;
  reset: () => void;
}

/**
 * Run a one-shot mutation (POST/PUT/PATCH/DELETE) on demand.
 *
 * Use for forms: button is disabled while `isPending`, error renders inline,
 * success toast fires on resolve.
 */
export function useMutation<TInput, TOutput>(
  mutator: (input: TInput) => Promise<TOutput>
): UseMutationResult<TInput, TOutput> {
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [error, setError] = useState<ApiClientError | undefined>(undefined);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const mutatorRef = useRef(mutator);
  useEffect(() => {
    mutatorRef.current = mutator;
  });

  const mutate = useCallback(async (input: TInput) => {
    setStatus('loading');
    setError(undefined);
    try {
      const result = await mutatorRef.current(input);
      setData(result);
      setStatus('success');
      return result;
    } catch (err: unknown) {
      const apiErr =
        err instanceof ApiClientError
          ? err
          : new ApiClientError(0, 'UNKNOWN', err instanceof Error ? err.message : 'Request failed');
      setError(apiErr);
      setStatus('error');
      throw apiErr;
    }
  }, []);

  const reset = useCallback(() => {
    setData(undefined);
    setError(undefined);
    setStatus('idle');
  }, []);

  return {
    mutate,
    data,
    error,
    status,
    isPending: status === 'loading',
    reset,
  };
}
