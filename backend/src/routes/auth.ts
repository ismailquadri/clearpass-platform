import { Router } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AppError } from '../middleware/errorHandler';
import { sessionService } from '../services/session';
import { tokenBlacklistService } from '../services/tokenBlacklist';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();
const authService = new AuthService();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  role: z.enum(['contractor', 'mda', 'consultant', 'hmo', 'admin']),
  company_name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    const response: SuccessResponse = {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    const response: SuccessResponse = {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const user = await authService.me(req.user.sub);
    const response: SuccessResponse = {
      success: true,
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('MISSING_REFRESH_TOKEN', 'Refresh token is required', 400);
    }

    const result = await authService.refreshTokens(refreshToken);
    const response: SuccessResponse = {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.sub) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const token = req.headers.authorization?.substring(7);
    if (token) {
      // Blacklist the token
      tokenBlacklistService.addToken(token);
      // Delete the session
      await sessionService.deleteSession(token);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout-all
router.post('/logout-all', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.sub) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    // Delete all user sessions
    await sessionService.deleteAllUserSessions(req.user.sub);
    // Blacklist all user tokens
    tokenBlacklistService.blacklistUserTokens(req.user.sub);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/sessions
router.get('/sessions', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.sub) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const sessions = await sessionService.getUserSessions(req.user.sub);

    const response: SuccessResponse = {
      success: true,
      data: sessions.map((s) => ({
        id: s.id,
        userAgent: s.userAgent,
        ipAddress: s.ipAddress,
        createdAt: s.createdAt,
        lastActivity: s.lastActivity,
        expiresAt: s.expiresAt,
      })),
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
