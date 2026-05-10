/**
 * Domain types for the ClearPass API layer.
 *
 * These shapes are what every component consumes. The HTTP client and the
 * mock store both produce values of these types — that's the seam that lets
 * mock and live data swap without component changes.
 */

// ─── Shared primitives ──────────────────────────────────────────────────────

export type ID = string;

export type ISODateString = string;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}

// ─── Certificates ───────────────────────────────────────────────────────────

export type CertificateStatus =
  | 'active'
  | 'expiring-soon'
  | 'expiring-urgent'
  | 'expiring-critical'
  | 'expired'
  | 'pending'
  | 'not-connected';

export interface Certificate {
  id: ID;
  name: string;
  shortName: string;
  status: CertificateStatus;
  daysToExpiry?: number;
  expiryDate: string;
  certificateNumber?: string;
  isApiVerified: boolean;
  issuingAuthority?: string;
  issuedDate?: string;
  documentUrl?: string;
}

export interface CertificateUploadInput {
  shortName: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate: string;
  issuingAuthority: string;
  file: File;
}

// ─── Alerts ─────────────────────────────────────────────────────────────────

export type AlertType = 'critical' | 'warning' | 'info' | 'success';

export interface Alert {
  id: ID;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  certificateName?: string;
  daysToExpiry?: number;
  actionRequired: boolean;
  isRead: boolean;
  canDismiss: boolean;
}

// ─── Activity log ───────────────────────────────────────────────────────────

export type ActivityType =
  | 'verification'
  | 'upload'
  | 'download'
  | 'renewal'
  | 'alert'
  | 'email'
  | 'report';

export interface ActivityItem {
  id: ID;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export type DashboardStateLabel =
  | 'Healthy'
  | 'Attention Required'
  | 'Critical'
  | 'Non-Compliant'
  | 'New Registration'
  | 'Pending Verification';

export interface ComplianceSummary {
  score: number;
  procurementReady: boolean;
  totalCertificates: number;
  activeCertificates: number;
  expiringCount: number;
  expiredCount: number;
  pendingCount: number;
}

export interface DashboardSnapshot {
  state: DashboardStateLabel;
  summary: ComplianceSummary;
  certificates: Certificate[];
  recentAlerts: Alert[];
}

// ─── MDA portal ─────────────────────────────────────────────────────────────

export type VendorEligibilityStatus = 'procurement-ready' | 'attention-required' | 'ineligible';

export interface VendorCertificate {
  name: string;
  status: 'active' | 'expired' | 'expiring';
  expiryDate: string;
}

export interface VendorVerification {
  rcNumber: string;
  companyName: string;
  score: number;
  status: VendorEligibilityStatus;
  lastVerified: string;
  certificates: VendorCertificate[];
}

export interface PrequalificationApplicant {
  id: ID;
  companyName: string;
  rcNumber: string;
  score: number;
  status: VendorEligibilityStatus;
  submittedAt: string;
  reviewedAt?: string;
}

// ─── Partner portal ─────────────────────────────────────────────────────────

export type ClientStatus = 'healthy' | 'attention' | 'critical';

export interface PartnerClient {
  id: ID;
  companyName: string;
  rcNumber: string;
  score: number;
  status: ClientStatus;
  activeCertificates: number;
  totalCertificates: number;
  nextExpiry: string;
  daysToExpiry: number;
  monthlyFee: number;
}

export interface PartnerAnalytics {
  revenueTrend: { month: string; revenue: number; clients: number }[];
  complianceDistribution: { name: string; value: number; color: string }[];
  expiryTimeline: { period: string; count: number }[];
  certificateTypes: { name: string; renewals: number }[];
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

// ─── Settings ───────────────────────────────────────────────────────────────

export interface UserProfile {
  id: ID;
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  rcNumber?: string;
  role: 'business' | 'mda' | 'partner';
  avatarUrl?: string;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  expiryReminderDays: number[];
}
