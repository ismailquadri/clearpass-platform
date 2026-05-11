import { Router } from 'express';
import { ComplianceService } from '../services/compliance';
import { CertificateService } from '../services/certificates';
import { AlertsService } from '../services/alerts';
import { authMiddleware } from '../middleware/auth';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();
const complianceService = new ComplianceService();
const certificateService = new CertificateService();
const alertsService = new AlertsService();

interface DashboardSnapshot {
  state: string;
  summary: {
    score: number;
    procurementReady: boolean;
    totalCertificates: number;
    activeCertificates: number;
    expiringCount: number;
    expiredCount: number;
    pendingCount: number;
  };
  certificates: any[];
  recentAlerts: any[];
}

// GET /api/dashboard
router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
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

    // Get compliance score
    const complianceData = await complianceService.getScore(req.user.company_id);

    // Get certificates
    const certificates = await certificateService.getCertificatesByCompany(req.user.company_id);

    // Get alerts
    const alerts = await alertsService.getAlerts(req.user.company_id, req.user.sub);

    // Calculate certificate status summary
    const summary = {
      score: complianceData.score.total_score,
      procurementReady: complianceData.score.procurement_ready,
      totalCertificates: certificates.length,
      activeCertificates: certificates.filter((c) => c.status === 'active').length,
      expiringCount: certificates.filter((c) => c.status.includes('expiring')).length,
      expiredCount: certificates.filter((c) => c.status === 'expired').length,
      pendingCount: certificates.filter((c) => c.status === 'pending').length,
    };

    // Determine dashboard state
    let state = 'Healthy';
    if (summary.expiredCount > 0 || complianceData.score.total_score < 50) {
      state = 'Non-Compliant';
    } else if (summary.expiringCount > 0 || complianceData.score.total_score < 80) {
      state = 'Attention Required';
    } else if (!complianceData.score.procurement_ready) {
      state = 'Critical';
    } else if (summary.totalCertificates === 0) {
      state = 'New Registration';
    }

    const snapshot: DashboardSnapshot = {
      state,
      summary,
      certificates,
      recentAlerts: alerts.slice(0, 10), // Return only recent alerts
    };

    const response: SuccessResponse = {
      success: true,
      data: snapshot,
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
