import { Router } from 'express';
import { db } from '../config/database';
import { ComplianceService } from '../services/compliance';
import { CertificateService } from '../services/certificates';
import { authMiddleware, requireRole } from '../middleware/auth';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();
const complianceService = new ComplianceService();
const certificateService = new CertificateService();

interface PartnerClient {
  id: string;
  companyName: string;
  rcNumber: string;
  score: number;
  status: 'healthy' | 'attention' | 'critical';
  activeCertificates: number;
  totalCertificates: number;
  nextExpiry: string;
  daysToExpiry: number;
  monthlyFee: number;
}

interface PartnerAnalytics {
  revenueTrend: {
    month: string;
    revenue: number;
    clients: number;
  }[];
  complianceDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  expiryTimeline: {
    period: string;
    count: number;
  }[];
  certificateTypes: {
    name: string;
    renewals: number;
  }[];
  kpi: {
    monthlyRevenue: number;
    monthlyRevenueDeltaPct: number;
    activeClients: number;
    activeClientsDelta: number;
    avgComplianceScore: number;
    avgComplianceScoreDelta: number;
    renewalsThisMonth: number;
    renewalsPendingAction: number;
  };
}

// GET /api/partner/clients
router.get(
  '/clients',
  authMiddleware,
  requireRole('consultant', 'admin'),
  async (req: AuthRequest, res, next) => {
    try {
      // For MVP, return all companies (in production, filter by partner's clients)
      const companies = await db('companies')
        .whereNull('deleted_at')
        .orderBy('name', 'asc');

      const clients: PartnerClient[] = [];

      for (const company of companies) {
        // Get compliance score
        const complianceData = await complianceService.getScore(company.id);

        // Get certificates
        const certificates = await certificateService.getCertificatesByCompany(company.id);

        // Find next expiring certificate
        const expiringCerts = certificates
          .filter(c => c.daysToExpiry !== undefined && c.daysToExpiry > 0)
          .sort((a, b) => (a.daysToExpiry || 0) - (b.daysToExpiry || 0));

        const nextExpiry = expiringCerts[0]?.shortName || 'N/A';
        const daysToExpiry = expiringCerts[0]?.daysToExpiry || 0;

        // Determine status
        let status: 'healthy' | 'attention' | 'critical';
        if (complianceData.score.total_score >= 80) {
          status = 'healthy';
        } else if (complianceData.score.total_score >= 50) {
          status = 'attention';
        } else {
          status = 'critical';
        }

        // Get monthly fee from subscription
        const subscription = await db('subscriptions')
          .where({ company_id: company.id })
          .first();

        const monthlyFee = subscription?.monthly_amount || 0;

        clients.push({
          id: company.id,
          companyName: company.name,
          rcNumber: company.rc_number || '',
          score: complianceData.score.total_score,
          status,
          activeCertificates: certificates.filter(c => c.status === 'active').length,
          totalCertificates: certificates.length,
          nextExpiry,
          daysToExpiry,
          monthlyFee,
        });
      }

      const response: SuccessResponse = {
        success: true,
        data: clients,
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

// GET /api/partner/analytics
router.get(
  '/analytics',
  authMiddleware,
  requireRole('consultant', 'admin'),
  async (req: AuthRequest, res, next) => {
    try {
      // Get all companies with compliance scores
      const companies = await db('companies')
        .join('compliance_scores', 'companies.id', 'compliance_scores.company_id')
        .join('subscriptions', 'companies.id', 'subscriptions.company_id')
        .select(
          'companies.id',
          'companies.created_at',
          'compliance_scores.total_score',
          'subscriptions.monthly_amount'
        )
        .whereNull('companies.deleted_at');

      // Calculate revenue trend (last 6 months)
      const revenueTrend = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

        // In production, this would be calculated from actual payment data
        const monthCompanies = companies.filter(c => {
          const companyDate = new Date(c.created_at);
          return companyDate.getMonth() === date.getMonth() && companyDate.getFullYear() === date.getFullYear();
        });

        revenueTrend.push({
          month: monthName,
          revenue: monthCompanies.reduce((sum, c) => sum + (c.monthly_amount || 0), 0),
          clients: monthCompanies.length,
        });
      }

      // Calculate compliance distribution
      const complianceDistribution = [
        { name: 'Procurement Ready', value: companies.filter(c => c.total_score >= 80).length, color: '#10B981' },
        { name: 'Attention Required', value: companies.filter(c => c.total_score >= 50 && c.total_score < 80).length, color: '#F59E0B' },
        { name: 'Critical', value: companies.filter(c => c.total_score < 50).length, color: '#EF4444' },
      ];

      // Calculate expiry timeline (simplified for MVP)
      const expiryTimeline = [
        { period: '0-30 days', count: 0 },
        { period: '31-60 days', count: 0 },
        { period: '61-90 days', count: 0 },
        { period: '90+ days', count: 0 },
      ];

      // Certificate types renewals (simplified for MVP)
      const certificateTypes = [
        { name: 'NHIA', renewals: 0 },
        { name: 'PCC', renewals: 0 },
        { name: 'NSITF', renewals: 0 },
        { name: 'FIRS', renewals: 0 },
        { name: 'BPP', renewals: 0 },
        { name: 'ITF', renewals: 0 },
      ];

      // Calculate KPIs
      const monthlyRevenue = companies.reduce((sum, c) => sum + (c.monthly_amount || 0), 0);
      const avgComplianceScore = companies.length > 0
        ? companies.reduce((sum, c) => sum + c.total_score, 0) / companies.length
        : 0;

      const analytics: PartnerAnalytics = {
        revenueTrend,
        complianceDistribution,
        expiryTimeline,
        certificateTypes,
        kpi: {
          monthlyRevenue,
          monthlyRevenueDeltaPct: 0, // Would calculate from previous month
          activeClients: companies.length,
          activeClientsDelta: 0, // Would calculate from previous month
          avgComplianceScore: Math.round(avgComplianceScore),
          avgComplianceScoreDelta: 0, // Would calculate from previous month
          renewalsThisMonth: 0, // Would calculate from actual renewal data
          renewalsPendingAction: 0, // Would calculate from actual renewal data
        },
      };

      const response: SuccessResponse = {
        success: true,
        data: analytics,
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