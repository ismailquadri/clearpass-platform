import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

/**
 * Shared empty / not-found / fallback state with optional icon + CTA.
 * Replaces the duplicated "Section Not Found" blocks in App.tsx.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Icon className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <h3 className="mb-2" style={{ fontSize: '18px', fontWeight: 500 }}>
        {title}
      </h3>
      {description && (
        <p
          className="text-muted-foreground max-w-md mx-auto"
          style={{ fontSize: '14px' }}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          style={{ fontSize: '14px' }}
        >
          {action.label}
        </button>
      )}
      {children}
    </div>
  );
}
