import { Router } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { governmentApiService } from '../services/government';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AppError } from '../middleware/errorHandler';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();

// Validation schemas
const updateUserSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['contractor', 'mda', 'consultant', 'hmo', 'admin']).optional(),
  status: z.enum(['active', 'suspended', 'deleted']).optional(),
});

const updateCompanySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  company_size: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional(),
  subscription_tier: z.enum(['starter', 'business', 'enterprise']).optional(),
});

// Government API verification endpoints
router.post(
  '/government/verify-certificate',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const { certType, certNumber, companyName } = req.body;

      const result = await governmentApiService.verifyCertificate({
        certType,
        certNumber,
        companyName,
      });

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

router.post('/government/verify-company', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { rcNumber } = req.body;

    const result = await governmentApiService.verifyCompany(rcNumber);

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

router.post('/government/batch-verify', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { certificates } = req.body; // Array of { certType, certNumber }

    const results = await governmentApiService.batchVerifyCertificates(certificates);

    const response: SuccessResponse = {
      success: true,
      data: results,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// User management endpoints
router.get('/users', authMiddleware, requireRole('admin'), async (req: AuthRequest, res, next) => {
  try {
    const { companyId, role, status } = req.query;

    let query = db('users').whereNull('deleted_at');

    if (companyId) query = query.where('company_id', companyId);
    if (role) query = query.where('role', role);
    if (status) query = query.where('status', status);

    const users = await query.select(
      'id',
      'email',
      'first_name',
      'last_name',
      'role',
      'status',
      'created_at'
    );

    const response: SuccessResponse = {
      success: true,
      data: users,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await db('users').where({ id: req.params.id }).whereNull('deleted_at').first();

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

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

router.patch(
  '/users/:id',
  authMiddleware,
  validate(updateUserSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const updates: any = {};
      if (req.body.first_name !== undefined) updates.first_name = req.body.first_name;
      if (req.body.last_name !== undefined) updates.last_name = req.body.last_name;
      if (req.body.phone !== undefined) updates.phone = req.body.phone;
      if (req.body.role !== undefined) updates.role = req.body.role;
      if (req.body.status !== undefined) updates.status = req.body.status;

      if (Object.keys(updates).length === 0) {
        throw new AppError('NO_UPDATES', 'No fields to update', 400);
      }

      updates.updated_at = new Date();

      await db('users').where({ id: req.params.id }).update(updates);

      const user = await db('users').where({ id: req.params.id }).first();

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
  }
);

router.delete(
  '/users/:id',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthRequest, res, next) => {
    try {
      await db('users').where({ id: req.params.id }).update({
        status: 'deleted',
        deleted_at: new Date(),
        updated_at: new Date(),
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Company management endpoints
router.get(
  '/companies',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthRequest, res, next) => {
    try {
      const { tier, status } = req.query;

      let query = db('companies').whereNull('deleted_at');

      if (tier) query = query.where('subscription_tier', tier);
      if (status) query = query.where('status', status);

      const companies = await query.select('*');

      const response: SuccessResponse = {
        success: true,
        data: companies,
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

router.get('/companies/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const company = await db('companies')
      .where({ id: req.params.id })
      .whereNull('deleted_at')
      .first();

    if (!company) {
      throw new AppError('COMPANY_NOT_FOUND', 'Company not found', 404);
    }

    const response: SuccessResponse = {
      success: true,
      data: company,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/companies/:id',
  authMiddleware,
  validate(updateCompanySchema),
  async (req: AuthRequest, res, next) => {
    try {
      const updates: any = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        throw new AppError('NO_UPDATES', 'No fields to update', 400);
      }

      updates.updated_at = new Date();

      await db('companies').where({ id: req.params.id }).update(updates);

      const company = await db('companies').where({ id: req.params.id }).first();

      const response: SuccessResponse = {
        success: true,
        data: company,
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

// System health endpoint
router.get('/health', authMiddleware, requireRole('admin'), async (req: AuthRequest, res, next) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
    };

    const response: SuccessResponse = {
      success: true,
      data: health,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// System statistics endpoint
router.get(
  '/statistics',
  authMiddleware,
  requireRole('admin'),
  async (req: AuthRequest, res, next) => {
    try {
      const [
        totalUsers,
        activeUsers,
        totalCompanies,
        activeCompanies,
        totalCertificates,
        totalSubscriptions,
      ] = await Promise.all([
        db('users').whereNull('deleted_at').count('* as count').first(),
        db('users').where({ status: 'active' }).whereNull('deleted_at').count('* as count').first(),
        db('companies').whereNull('deleted_at').count('* as count').first(),
        db('companies')
          .where({ status: 'active' })
          .whereNull('deleted_at')
          .count('* as count')
          .first(),
        db('certificates').whereNull('deleted_at').count('* as count').first(),
        db('subscriptions').where({ status: 'active' }).count('* as count').first(),
      ]);

      const stats = {
        users: {
          total: totalUsers?.count || 0,
          active: activeUsers?.count || 0,
        },
        companies: {
          total: totalCompanies?.count || 0,
          active: activeCompanies?.count || 0,
        },
        certificates: {
          total: totalCertificates?.count || 0,
        },
        subscriptions: {
          active: totalSubscriptions?.count || 0,
        },
      };

      const response: SuccessResponse = {
        success: true,
        data: stats,
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
