import { Router } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { CertificateService } from '../services/certificates';
import { ComplianceService } from '../services/compliance';
import { pdfService } from '../services/pdf';
import { storageService } from '../services/storage';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { AppError } from '../middleware/errorHandler';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();
const certificateService = new CertificateService();
const complianceService = new ComplianceService();

// Validation schemas
const generateReportSchema = z.object({
  report_type: z.enum(['compliance', 'audit', 'pre_qual']),
});

interface GenerateReportResponse {
  id: string;
  report_type: string;
  pdf_url: string;
  generated_at: string;
  valid_until: string;
}

// POST /api/reports/generate
router.post(
  '/generate',
  authMiddleware,
  validate(generateReportSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.company_id || !req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const { report_type } = req.body;

      // Get company information
      const company = await db('companies')
        .where({ id: req.user.company_id })
        .first();

      if (!company) {
        throw new AppError('COMPANY_NOT_FOUND', 'Company not found', 404);
      }

      // Get compliance score
      const complianceData = await complianceService.getScore(req.user.company_id);

      // Get certificates
      const certificates = await certificateService.getCertificatesByCompany(req.user.company_id);

      // Format certificates for report
      const formattedCertificates = certificates.map(cert => ({
        name: cert.name,
        certNumber: cert.certificateNumber || 'N/A',
        status: cert.status,
        expiryDate: cert.expiryDate,
        issuingAuthority: cert.issuingAuthority || 'N/A',
      }));

      // Generate report data
      const reportData = {
        companyName: company.name,
        rcNumber: company.rc_number || 'N/A',
        complianceScore: complianceData.score.total_score,
        procurementReady: complianceData.score.procurement_ready,
        certificates: formattedCertificates,
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
      };

      // Generate PDF
      const pdfResult = await pdfService.generateComplianceReport(reportData);

      // Save report to database
      const [report] = await db('reports').insert({
        company_id: req.user.company_id,
        report_type,
        generated_by: req.user.sub,
        pdf_url: pdfResult.url,
        pdf_hash: pdfResult.key,
        included_certificates: certificates.map(c => c.shortName),
        compliance_score: complianceData.score.total_score,
        generated_at: new Date(),
        valid_until: reportData.validUntil,
      }).returning('*');

      const response: SuccessResponse<GenerateReportResponse> = {
        success: true,
        data: {
          id: report.id,
          report_type: report.report_type,
          pdf_url: report.pdf_url,
          generated_at: report.generated_at.toISOString(),
          valid_until: report.valid_until?.toISOString() || '',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/reports/:id/download
router.get(
  '/:id/download',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.company_id) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const report = await db('reports')
        .where({
          id: req.params.id,
          company_id: req.user.company_id,
        })
        .first();

      if (!report) {
        throw new AppError('REPORT_NOT_FOUND', 'Report not found', 404);
      }

      // Check if report is still valid
      if (report.valid_until && new Date(report.valid_until) < new Date()) {
        throw new AppError('REPORT_EXPIRED', 'This report has expired', 400);
      }

      // Download the PDF from storage
      try {
        const file = await storageService.downloadFile(report.pdf_hash);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${report.report_type}-report-${report.id}.pdf"`);
        res.send(file.data);
      } catch {
        // If storage fails, redirect to the URL
        res.redirect(report.pdf_url);
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/reports
router.get(
  '/',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.company_id) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const reports = await db('reports')
        .where({ company_id: req.user.company_id })
        .orderBy('generated_at', 'desc')
        .limit(20);

      const response: SuccessResponse = {
        success: true,
        data: reports.map(report => ({
          id: report.id,
          report_type: report.report_type,
          pdf_url: report.pdf_url,
          generated_at: report.generated_at.toISOString(),
          valid_until: report.valid_until?.toISOString(),
          compliance_score: report.compliance_score,
        })),
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