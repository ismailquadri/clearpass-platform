/**
 * Demo-mode mock data. Lives in one file so it is easy to delete or move
 * behind a feature flag once the live backend is in place.
 *
 * Numbers are tuned to look believable in the demo and to match the
 * Tweaks Panel's state-driven dashboard (Healthy / Attention / Critical / etc.).
 */

import type {
  ActivityItem,
  Alert,
  Certificate,
  ComplianceSummary,
  DashboardSnapshot,
  DashboardStateLabel,
  NotificationPreferences,
  PartnerAnalytics,
  PartnerClient,
  PrequalificationApplicant,
  UserProfile,
  VendorVerification,
} from './types';

// ─── Certificates ───────────────────────────────────────────────────────────

export const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    name: 'National Health Insurance Authority Certificate',
    shortName: 'NHIA',
    status: 'active',
    daysToExpiry: 245,
    expiryDate: '15 Jan 2027',
    certificateNumber: 'NHIA/2026/FCT/AB12345678',
    isApiVerified: true,
    issuingAuthority: 'National Health Insurance Authority',
    issuedDate: '15 Jan 2026',
  },
  {
    id: 'cert-2',
    name: 'Pension Clearance Certificate',
    shortName: 'PCC',
    status: 'expiring-soon',
    daysToExpiry: 28,
    expiryDate: '05 Jun 2026',
    certificateNumber: 'PCC/2025/LAG/CD98765432',
    isApiVerified: true,
    issuingAuthority: 'National Pension Commission',
    issuedDate: '05 Jun 2025',
  },
  {
    id: 'cert-3',
    name: 'Nigeria Social Insurance Trust Fund',
    shortName: 'NSITF',
    status: 'expiring-urgent',
    daysToExpiry: 6,
    expiryDate: '15 May 2026',
    certificateNumber: 'NSITF/2025/EF45612378',
    isApiVerified: false,
    issuingAuthority: 'Nigeria Social Insurance Trust Fund',
    issuedDate: '15 May 2025',
  },
  {
    id: 'cert-4',
    name: 'Federal Inland Revenue Service Tax Clearance',
    shortName: 'FIRS TCC',
    status: 'active',
    daysToExpiry: 189,
    expiryDate: '14 Nov 2026',
    certificateNumber: 'TCC/2026/LAG/GH78945612',
    isApiVerified: true,
    issuingAuthority: 'Federal Inland Revenue Service',
    issuedDate: '14 Nov 2025',
  },
  {
    id: 'cert-5',
    name: 'Bureau of Public Procurement Certificate',
    shortName: 'BPP',
    status: 'active',
    daysToExpiry: 312,
    expiryDate: '16 Mar 2027',
    certificateNumber: 'BPP/2026/IJ12378945',
    isApiVerified: true,
    issuingAuthority: 'Bureau of Public Procurement',
    issuedDate: '16 Mar 2026',
  },
  {
    id: 'cert-6',
    name: 'Industrial Training Fund Certificate',
    shortName: 'ITF',
    status: 'pending',
    expiryDate: 'Pending',
    certificateNumber: 'ITF/2026/KL96325874',
    isApiVerified: false,
    issuingAuthority: 'Industrial Training Fund',
    issuedDate: '20 Apr 2026',
  },
];

// ─── Alerts ─────────────────────────────────────────────────────────────────

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    title: 'NSITF Certificate Expiring in 6 Days',
    message:
      'Your NSITF certificate will expire on 15 May 2026. Renew immediately to avoid compliance gaps and score drop from 73 to 41.',
    timestamp: '9 May 2026, 8:00 AM',
    certificateName: 'NSITF',
    daysToExpiry: 6,
    actionRequired: true,
    isRead: false,
    canDismiss: false,
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'PCC Certificate Renewal Reminder',
    message:
      'Your Pension Clearance Certificate expires in 28 days. Start the renewal process now to ensure continuity.',
    timestamp: '9 May 2026, 8:00 AM',
    certificateName: 'PCC',
    daysToExpiry: 28,
    actionRequired: true,
    isRead: false,
    canDismiss: true,
  },
  {
    id: 'alert-3',
    type: 'info',
    title: 'ITF Certificate Pending Verification',
    message:
      'Your ITF certificate upload is pending admin review. Expected completion within 1-2 business days.',
    timestamp: '8 May 2026, 3:15 PM',
    certificateName: 'ITF',
    actionRequired: false,
    isRead: true,
    canDismiss: true,
  },
  {
    id: 'alert-4',
    type: 'warning',
    title: 'Compliance Score At Risk',
    message:
      'Your compliance score may drop to 41/100 if NSITF certificate is not renewed by 15 May 2026.',
    timestamp: '7 May 2026, 7:30 AM',
    actionRequired: true,
    isRead: true,
    canDismiss: false,
  },
  {
    id: 'alert-5',
    type: 'success',
    title: 'NHIA Certificate Verified Successfully',
    message:
      'Your NHIA certificate has been verified via government API and is active until 15 Jan 2027.',
    timestamp: '6 May 2026, 10:23 AM',
    certificateName: 'NHIA',
    actionRequired: false,
    isRead: true,
    canDismiss: true,
  },
  {
    id: 'alert-6',
    type: 'info',
    title: 'Monthly Compliance Report Available',
    message: 'Your April 2026 compliance summary report is ready for download.',
    timestamp: '1 May 2026, 12:00 PM',
    actionRequired: false,
    isRead: true,
    canDismiss: true,
  },
];

// ─── Activity ───────────────────────────────────────────────────────────────

export const mockActivity: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'verification',
    title: 'NHIA Certificate Verified',
    description: 'Certificate verified successfully via government API',
    timestamp: '9 May 2026, 10:23 AM',
    status: 'success',
  },
  {
    id: 'act-2',
    type: 'alert',
    title: 'NSITF Certificate Expiring Soon',
    description: 'Your NSITF certificate will expire in 6 days',
    timestamp: '9 May 2026, 8:00 AM',
    status: 'warning',
  },
  {
    id: 'act-3',
    type: 'email',
    title: 'Compliance Alert Sent',
    description: 'Email notification sent regarding PCC renewal',
    timestamp: '8 May 2026, 6:15 PM',
    status: 'info',
  },
  {
    id: 'act-4',
    type: 'report',
    title: 'Compliance Report Generated',
    description: 'Monthly compliance report downloaded',
    timestamp: '8 May 2026, 2:30 PM',
    status: 'success',
  },
  {
    id: 'act-5',
    type: 'upload',
    title: 'ITF Certificate Uploaded',
    description: 'New certificate document uploaded for verification',
    timestamp: '7 May 2026, 11:45 AM',
    status: 'info',
  },
  {
    id: 'act-6',
    type: 'verification',
    title: 'PCC Verification Completed',
    description: 'Admin reviewed and approved PCC certificate',
    timestamp: '6 May 2026, 4:20 PM',
    status: 'success',
  },
  {
    id: 'act-7',
    type: 'renewal',
    title: 'FIRS TCC Renewal Started',
    description: 'Renewal process initiated for tax clearance certificate',
    timestamp: '5 May 2026, 9:15 AM',
    status: 'info',
  },
  {
    id: 'act-8',
    type: 'download',
    title: 'Certificate Bundle Downloaded',
    description: 'All active certificates downloaded as PDF bundle',
    timestamp: '4 May 2026, 3:45 PM',
    status: 'success',
  },
];

// ─── Dashboard ──────────────────────────────────────────────────────────────

const summaryFor = (state: DashboardStateLabel): ComplianceSummary => {
  switch (state) {
    case 'Healthy':
      return {
        score: 94,
        procurementReady: true,
        totalCertificates: 6,
        activeCertificates: 6,
        expiringCount: 0,
        expiredCount: 0,
        pendingCount: 0,
      };
    case 'Attention Required':
      return {
        score: 73,
        procurementReady: true,
        totalCertificates: 6,
        activeCertificates: 4,
        expiringCount: 2,
        expiredCount: 0,
        pendingCount: 0,
      };
    case 'Critical':
      return {
        score: 52,
        procurementReady: false,
        totalCertificates: 6,
        activeCertificates: 3,
        expiringCount: 2,
        expiredCount: 1,
        pendingCount: 0,
      };
    case 'Non-Compliant':
      return {
        score: 28,
        procurementReady: false,
        totalCertificates: 6,
        activeCertificates: 1,
        expiringCount: 1,
        expiredCount: 4,
        pendingCount: 0,
      };
    case 'New Registration':
      return {
        score: 0,
        procurementReady: false,
        totalCertificates: 0,
        activeCertificates: 0,
        expiringCount: 0,
        expiredCount: 0,
        pendingCount: 0,
      };
    case 'Pending Verification':
      return {
        score: 0,
        procurementReady: false,
        totalCertificates: 6,
        activeCertificates: 0,
        expiringCount: 0,
        expiredCount: 0,
        pendingCount: 6,
      };
  }
};

export function mockDashboard(state: DashboardStateLabel): DashboardSnapshot {
  return {
    state,
    summary: summaryFor(state),
    certificates: mockCertificates,
    recentAlerts: mockAlerts.slice(0, 3),
  };
}

// ─── MDA portal ─────────────────────────────────────────────────────────────

export const mockVendorVerifications: VendorVerification[] = [
  {
    rcNumber: 'RC1234567',
    companyName: 'TechBuild Nigeria Ltd',
    score: 73,
    status: 'attention-required',
    lastVerified: '9 May 2026, 10:23 AM',
    certificates: [
      { name: 'NHIA', status: 'active', expiryDate: '15 Jan 2027' },
      { name: 'PCC', status: 'expiring', expiryDate: '05 Jun 2026' },
      { name: 'NSITF', status: 'expiring', expiryDate: '15 May 2026' },
      { name: 'FIRS', status: 'active', expiryDate: '14 Nov 2026' },
      { name: 'BPP', status: 'active', expiryDate: '16 Mar 2027' },
      { name: 'ITF', status: 'active', expiryDate: '18 Dec 2026' },
    ],
  },
  {
    rcNumber: 'RC7654321',
    companyName: 'BuildCo Construction Ltd',
    score: 92,
    status: 'procurement-ready',
    lastVerified: '9 May 2026, 10:23 AM',
    certificates: [
      { name: 'NHIA', status: 'active', expiryDate: '20 Feb 2027' },
      { name: 'PCC', status: 'active', expiryDate: '15 Jan 2027' },
      { name: 'NSITF', status: 'active', expiryDate: '10 Dec 2026' },
      { name: 'FIRS', status: 'active', expiryDate: '25 Nov 2026' },
      { name: 'BPP', status: 'active', expiryDate: '08 Apr 2027' },
      { name: 'ITF', status: 'active', expiryDate: '12 Jan 2027' },
    ],
  },
  {
    rcNumber: 'RC9876543',
    companyName: 'Alpha Services Ltd',
    score: 28,
    status: 'ineligible',
    lastVerified: '9 May 2026, 10:23 AM',
    certificates: [
      { name: 'NHIA', status: 'expired', expiryDate: '15 Mar 2026' },
      { name: 'PCC', status: 'expired', expiryDate: '20 Apr 2026' },
      { name: 'NSITF', status: 'expiring', expiryDate: '12 May 2026' },
      { name: 'FIRS', status: 'active', expiryDate: '03 Jun 2026' },
      { name: 'BPP', status: 'active', expiryDate: '12 Oct 2026' },
      { name: 'ITF', status: 'expired', expiryDate: '05 Apr 2026' },
    ],
  },
];

export const mockPrequalification: PrequalificationApplicant[] = [
  {
    id: 'pq-1',
    companyName: 'TechBuild Nigeria Ltd',
    rcNumber: 'RC1234567',
    score: 73,
    status: 'attention-required',
    submittedAt: '8 May 2026, 11:00 AM',
  },
  {
    id: 'pq-2',
    companyName: 'BuildCo Construction Ltd',
    rcNumber: 'RC7654321',
    score: 92,
    status: 'procurement-ready',
    submittedAt: '7 May 2026, 9:30 AM',
    reviewedAt: '7 May 2026, 4:15 PM',
  },
  {
    id: 'pq-3',
    companyName: 'Alpha Services Ltd',
    rcNumber: 'RC9876543',
    score: 28,
    status: 'ineligible',
    submittedAt: '6 May 2026, 2:45 PM',
  },
];

// ─── Partner portal ─────────────────────────────────────────────────────────

export const mockPartnerClients: PartnerClient[] = [
  {
    id: 'client-1',
    companyName: 'TechBuild Nigeria Ltd',
    rcNumber: 'RC1234567',
    score: 73,
    status: 'attention',
    activeCertificates: 5,
    totalCertificates: 6,
    nextExpiry: 'NSITF',
    daysToExpiry: 6,
    monthlyFee: 45000,
  },
  {
    id: 'client-2',
    companyName: 'BuildCo Construction Ltd',
    rcNumber: 'RC7654321',
    score: 92,
    status: 'healthy',
    activeCertificates: 6,
    totalCertificates: 6,
    nextExpiry: 'FIRS',
    daysToExpiry: 89,
    monthlyFee: 65000,
  },
  {
    id: 'client-3',
    companyName: 'Alpha Services Ltd',
    rcNumber: 'RC9876543',
    score: 28,
    status: 'critical',
    activeCertificates: 2,
    totalCertificates: 6,
    nextExpiry: 'NHIA',
    daysToExpiry: -55,
    monthlyFee: 45000,
  },
  {
    id: 'client-4',
    companyName: 'ProServe Engineering',
    rcNumber: 'RC1122334',
    score: 88,
    status: 'healthy',
    activeCertificates: 6,
    totalCertificates: 6,
    nextExpiry: 'PCC',
    daysToExpiry: 112,
    monthlyFee: 55000,
  },
  {
    id: 'client-5',
    companyName: 'Delta Logistics Ltd',
    rcNumber: 'RC5566778',
    score: 65,
    status: 'attention',
    activeCertificates: 4,
    totalCertificates: 6,
    nextExpiry: 'ITF',
    daysToExpiry: 18,
    monthlyFee: 45000,
  },
];

export const mockPartnerAnalytics: PartnerAnalytics = {
  revenueTrend: [
    { month: 'Nov', revenue: 185000, clients: 18 },
    { month: 'Dec', revenue: 210000, clients: 21 },
    { month: 'Jan', revenue: 235000, clients: 23 },
    { month: 'Feb', revenue: 255000, clients: 24 },
    { month: 'Mar', revenue: 245000, clients: 23 },
    { month: 'Apr', revenue: 275000, clients: 25 },
  ],
  complianceDistribution: [
    { name: 'Healthy', value: 12, color: 'rgb(31, 193, 107)' },
    { name: 'Attention', value: 8, color: '#FF3000' },
    { name: 'Critical', value: 5, color: 'rgb(251, 55, 72)' },
  ],
  expiryTimeline: [
    { period: 'Next 7 days', count: 8 },
    { period: '8-14 days', count: 12 },
    { period: '15-30 days', count: 15 },
    { period: '31-60 days', count: 22 },
    { period: '60+ days', count: 35 },
  ],
  certificateTypes: [
    { name: 'NHIA', renewals: 6 },
    { name: 'PCC', renewals: 8 },
    { name: 'NSITF', renewals: 5 },
    { name: 'FIRS', renewals: 7 },
    { name: 'BPP', renewals: 4 },
    { name: 'ITF', renewals: 3 },
  ],
  kpi: {
    monthlyRevenue: 275000,
    monthlyRevenueDeltaPct: 12,
    activeClients: 25,
    activeClientsDelta: 4,
    avgComplianceScore: 78,
    avgComplianceScoreDelta: -3,
    renewalsThisMonth: 33,
    renewalsPendingAction: 8,
  },
};

// ─── User & settings ────────────────────────────────────────────────────────

export const mockUserProfile: UserProfile = {
  id: 'user-1',
  fullName: 'Adaeze Okeke',
  email: 'adaeze@techbuild.ng',
  phone: '+234 803 555 0123',
  companyName: 'TechBuild Nigeria Ltd',
  rcNumber: 'RC1234567',
  role: 'business',
};

export const mockNotificationPreferences: NotificationPreferences = {
  emailAlerts: true,
  smsAlerts: false,
  pushAlerts: true,
  weeklyDigest: true,
  expiryReminderDays: [30, 14, 7, 1],
};
