import rateLimit from 'express-rate-limit';
import { RATE_LIMITS } from '../config/constants';

export const loginRateLimiter = rateLimit({
  windowMs: RATE_LIMITS.loginWindowMs,
  max: RATE_LIMITS.loginMax,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimiter = rateLimit({
  windowMs: RATE_LIMITS.apiWindowMs,
  max: RATE_LIMITS.apiMax,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please slow down',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadRateLimiter = rateLimit({
  windowMs: RATE_LIMITS.uploadWindowMs,
  max: RATE_LIMITS.uploadMax,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many upload attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
