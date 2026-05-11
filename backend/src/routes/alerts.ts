import { Router } from 'express';
import { AlertsService } from '../services/alerts';
import { authMiddleware } from '../middleware/auth';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();
const alertsService = new AlertsService();

// GET /api/alerts
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

      const alerts = await alertsService.getAlerts(req.user.company_id, req.user.sub);
      const response: SuccessResponse = {
        success: true,
        data: alerts,
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

// POST /api/alerts/:id/read
router.post(
  '/:id/read',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }

      await alertsService.markAsRead(req.params.id, req.user.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/alerts/read-all
router.post(
  '/read-all',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.company_id || !req.user?.sub) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }

      await alertsService.markAllAsRead(req.user.company_id, req.user.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/alerts/:id
router.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.sub) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }

      await alertsService.dismissAlert(req.params.id, req.user.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;