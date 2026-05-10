import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { UseApiResult } from '../../api';
import { EmptyState } from './EmptyState';

interface ApiStateProps<T> {
  query: UseApiResult<T>;
  loading: ReactNode;
  /** Renders the success state when data is defined. */
  children: (data: T) => ReactNode;
  /** Override the default error UI. */
  errorFallback?: (error: { message: string }, retry: () => void) => ReactNode;
}

/**
 * Renders the right state for a `useApi` query: skeleton while loading,
 * error UI with retry on failure, and content on success.
 *
 * Usage:
 *   <ApiState query={useCertificates()} loading={<CertificateGridSkeleton />}>
 *     {(certificates) => <CertificatesGrid items={certificates} />}
 *   </ApiState>
 */
export function ApiState<T>({
  query,
  loading,
  children,
  errorFallback,
}: ApiStateProps<T>) {
  if (query.isLoading && query.data === undefined) {
    return <>{loading}</>;
  }
  if (query.isError && query.data === undefined) {
    if (errorFallback && query.error) {
      return <>{errorFallback({ message: query.error.message }, query.refetch)}</>;
    }
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't load this data"
        description={
          query.error?.message ??
          'Something went wrong while reaching the server.'
        }
        action={{ label: 'Try again', onClick: query.refetch }}
      />
    );
  }
  if (query.data === undefined) return null;
  return <>{children(query.data)}</>;
}
