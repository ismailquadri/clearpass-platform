import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function OfflineBanner({ isOnline, onRetry, isRetrying = false }: OfflineBannerProps) {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5" />
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>You're offline</p>
          <p style={{ fontSize: '12px', opacity: 0.9 }}>Some features may not be available</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 px-4 py-2 bg-white text-amber-500 rounded-md font-medium hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontSize: '13px' }}
        >
          {isRetrying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Retry
            </>
          )}
        </button>
      )}
    </div>
  );
}