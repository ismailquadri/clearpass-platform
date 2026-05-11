import { Router } from 'express';
import { z } from 'zod';
import { mfaService } from '../services/mfa';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AppError } from '../middleware/errorHandler';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();

// Validation schemas
const enableMfaSchema = z.object({
  token: z.string().length(6),
  backupCodes: z.array(z.string().length(8)).min(10).max(10),
});

const disableMfaSchema = z.object({
  password: z.string().min(8),
});

const verifyMfaSchema = z.object({
  token: z.string().length(6),
});

// POST /api/mfa/setup
router.post(
  '/setup',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const result = await mfaService.setupMFA(req.user.sub);

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
  }
);

// POST /api/mfa/enable
router.post(
  '/enable',
  authMiddleware,
  validate(enableMfaSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      await mfaService.enableMFA(req.user.sub, req.body.token, req.body.backupCodes);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/mfa/disable
router.post(
  '/disable',
  authMiddleware,
  validate(disableMfaSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      await mfaService.disableMFA(req.user.sub, req.body.password);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/mfa/verify
router.post(
  '/verify',
  authMiddleware,
  validate(verifyMfaSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const isValid = await mfaService.verifyToken(req.user.sub, req.body.token);

      const response: SuccessResponse = {
        success: true,
        data: { valid: isValid },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;