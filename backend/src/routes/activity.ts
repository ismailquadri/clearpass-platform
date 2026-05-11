import { Router } from 'express';
import { ActivityService } from '../services/activity';
import { authMiddleware } from '../middleware/auth';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();
const activityService = new ActivityService();

// GET /api/activity
router.get(
  '/',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.company_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_COMPANY',
            message: 'User is not associated with a company',
          },
        });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activity = await activityService.getActivityLog(req.user.company_id, limit);

      const response: SuccessResponse = {
        success: true,
        data: activity,
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