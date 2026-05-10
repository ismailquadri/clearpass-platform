import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface ErrorRecoveryProps {
  error: Error;
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  isRetrying?: boolean;
  context?: string;
}

export function ErrorRecovery({
  error,
  onRetry,
  onGoHome,
  onGoBack,
  isRetrying = false,
  context,
}: ErrorRecoveryProps) {
  const getErrorMessage = (error: Error) => {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    return error.message || 'Something went wrong. Please try again.';
  };

  const getErrorTitle = (error: Error) => {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Connection Error';
    }
    if (error.message.includes('timeout')) {
      return 'Timeout Error';
    }
    return 'An Error Occurred';
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">{getErrorTitle(error)}</h2>
        
        {context && (
          <p className="text-sm text-muted-foreground mb-2">{context}</p>
        )}
        
        <p className="text-muted-foreground mb-6">{getErrorMessage(error)}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF3000] text-white rounded-md hover:bg-[#e52d00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </>
              )}
            </button>
          )}
          
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors min-h-[44px]"
              style={{ fontSize: '14px' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          )}
          
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors min-h-[44px]"
              style={{ fontSize: '14px' }}
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              Technical Details
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-32">
              {error.stack || error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}