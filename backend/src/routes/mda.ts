import { Router } from 'express';
import { db } from '../config/database';
import { ComplianceService } from '../services/compliance';
import { CertificateService } from '../services/certificates';
import { authMiddleware, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();
const complianceService = new ComplianceService();
const certificateService = new CertificateService();

interface VendorVerification {
  rcNumber: string;
  companyName: string;
  score: number;
  status: 'procurement-ready' | 'attention-required' | 'ineligible';
  lastVerified: string;
  certificates: {
    name: string;
    status: 'active' | 'expired' | 'expiring';
    expiryDate: string;
  }[];
}

interface PrequalificationApplicant {
  id: string;
  companyName: string;
  rcNumber: string;
  score: number;
  status: 'procurement-ready' | 'attention-required' | 'ineligible';
  submittedAt: string;
  reviewedAt?: string;
}

// GET /api/mda/verify/:rcNumber
router.get(
  '/verify/:rcNumber',
  authMiddleware,
  requireRole('mda', 'admin'),
  async (req: AuthRequest, res, next) => {
    try {
      const { rcNumber } = req.params;

      // Find company by RC number
      const company = await db('companies')
        .where({ rc_number: rcNumber })
        .whereNull('deleted_at')
        .first();

      if (!company) {
        throw new AppError('COMPANY_NOT_FOUND', 'Company not found', 404);
      }

      // Get compliance score
      const complianceData = await complianceService.getScore(company.id);

      // Get certificates
      const certificates = await certificateService.getCertificatesByCompany(company.id);

      // Format certificates for response
      const formattedCerts = certificates.map(cert => ({
        name: cert.shortName,
        status: (cert.status === 'active' ? 'active' : cert.status === 'expired' ? 'expired' : 'expiring') as 'active' | 'expiring' | 'expired',
        expiryDate: cert.expiryDate,
      }));

      // Determine status
      let status: 'procurement-ready' | 'attention-required' | 'ineligible';
      if (complianceData.score.total_score >= 80 && complianceData.score.procurement_ready) {
        status = 'procurement-ready';
      } else if (complianceData.score.total_score >= 50) {
        status = 'attention-required';
      } else {
        status = 'ineligible';
      }

      const verification: VendorVerification = {
        rcNumber: company.rc_number || '',
        companyName: company.name,
        score: complianceData.score.total_score,
        status,
        lastVerified: new Date().toISOString(),
        certificates: formattedCerts,
      };

      const response: SuccessResponse = {
        success: true,
        data: verification,
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

// GET /api/mda/prequalification
router.get(
  '/prequalification',
  authMiddleware,
  requireRole('mda', 'admin'),
  async (req: AuthRequest, res, next) => {
    try {
      // Get all companies with their compliance scores
      const companies = await db('companies')
        .join('compliance_scores', 'companies.id', 'compliance_scores.company_id')
        .select(
          'companies.id',
          'companies.name',
          'companies.rc_number',
          'compliance_scores.total_score',
          'compliance_scores.procurement_ready',
          'companies.created_at'
        )
        .whereNull('companies.deleted_at')
        .orderBy('companies.created_at', 'desc');

      const applicants: PrequalificationApplicant[] = companies.map(company => {
        let status: 'procurement-ready' | 'attention-required' | 'ineligible';
        if (company.total_score >= 80 && company.procurement_ready) {
          status = 'procurement-ready';
        } else if (company.total_score >= 50) {
          status = 'attention-required';
        } else {
          status = 'ineligible';
        }

        return {
          id: company.id,
          companyName: company.name,
          rcNumber: company.rc_number || '',
          score: company.total_score,
          status,
          submittedAt: new Date(company.created_at).toISOString(),
        };
      });

      const response: SuccessResponse = {
        success: true,
        data: applicants,
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

// POST /api/mda/prequalification/:id/approve
router.post(
  '/prequalification/:id/approve',
  authMiddleware,
  requireRole('mda', 'admin'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      // Update company verification status
      await db('companies')
        .where({ id })
        .update({
          verified: true,
          verification_date: new Date(),
        });

      // Log audit trail
      if (req.user?.sub) {
        await db('audit_trail').insert({
          user_id: req.user.sub,
          company_id: id,
          action: 'prequalification_approve',
          resource: 'company',
          resource_id: id,
          status: 'success',
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/mda/prequalification/:id/reject
router.post(
  '/prequalification/:id/reject',
  authMiddleware,
  requireRole('mda', 'admin'),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      // Update company verification status
      await db('companies')
        .where({ id })
        .update({
          verified: false,
          verification_date: new Date(),
        });

      // Log audit trail
      if (req.user?.sub) {
        await db('audit_trail').insert({
          user_id: req.user.sub,
          company_id: id,
          action: 'prequalification_reject',
          resource: 'company',
          resource_id: id,
          changes: reason,
          status: 'success',
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;