import { Router } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { paymentService } from '../services/payment';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AppError } from '../middleware/errorHandler';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();

// Validation schemas
const initializePaymentSchema = z.object({
  tier: z.enum(['starter', 'business', 'enterprise']),
  billing_cycle: z.enum(['monthly', 'annual']),
});

const verifyPaymentSchema = z.object({
  reference: z.string(),
});

// GET /api/subscriptions
router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.company_id) {
      throw new AppError('NO_COMPANY', 'User is not associated with a company', 400);
    }

    const subscription = await paymentService.getSubscription(req.user.company_id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SUBSCRIPTION_NOT_FOUND',
          message: 'No subscription found for this company',
        },
      });
    }

    const response: SuccessResponse = {
      success: true,
      data: subscription,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/subscriptions/initialize
router.post(
  '/initialize',
  authMiddleware,
  validate(initializePaymentSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.company_id || !req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const user = await db('users').where({ id: req.user.sub }).first();

      if (!user) {
        throw new AppError('USER_NOT_FOUND', 'User not found', 404);
      }

      const { tier, billing_cycle } = req.body;
      const amount = await paymentService.calculatePrice(tier, billing_cycle);

      const paymentResult = await paymentService.initializePayment({
        email: user.email,
        amount,
        tier,
        companyId: req.user.company_id,
        billingCycle: billing_cycle,
      });

      const response: SuccessResponse = {
        success: true,
        data: {
          ...paymentResult,
          amount,
          tier,
          billing_cycle,
        },
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

// POST /api/subscriptions/verify
router.post(
  '/verify',
  authMiddleware,
  validate(verifyPaymentSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { reference } = req.body;
      const result = await paymentService.verifyPayment({ reference });

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

// POST /api/subscriptions/cancel
router.post('/cancel', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.company_id) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    await paymentService.cancelSubscription(req.user.company_id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/subscriptions/plans
router.get('/plans', async (req, res, next) => {
  try {
    const plans = [
      {
        tier: 'starter',
        name: 'Starter',
        monthly_price: 0,
        annual_price: 0,
        features: [
          '1 company profile',
          '10 bulk verifications/month',
          'Basic compliance tracking',
          'Email support',
        ],
      },
      {
        tier: 'business',
        name: 'Business',
        monthly_price: 700000, // ₦7,000
        annual_price: 6000000, // ₦60,000
        features: [
          '5 company profiles',
          '100 bulk verifications/month',
          'Advanced compliance tracking',
          'API access',
          'Priority support',
          'Custom branding',
        ],
      },
      {
        tier: 'enterprise',
        name: 'Enterprise',
        monthly_price: 1800000, // ₦18,000
        annual_price: 20000000, // ₦200,000
        features: [
          '20 company profiles',
          '500 bulk verifications/month',
          'Advanced compliance tracking',
          'API access',
          'White-label solution',
          'Dedicated account manager',
          'Custom integrations',
          'SLA guarantee',
        ],
      },
    ];

    const response: SuccessResponse = {
      success: true,
      data: plans,
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
