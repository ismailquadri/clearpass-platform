/**
 * API Rate Limiting System
 * Provides configurable rate limiting with sliding window algorithm
 */

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
  retryAfter?: number; // Seconds until retry is allowed
}

export interface RateLimitResult {
  allowed: boolean;
  limitInfo: RateLimitInfo;
  error?: {
    message: string;
    code: string;
    retryAfter: number;
  };
}

class RateLimiter {
  private storageKey = 'clearpass_rate_limits';
  private requests: Map<string, number[]> = new Map();

  /**
   * Check if a request is allowed for a given key
   */
  check(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests for this key
    let timestamps = this.requests.get(key) || [];

    // Filter out requests outside the current window
    timestamps = timestamps.filter((timestamp) => timestamp > windowStart);

    // Check if limit exceeded
    const allowed = timestamps.length < config.maxRequests;

    // Add current request timestamp
    if (allowed) {
      timestamps.push(now);
    }

    // Update storage
    this.requests.set(key, timestamps);
    this.persistRequests();

    // Calculate reset time
    const oldestRequest = timestamps[0] || now;
    const resetTime = oldestRequest + config.windowMs;

    const limitInfo: RateLimitInfo = {
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - timestamps.length),
      reset: resetTime,
      retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000),
    };

    if (!allowed) {
      return {
        allowed: false,
        limitInfo,
        error: {
          message: `Rate limit exceeded. Try again in ${limitInfo.retryAfter} seconds.`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: limitInfo.retryAfter!,
        },
      };
    }

    return {
      allowed: true,
      limitInfo,
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.requests.delete(key);
    this.persistRequests();
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.requests.clear();
    this.persistRequests();
  }

  /**
   * Get current usage for a key
   */
  getUsage(key: string, config: RateLimitConfig): { current: number; limit: number } {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const timestamps = this.requests.get(key) || [];
    const current = timestamps.filter((timestamp) => timestamp > windowStart).length;

    return {
      current,
      limit: config.maxRequests,
    };
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, timestamps] of this.requests.entries()) {
      const filtered = timestamps.filter((timestamp) => now - timestamp < maxAge);
      if (filtered.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, filtered);
      }
    }

    this.persistRequests();
  }

  private persistRequests(): void {
    const data = Array.from(this.requests.entries());
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private loadRequests(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.requests = new Map(parsed);
      }
    } catch {
      this.requests = new Map();
    }
  }

  constructor() {
    this.loadRequests();
    // Run cleanup every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Pre-configured rate limit settings for different endpoints
 */
export const RATE_LIMITS = {
  // Authentication endpoints - stricter limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
  },

  // Certificate verification - moderate limits
  certificates: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },

  // MDA verification - higher limits for bulk operations
  mdaVerification: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },

  // General API calls
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },

  // Export operations - stricter limits
  exports: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 exports per minute
  },

  // Search operations
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 searches per minute
  },
} as const;

/**
 * Rate limit decorator for API calls
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  key: string,
  config: RateLimitConfig
): T {
  return (async (...args: Parameters<T>) => {
    const result = rateLimiter.check(key, config);

    if (!result.allowed) {
      throw new RateLimitError(result.error!.message, result.error!.code, result.error!.retryAfter);
    }

    try {
      return await fn(...args);
    } catch (error) {
      // Optionally don't count failed requests
      if (config.skipFailedRequests) {
        const timestamps = rateLimiter['requests'].get(key) || [];
        timestamps.pop(); // Remove the last timestamp
        rateLimiter['requests'].set(key, timestamps);
      }
      throw error;
    }
  }) as T;
}

/**
 * Custom error for rate limiting
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryAfter: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Calculate exponential backoff delay
 */
export function calculateBackoff(attempt: number, baseDelay: number = 1000, maxDelay: number = 30000): number {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add some jitter to prevent thundering herd
  return delay + Math.random() * 1000;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on rate limit errors
      if (error instanceof RateLimitError) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxAttempts - 1) {
        throw error;
      }

      const delay = calculateBackoff(attempt, baseDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Create a rate-limited fetch wrapper
 */
export function createRateLimitedFetch(
  key: string,
  config: RateLimitConfig
): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const result = rateLimiter.check(key, config);

    if (!result.allowed) {
      throw new RateLimitError(result.error!.message, result.error!.code, result.error!.retryAfter);
    }

    try {
      const response = await fetch(input, init);

      // Add rate limit headers to response
      const limitedResponse = new Response(response.body, response);
      limitedResponse.headers.set('X-RateLimit-Limit', result.limitInfo.limit.toString());
      limitedResponse.headers.set('X-RateLimit-Remaining', result.limitInfo.remaining.toString());
      limitedResponse.headers.set('X-RateLimit-Reset', result.limitInfo.reset.toString());

      return limitedResponse;
    } catch (error) {
      if (config.skipFailedRequests) {
        const timestamps = rateLimiter['requests'].get(key) || [];
        timestamps.pop();
        rateLimiter['requests'].set(key, timestamps);
      }
      throw error;
    }
  };
}