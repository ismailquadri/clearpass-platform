import { Router } from 'express';
import { z } from 'zod';
import { CertificateService } from '../services/certificates';
import { pdfService } from '../services/pdf';
import { storageService } from '../services/storage';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { uploadRateLimiter } from '../middleware/rateLimiter';
import { upload, handleFileUpload } from '../middleware/upload';
import type { SuccessResponse, AuthRequest } from '../types';

const router = Router();
const certificateService = new CertificateService();

// Validation schemas
const updateCertificateSchema = z.object({
  cert_type: z.string().optional(),
  cert_number: z.string().optional(),
  issuing_authority: z.string().optional(),
  issued_date: z.string().optional(),
  expiry_date: z.string().optional(),
  document_url: z.string().url().optional(),
  verification_method: z.string().optional(),
});

// GET /api/certificates
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

    const certificates = await certificateService.getCertificatesByCompany(req.user.company_id);
    const response: SuccessResponse = {
      success: true,
      data: certificates,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/certificates/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
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

    const certificate = await certificateService.getCertificateById(
      req.params.id,
      req.user.company_id
    );
    const response: SuccessResponse = {
      success: true,
      data: certificate,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/certificates
router.post(
  '/',
  authMiddleware,
  uploadRateLimiter,
  upload.single('file'),
  handleFileUpload,
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

      // Add document URL from upload handler
      // Document URL is already set by the upload handler

      const certificate = await certificateService.createCertificate(req.body, req.user.sub);
      const response: SuccessResponse = {
        success: true,
        data: certificate,
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

// PUT /api/certificates/:id
router.put(
  '/:id',
  authMiddleware,
  validate(updateCertificateSchema),
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

      const certificate = await certificateService.updateCertificate(
        req.params.id,
        req.user.company_id,
        req.body,
        req.user.sub
      );
      const response: SuccessResponse = {
        success: true,
        data: certificate,
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

// DELETE /api/certificates/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
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

    await certificateService.deleteCertificate(req.params.id, req.user.company_id, req.user.sub);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/certificates/:id/download
router.get('/:id/download', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.company_id) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const certificate = await certificateService.getCertificateById(
      req.params.id,
      req.user.company_id
    );

    if (!certificate.documentUrl) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: 'No document available for this certificate',
        },
      });
    }

    // Generate a mock PDF if no document URL exists
    if (!certificate.documentUrl || certificate.documentUrl.startsWith('mock')) {
      const pdfResult = await pdfService.generateCertificatePDF(certificate);
      const file = await storageService.downloadFile(pdfResult.key);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${certificate.shortName}-${certificate.certificateNumber}.pdf"`
      );
      res.send(file.data);
    } else {
      // Redirect to the document URL
      res.redirect(certificate.documentUrl);
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/certificates/export
router.get('/export', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.company_id) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const certificates = await certificateService.getCertificatesByCompany(req.user.company_id);

    // Generate a mock ZIP file (in production, use a real ZIP library)
    const mockZipContent = JSON.stringify(certificates, null, 2);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="certificates-export.zip"');
    res.send(mockZipContent);
  } catch (error) {
    next(error);
  }
});

export default router;
