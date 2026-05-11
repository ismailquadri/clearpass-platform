import { db } from '../config/database';
import { SCORE_WEIGHTS, CERT_TYPES, PROCUREMENT_READY_SCORE } from '../config/constants';

export interface ComplianceScore {
  component_a: number; // Coverage (0-40)
  component_b: number; // Freshness (0-30)
  component_c: number; // Quality (0-30)
  total_score: number; // Sum (0-100)
  procurement_ready: boolean;
}

export interface ComplianceScoreDetails {
  score: ComplianceScore;
  breakdown: {
    total_required: number;
    total_present: number;
    coverage_percentage: number;
    active_certificates: number;
    expiring_certificates: number;
    api_verified: number;
    nhia_active: boolean;
  };
}

export class ComplianceService {
  async calculateScore(companyId: string): Promise<ComplianceScoreDetails> {
    // Get all certificates for the company
    const certificates = await db('certificates')
      .where({ company_id: companyId })
      .whereNull('deleted_at');

    // Calculate Component A: Coverage (0-50 points)
    // % of required certificates present
    const totalRequired = CERT_TYPES.length;
    const totalPresent = certificates.length;
    const coveragePercentage = totalRequired > 0 ? (totalPresent / totalRequired) * 100 : 0;
    const componentA = Math.round((coveragePercentage / 100) * SCORE_WEIGHTS.coverage);

    // Calculate Component B: Freshness (0-30 points)
    // % of certificates not expiring within 30 days
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const activeCertificates = certificates.filter((cert) => {
      if (!cert.expiry_date) return false;
      const expiry = new Date(cert.expiry_date);
      return expiry > thirtyDaysFromNow;
    });

    const expiringCertificates = certificates.filter((cert) => {
      if (!cert.expiry_date) return false;
      const expiry = new Date(cert.expiry_date);
      return expiry <= thirtyDaysFromNow && expiry > today;
    });

    const freshnessPercentage =
      totalPresent > 0 ? (activeCertificates.length / totalPresent) * 100 : 0;
    const componentB = Math.round((freshnessPercentage / 100) * SCORE_WEIGHTS.freshness);

    // Calculate Component C: Quality (0-30 points)
    // PRD spec: API verification = 30, manual = 15, pending = 0
    let qualityScore = 0;
    if (totalPresent > 0) {
      const apiVerified = certificates.filter((cert) => cert.verification_method === 'api').length;
      const manualVerified = certificates.filter((cert) => cert.verification_method === 'manual').length;
      const pendingVerification = certificates.filter((cert) => cert.verification_method === 'pending' || !cert.verification_method).length;

      // Calculate weighted quality score
      const maxQualityPerCert = SCORE_WEIGHTS.quality / CERT_TYPES.length; // 30 / 6 = 5 points per cert
      qualityScore = (apiVerified * 5) + (manualVerified * 2.5) + (pendingVerification * 0);
      qualityScore = Math.round(qualityScore);
    }
    const componentC = Math.min(qualityScore, SCORE_WEIGHTS.quality);

    // Calculate total score
    let totalScore = componentA + componentB + componentC;

    // Check if procurement-ready (score >= 80 AND NHIA active)
    const nhiaCertificate = certificates.find((cert) => cert.cert_type === 'nhia');
    const nhiaActive = nhiaCertificate ? nhiaCertificate.status === 'active' : false;
    const nhiaPresent = !!nhiaCertificate;

    // NHIA hard block: if NHIA is missing, cap score at 49
    if (!nhiaPresent) {
      totalScore = Math.min(totalScore, 49);
    }

    // Expired certificate hard block: if any certificate is expired, ineligible to bid
    const hasExpiredCertificate = certificates.some((cert) => {
      if (!cert.expiry_date) return false;
      const expiry = new Date(cert.expiry_date);
      return expiry < today;
    });

    const procurementReady = totalScore >= PROCUREMENT_READY_SCORE && nhiaActive && !hasExpiredCertificate;

    const score: ComplianceScore = {
      component_a: componentA,
      component_b: componentB,
      component_c: componentC,
      total_score: totalScore,
      procurement_ready: procurementReady,
    };

    const breakdown = {
      total_required: totalRequired,
      total_present: totalPresent,
      coverage_percentage: Math.round(coveragePercentage),
      active_certificates: activeCertificates.length,
      expiring_certificates: expiringCertificates.length,
      api_verified: certificates.filter((cert) => cert.verification_method === 'api').length,
      nhia_active: nhiaActive,
      nhia_present: nhiaPresent,
      has_expired_certificate: hasExpiredCertificate,
      score_capped: !nhiaPresent && totalScore >= 49,
    };

    // Update or create compliance score record
    await this.updateComplianceScore(companyId, score, breakdown);

    return {
      score,
      breakdown,
    };
  }

  async getScore(companyId: string): Promise<ComplianceScoreDetails> {
    // Get the latest score from database
    const scoreRecord = await db('compliance_scores').where({ company_id: companyId }).first();

    if (!scoreRecord) {
      // If no score exists, calculate it
      return this.calculateScore(companyId);
    }

    // Check if score needs recalculation (older than 24 hours)
    const lastCalculated = new Date(scoreRecord.last_calculated || scoreRecord.created_at);
    const hoursSinceCalculation = (Date.now() - lastCalculated.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCalculation > 24) {
      return this.calculateScore(companyId);
    }

    const score: ComplianceScore = {
      component_a: scoreRecord.component_a,
      component_b: scoreRecord.component_b,
      component_c: scoreRecord.component_c,
      total_score: scoreRecord.total_score,
      procurement_ready: scoreRecord.procurement_ready,
    };

    const breakdown = scoreRecord.calculation_details as any;

    return {
      score,
      breakdown,
    };
  }

  private async updateComplianceScore(
    companyId: string,
    score: ComplianceScore,
    breakdown: unknown
  ): Promise<void> {
    const existing = await db('compliance_scores').where({ company_id: companyId }).first();

    if (existing) {
      await db('compliance_scores').where({ company_id: companyId }).update({
        component_a: score.component_a,
        component_b: score.component_b,
        component_c: score.component_c,
        total_score: score.total_score,
        procurement_ready: score.procurement_ready,
        last_calculated: new Date(),
        calculation_details: breakdown,
        updated_at: new Date(),
      });
    } else {
      await db('compliance_scores').insert({
        company_id: companyId,
        component_a: score.component_a,
        component_b: score.component_b,
        component_c: score.component_c,
        total_score: score.total_score,
        procurement_ready: score.procurement_ready,
        last_calculated: new Date(),
        calculation_details: breakdown,
      });
    }
  }

  async getCertificateStatus(companyId: string): Promise<any> {
    const certificates = await db('certificates')
      .where({ company_id: companyId })
      .whereNull('deleted_at');

    return {
      total: certificates.length,
      active: certificates.filter((c) => c.status === 'active').length,
      expiring: certificates.filter((c) => c.status.includes('expiring')).length,
      expired: certificates.filter((c) => c.status === 'expired').length,
      pending: certificates.filter((c) => c.status === 'pending').length,
    };
  }
}
