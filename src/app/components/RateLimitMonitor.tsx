import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from './ToastProvider';
import { rateLimiter, RATE_LIMITS } from '../utils/rateLimiter';
import { auditTrail } from '../utils/auditTrail';

export function RateLimitMonitor() {
  const { showToast } = useToast();
  const [activeLimits, setActiveLimits] = useState<Record<string, { current: number; limit: number }>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshLimits = () => {
    setIsRefreshing(true);
    const limits: Record<string, { current: number; limit: number }> = {};

    Object.entries(RATE_LIMITS).forEach(([key, config]) => {
      const usage = rateLimiter.getUsage(key, config);
      limits[key] = usage;
    });

    setActiveLimits(limits);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    refreshLimits();
    const interval = setInterval(refreshLimits, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all rate limits? This action cannot be undone.')) {
      rateLimiter.resetAll();
      refreshLimits();
      showToast('success', 'Reset Complete', 'All rate limits have been reset');

      // Log the action
      auditTrail.logSecurityEvent(
        'security.suspicious_activity',
        'All rate limits reset by admin',
        {
          id: 'admin',
          name: 'Admin',
          email: 'admin@clearpass',
          role: 'Admin',
        }
      );
    }
  };

  const handleResetKey = (key: string) => {
    rateLimiter.reset(key);
    refreshLimits();
    showToast('success', 'Reset Complete', `Rate limit for ${key} has been reset`);
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatWindowMs = (ms: number) => {
    if (ms >= 60000) return `${ms / 60000}m`;
    if (ms >= 1000) return `${ms / 1000}s`;
    return `${ms}ms`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
          >
            <Activity className="w-5 h-5" style={{ color: '#FF3000' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Rate Limit Monitor</h3>
            <p className="text-sm text-muted-foreground">
              Real-time API rate limiting status
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshLimits}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleResetAll}
            className="px-4 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Reset All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(RATE_LIMITS).map(([key, config]) => {
          const usage = activeLimits[key] || { current: 0, limit: config.maxRequests };
          const percentage = getUsagePercentage(usage.current, usage.limit);
          const isNearLimit = percentage >= 70;
          const isAtLimit = percentage >= 90;

          return (
            <div
              key={key}
              className={`p-4 rounded-lg border ${
                isAtLimit
                  ? 'border-red-300 bg-red-50'
                  : isNearLimit
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-border bg-muted/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '14px', fontWeight: 500 }} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {isAtLimit && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Critical
                    </span>
                  )}
                  {isNearLimit && !isAtLimit && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      Warning
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {formatWindowMs(config.windowMs)} window
                  </span>
                  <button
                    onClick={() => handleResetKey(key)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getUsageColor(
                      percentage
                    )}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium min-w-[80px] text-right">
                  {usage.current}/{usage.limit}
                </span>
                <span className="text-sm text-muted-foreground min-w-[50px] text-right">
                  {percentage}%
                </span>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                Max {config.maxRequests} requests per {formatWindowMs(config.windowMs)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}