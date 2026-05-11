import { db } from '../config/database';
import { EXPIRY_THRESHOLDS, CERT_TYPES } from '../config/constants';
import { AppError } from '../middleware/errorHandler';
import type { CertificateRow } from '../types';

export interface CertificateInput {
  company_id: string;
  cert_type: string;
  cert_number: string;
  issuing_authority?: string;
  issued_date?: string;
  expiry_date?: string;
  document_url?: string;
  verification_method?: string;
}

export interface CertificateResponse {
  id: string;
  name: string;
  shortName: string;
  status: string;
  daysToExpiry?: number;
  expiryDate: string;
  certificateNumber?: string;
  isApiVerified: boolean;
  issuingAuthority?: string;
  issuedDate?: string;
  documentUrl?: string;
}

const CERTIFICATE_NAMES: Record<string, string> = {
  nhia: 'NHIA Certificate',
  pcc: 'Police Character Certificate',
  nsitf: 'NSITF Certificate',
  firs: 'FIRS Tax Clearance',
  bpp: 'BPP Certificate',
  itf: 'ITF Certificate',
};

export class CertificateService {
  async getCertificatesByCompany(companyId: string): Promise<CertificateResponse[]> {
    const certificates = await db('certificates')
      .where({ company_id: companyId })
      .whereNull('deleted_at')
      .orderBy('expiry_date', 'asc');

    return certificates.map(cert => this.formatCertificate(cert));
  }

  async getCertificateById(id: string, companyId: string): Promise<CertificateResponse> {
    const certificate = await db('certificates')
      .where({ id, company_id: companyId })
      .whereNull('deleted_at')
      .first();

    if (!certificate) {
      throw new AppError('CERTIFICATE_NOT_FOUND', 'Certificate not found', 404);
    }

    return this.formatCertificate(certificate);
  }

  async createCertificate(input: CertificateInput, userId: string): Promise<CertificateResponse> {
    // Validate cert_type
    if (!CERT_TYPES.includes(input.cert_type as any)) {
      throw new AppError('INVALID_CERT_TYPE', 'Invalid certificate type', 400);
    }

    // Check if certificate number already exists for this company
    const existing = await db('certificates')
      .where({
        company_id: input.company_id,
        cert_number: input.cert_number,
      })
      .whereNull('deleted_at')
      .first();

    if (existing) {
      throw new AppError('CERTIFICATE_EXISTS', 'Certificate with this number already exists', 409);
    }

    const status = this.calculateStatus(input.expiry_date);

    const [certificate] = await db('certificates')
      .insert({
        company_id: input.company_id,
        cert_type: input.cert_type,
        cert_number: input.cert_number,
        issuing_authority: input.issuing_authority || null,
        issued_date: input.issued_date || null,
        expiry_date: input.expiry_date || null,
        document_url: input.document_url || null,
        verification_method: input.verification_method || 'manual',
        status,
      })
      .returning('*');

    // Log audit trail
    await this.logAudit(userId, input.company_id, 'cert_upload', 'certificate', certificate.id, null, certificate);

    return this.formatCertificate(certificate);
  }

  async updateCertificate(
    id: string,
    companyId: string,
    updates: Partial<CertificateInput>,
    userId: string
  ): Promise<CertificateResponse> {
    const existing = await db('certificates')
      .where({ id, company_id: companyId })
      .whereNull('deleted_at')
      .first();

    if (!existing) {
      throw new AppError('CERTIFICATE_NOT_FOUND', 'Certificate not found', 404);
    }

    // Recalculate status if expiry_date is being updated
    const updateData: any = { ...updates };
    if (updates.expiry_date) {
      updateData.status = this.calculateStatus(updates.expiry_date);
    }

    const [updated] = await db('certificates')
      .where({ id })
      .update(updateData)
      .returning('*');

    // Log audit trail
    await this.logAudit(userId, companyId, 'cert_update', 'certificate', id, existing, updated);

    return this.formatCertificate(updated);
  }

  async deleteCertificate(id: string, companyId: string, userId: string): Promise<void> {
    const existing = await db('certificates')
      .where({ id, company_id: companyId })
      .whereNull('deleted_at')
      .first();

    if (!existing) {
      throw new AppError('CERTIFICATE_NOT_FOUND', 'Certificate not found', 404);
    }

    await db('certificates')
      .where({ id })
      .update({ deleted_at: new Date() });

    // Log audit trail
    await this.logAudit(userId, companyId, 'cert_delete', 'certificate', id, existing, null);
  }

  private calculateStatus(expiryDate?: string): string {
    if (!expiryDate) {
      return 'pending';
    }

    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'expired';
    } else if (diffDays <= EXPIRY_THRESHOLDS.critical) {
      return 'expiring-critical';
    } else if (diffDays <= EXPIRY_THRESHOLDS.urgent) {
      return 'expiring-urgent';
    } else if (diffDays <= EXPIRY_THRESHOLDS.soon) {
      return 'expiring-soon';
    } else {
      return 'active';
    }
  }

  private formatCertificate(cert: CertificateRow): CertificateResponse {
    const expiryDate = cert.expiry_date ? new Date(cert.expiry_date) : null;
    const today = new Date();
    const daysToExpiry = expiryDate
      ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      : undefined;

    const status = this.calculateStatus(cert.expiry_date ? cert.expiry_date.toISOString() : undefined);

    return {
      id: cert.id,
      name: CERTIFICATE_NAMES[cert.cert_type] || cert.cert_type.toUpperCase(),
      shortName: cert.cert_type.toUpperCase(),
      status,
      daysToExpiry,
      expiryDate: expiryDate ? this.formatDate(expiryDate) : 'Not set',
      certificateNumber: cert.cert_number,
      isApiVerified: cert.verification_method === 'api',
      issuingAuthority: cert.issuing_authority || undefined,
      issuedDate: cert.issued_date ? this.formatDate(new Date(cert.issued_date)) : undefined,
      documentUrl: cert.document_url || undefined,
    };
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  private async logAudit(
    user_id: string,
    company_id: string,
    action: string,
    resource: string,
    resource_id: string,
    old_values: unknown,
    new_values: unknown
  ): Promise<void> {
    await db('audit_trail').insert({
      user_id,
      company_id,
      action,
      resource,
      resource_id,
      old_values: old_values as Record<string, unknown>,
      new_values: new_values as Record<string, unknown>,
      status: 'success',
    });
  }
}