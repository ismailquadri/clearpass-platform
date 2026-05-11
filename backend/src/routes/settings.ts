import { Router } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AppError } from '../middleware/errorHandler';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  rcNumber?: string;
  role: 'business' | 'mda' | 'partner';
  avatarUrl?: string;
}

interface NotificationPreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  expiryReminderDays: number[];
}

// Validation schemas
const updateProfileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
});

const updateNotificationsSchema = z.object({
  emailAlerts: z.boolean().optional(),
  smsAlerts: z.boolean().optional(),
  pushAlerts: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  expiryReminderDays: z.array(z.number()).optional(),
});

// GET /api/settings/profile
router.get(
  '/profile',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const user = await db('users')
        .where({ id: req.user.sub })
        .first();

      if (!user) {
        throw new AppError('USER_NOT_FOUND', 'User not found', 404);
      }

      let company = null;
      if (user.company_id) {
        company = await db('companies')
          .where({ id: user.company_id })
          .first();
      }

      const profile: UserProfile = {
        id: user.id,
        fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email,
        phone: user.phone || undefined,
        companyName: company?.name || '',
        rcNumber: company?.rc_number || undefined,
        role: user.role as 'business' | 'mda' | 'partner',
        avatarUrl: undefined, // Would implement avatar upload in production
      };

      const response: SuccessResponse = {
        success: true,
        data: profile,
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

// PATCH /api/settings/profile
router.patch(
  '/profile',
  authMiddleware,
  validate(updateProfileSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const updates: any = {};
      if (req.body.first_name !== undefined) updates.first_name = req.body.first_name;
      if (req.body.last_name !== undefined) updates.last_name = req.body.last_name;
      if (req.body.phone !== undefined) updates.phone = req.body.phone;

      if (Object.keys(updates).length === 0) {
        throw new AppError('NO_UPDATES', 'No fields to update', 400);
      }

      await db('users')
        .where({ id: req.user.sub })
        .update({
          ...updates,
          updated_at: new Date(),
        });

      // Get updated user
      const user = await db('users')
        .where({ id: req.user.sub })
        .first();

      let company = null;
      if (user.company_id) {
        company = await db('companies')
          .where({ id: user.company_id })
          .first();
      }

      const profile: UserProfile = {
        id: user.id,
        fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email,
        phone: user.phone || undefined,
        companyName: company?.name || '',
        rcNumber: company?.rc_number || undefined,
        role: user.role as 'business' | 'mda' | 'partner',
        avatarUrl: undefined,
      };

      const response: SuccessResponse = {
        success: true,
        data: profile,
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

// GET /api/settings/notifications
router.get(
  '/notifications',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      // For MVP, return default preferences
      // In production, this would be stored in a user_preferences table
      const preferences: NotificationPreferences = {
        emailAlerts: true,
        smsAlerts: false,
        pushAlerts: true,
        weeklyDigest: true,
        expiryReminderDays: [30, 14, 7, 1],
      };

      const response: SuccessResponse = {
        success: true,
        data: preferences,
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

// PUT /api/settings/notifications
router.put(
  '/notifications',
  authMiddleware,
  validate(updateNotificationsSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      // For MVP, just return the preferences
      // In production, this would be stored in a user_preferences table
      const preferences: NotificationPreferences = {
        emailAlerts: req.body.emailAlerts ?? true,
        smsAlerts: req.body.smsAlerts ?? false,
        pushAlerts: req.body.pushAlerts ?? true,
        weeklyDigest: req.body.weeklyDigest ?? true,
        expiryReminderDays: req.body.expiryReminderDays ?? [30, 14, 7, 1],
      };

      const response: SuccessResponse = {
        success: true,
        data: preferences,
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