import { Router } from 'express';
import { z } from 'zod';
import { passwordResetService } from '../services/passwordReset';
import { validate } from '../middleware/validation';
import type { SuccessResponse } from '../types';

const router = Router();

// Validation schemas
const requestResetSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().uuid('Invalid token format'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// POST /api/password-reset/request
router.post('/request', validate(requestResetSchema), async (req, res, next) => {
  try {
    await passwordResetService.requestReset(req.body);

    const response: SuccessResponse = {
      success: true,
      data: {
        message: 'If an account exists with this email, a password reset link has been sent.',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/password-reset/reset
router.post('/reset', validate(resetPasswordSchema), async (req, res, next) => {
  try {
    await passwordResetService.resetPassword(req.body);

    const response: SuccessResponse = {
      success: true,
      data: {
        message: 'Password has been reset successfully',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/password-reset/validate/:token
router.get('/validate/:token', async (req, res, next) => {
  try {
    const result = await passwordResetService.validateToken(req.params.token);

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

export default router;
