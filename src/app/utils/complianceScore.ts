// Compliance Health Score Algorithm
// 3-component formula as specified in the ClearPass PRD v2.2

export type CertType = 'nhia' | 'pcc' | 'nsitf' | 'itf' | 'firs_tin' | 'bpp';
export type CertStatus =
  | 'not_connected'
  | 'pending_verification'
  | 'active_180plus'
  | 'active_30_180'
  | 'expiring_15_30'
  | 'expiring_8_14'
  | 'expiring_1_7'
  | 'renewal_in_progress'
  | 'expired'
  | 'not_applicable';

export type VerificationQuality = 'api_verified' | 'admin_approved' | 'pending' | 'not_connected';

export interface CertificateInput {
  type: CertType;
  status: CertStatus;
  verificationQuality: VerificationQuality;
  daysToExpiry?: number;
  isApplicable: boolean;
}

interface ScoreBreakdown {
  componentA: number; // Coverage (50 pts max)
  componentB: number; // Freshness (30 pts max)
  componentC: number; // Verification Quality (20 pts max)
  raw: number;
  final: number;
  hardBlockApplied: boolean;
  hardBlockReason?: string;
  procurementReady: boolean;
  ineligibleToBid: boolean;
  profileLocked: boolean;
}

// Certificate weights for Component A (total 50 points across 6 certs)
const CERT_WEIGHTS: Record<CertType, number> = {
  nhia: 15,
  pcc: 10,
  nsitf: 8,
  firs_tin: 8,
  bpp: 5,
  itf: 4,
};

// Points multiplier by status (percentage of full weight)
function statusMultiplier(status: CertStatus): number {
  switch (status) {
    case 'active_180plus':
    case 'active_30_180':
    case 'expiring_15_30':
      return 1.0;
    case 'expiring_8_14':
      return 0.75;
    case 'expiring_1_7':
      return 0.4;
    case 'renewal_in_progress':
      return 0.6;
    case 'pending_verification':
      return 0.5;
    case 'expired':
    case 'not_connected':
    case 'not_applicable':
      return 0;
  }
}

// Component B: Freshness score based on nearest expiring cert
function freshnessScore(nearestDays: number | undefined): number {
  if (nearestDays === undefined || nearestDays <= 0) return 0;
  if (nearestDays >= 181) return 30;
  if (nearestDays >= 90) return 25;
  if (nearestDays >= 60) return 20;
  if (nearestDays >= 30) return 15;
  if (nearestDays >= 15) return 8;
  if (nearestDays >= 8) return 3;
  return 0; // 1-7 days
}

// Component C: Verification quality per cert
function qualityMultiplier(quality: VerificationQuality): number {
  switch (quality) {
    case 'api_verified':
      return 1.0;
    case 'admin_approved':
      return 0.8;
    case 'pending':
    case 'not_connected':
      return 0;
  }
}

export function calculateComplianceScore(
  certs: CertificateInput[],
  cacVerified: boolean
): ScoreBreakdown {
  // Hard Block 3: unverified CAC profile
  if (!cacVerified) {
    return {
      componentA: 0,
      componentB: 0,
      componentC: 0,
      raw: 0,
      final: 0,
      hardBlockApplied: true,
      hardBlockReason: 'profile_unverified',
      procurementReady: false,
      ineligibleToBid: true,
      profileLocked: true,
    };
  }

  const applicable = certs.filter((c) => c.isApplicable);

  // Component A: Coverage score
  // Redistribute weights if any cert is not applicable
  const totalWeight = applicable.reduce((s, c) => s + CERT_WEIGHTS[c.type], 0);
  const scaleFactor = totalWeight > 0 ? 50 / totalWeight : 0;

  let componentA = 0;
  for (const cert of applicable) {
    const weight = CERT_WEIGHTS[cert.type] * scaleFactor;
    componentA += weight * statusMultiplier(cert.status);
  }

  // Component B: Freshness — based on nearest active cert expiry
  const activeDays = applicable
    .filter(
      (c) =>
        c.status !== 'expired' &&
        c.status !== 'not_connected' &&
        c.daysToExpiry !== undefined
    )
    .map((c) => c.daysToExpiry!);

  const nearestDays = activeDays.length > 0 ? Math.min(...activeDays) : undefined;
  const componentB = freshnessScore(nearestDays);

  // Component C: Verification quality
  const pointsPerCert = applicable.length > 0 ? 20 / applicable.length : 0;
  let componentC = 0;
  for (const cert of applicable) {
    componentC += pointsPerCert * qualityMultiplier(cert.verificationQuality);
  }

  const raw = Math.round(componentA + componentB + componentC);

  // Hard Block 1: NHIA expired or not connected → cap at 49
  const nhia = certs.find((c) => c.type === 'nhia');
  const nhiaBlocked =
    nhia && (nhia.status === 'expired' || nhia.status === 'not_connected');

  // Hard Block 2: Any expired cert → Ineligible to Bid badge
  const anyExpired = applicable.some((c) => c.status === 'expired');

  let final = raw;
  let hardBlockApplied = false;
  let hardBlockReason: string | undefined;

  if (nhiaBlocked) {
    final = Math.min(raw, 49);
    hardBlockApplied = true;
    hardBlockReason = 'nhia_missing';
  }

  // Procurement Ready: all conditions must be true simultaneously
  const nhiaActive =
    nhia &&
    nhia.status !== 'expired' &&
    nhia.status !== 'not_connected' &&
    nhia.status !== 'pending_verification' &&
    nhia.status !== 'expiring_1_7';

  const noExpired = !anyExpired;
  const noMissing = applicable.every((c) => c.status !== 'not_connected');

  const procurementReady =
    final >= 80 && !!nhiaActive && noExpired && noMissing && cacVerified;

  return {
    componentA: Math.round(componentA * 10) / 10,
    componentB,
    componentC: Math.round(componentC * 10) / 10,
    raw,
    final,
    hardBlockApplied,
    hardBlockReason,
    procurementReady,
    ineligibleToBid: anyExpired || !!nhiaBlocked,
    profileLocked: false,
  };
}

// Derive CertStatus from days-to-expiry (for demo data)
export function daysToStatus(days: number | null): CertStatus {
  if (days === null) return 'not_connected';
  if (days < 0) return 'expired';
  if (days <= 7) return 'expiring_1_7';
  if (days <= 14) return 'expiring_8_14';
  if (days <= 30) return 'expiring_15_30';
  if (days <= 180) return 'active_30_180';
  return 'active_180plus';
}

export function statusLabel(status: CertStatus): string {
  switch (status) {
    case 'active_180plus':
    case 'active_30_180':
      return 'Active';
    case 'expiring_15_30':
      return 'Expiring Soon';
    case 'expiring_8_14':
      return 'Expiring Critical';
    case 'expiring_1_7':
      return 'Expiring Urgent';
    case 'renewal_in_progress':
      return 'Renewal In Progress';
    case 'pending_verification':
      return 'Pending Verification';
    case 'expired':
      return 'Expired';
    case 'not_connected':
      return 'Not Connected';
    case 'not_applicable':
      return 'Not Applicable';
  }
}

export function statusColor(status: CertStatus): string {
  switch (status) {
    case 'active_180plus':
    case 'active_30_180':
      return '#1FC16B';
    case 'expiring_15_30':
    case 'renewal_in_progress':
      return '#F59E0B';
    case 'expiring_8_14':
    case 'expiring_1_7':
      return '#FF3000';
    case 'pending_verification':
      return '#6366F1';
    case 'expired':
      return '#DC2626';
    case 'not_connected':
      return '#9CA3AF';
    case 'not_applicable':
      return '#D1D5DB';
  }
}
