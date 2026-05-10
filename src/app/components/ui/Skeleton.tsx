import type { CSSProperties } from 'react';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
  /** Accessible label for screen readers. */
  label?: string;
}

/**
 * Base skeleton: a muted, animated placeholder. Compose larger skeletons
 * (CardSkeleton, TableSkeleton, ChartSkeleton) from this primitive.
 */
export function Skeleton({ className = '', style, label }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-muted rounded-md ${className}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
      role={label ? 'status' : undefined}
      aria-label={label}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function StatCardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <Skeleton className="h-3 w-20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CertificateGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-lg p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="pt-2 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="w-full" style={{ height }} />
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
  );
}
