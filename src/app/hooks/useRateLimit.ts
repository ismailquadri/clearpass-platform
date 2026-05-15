import { useState, useCallback } from 'react';
import {
  rateLimiter,
  type RateLimitConfig,
  type RateLimitResult,
  RATE_LIMITS,
  RateLimitError,
} from '../utils/rateLimiter';

export interface UseRateLimitReturn {
  checkRateLimit: (key?: string) => RateLimitResult;
  isRateLimited: boolean;
  rateLimitInfo: RateLimitResult['limitInfo'] | null;
  resetRateLimit: (key: string) => void;
  executeWithRateLimit: <T>(
    fn: () => Promise<T>,
    key?: string,
    config?: RateLimitConfig
  ) => Promise<T>;
}

/**
 * React hook for rate limiting
 */
export function useRateLimit(config?: RateLimitConfig): UseRateLimitReturn {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitResult['limitInfo'] | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = useCallback(
    (key: string = 'default'): RateLimitResult => {
      const effectiveConfig = config || RATE_LIMITS.general;
      const result = rateLimiter.check(key, effectiveConfig);

      setRateLimitInfo(result.limitInfo);
      setIsRateLimited(!result.allowed);

      return result;
    },
    [config]
  );

  const resetRateLimit = useCallback((key: string) => {
    rateLimiter.reset(key);
    setRateLimitInfo(null);
    setIsRateLimited(false);
  }, []);

  const executeWithRateLimit = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      key: string = 'default',
      rateLimitConfig?: RateLimitConfig
    ): Promise<T> => {
      const effectiveConfig: RateLimitConfig = rateLimitConfig || config || RATE_LIMITS.general;
      const result = rateLimiter.check(key, effectiveConfig);

      setRateLimitInfo(result.limitInfo);
      setIsRateLimited(!result.allowed);

      if (!result.allowed) {
        throw new RateLimitError(
          result.error!.message,
          result.error!.code,
          result.error!.retryAfter
        );
      }

      try {
        return await fn();
      } catch (error) {
        if (effectiveConfig.skipFailedRequests) {
          // The rate limiter will handle this internally
        }
        throw error;
      }
    },
    [config]
  );

  return {
    checkRateLimit,
    isRateLimited,
    rateLimitInfo,
    resetRateLimit,
    executeWithRateLimit,
  };
}

/**
 * Hook for certificate-specific rate limiting
 */
export function useCertificateRateLimit() {
  return useRateLimit(RATE_LIMITS.certificates);
}

/**
 * Hook for MDA verification rate limiting
 */
export function useMDAVerificationRateLimit() {
  return useRateLimit(RATE_LIMITS.mdaVerification);
}

/**
 * Hook for export rate limiting
 */
export function useExportRateLimit() {
  return useRateLimit(RATE_LIMITS.exports);
}

/**
 * Hook for search rate limiting
 */
export function useSearchRateLimit() {
  return useRateLimit(RATE_LIMITS.search);
}
