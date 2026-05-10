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

import type { ClientCertificate } from './types';

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

// ─── Client certificate data for partner portal ─────────────────────────────────

export const mockClientCertificates: Record<string, ClientCertificate[]> = {
  'client-1': [
    {
      id: 'cert-1-1',
      name: 'National Health Insurance Authority Certificate',
      shortName: 'NHIA',
      status: 'active',
      expiryDate: '15 Jan 2027',
      daysToExpiry: 251,
      certificateNumber: 'NHIA/2026/FCT/AB12345678',
      isApiVerified: true,
      issuingAuthority: 'National Health Insurance Authority',
      issuedDate: '15 Jan 2026',
    },
    {
      id: 'cert-1-2',
      name: 'Pension Clearance Certificate',
      shortName: 'PCC',
      status: 'expiring-urgent',
      expiryDate: '15 May 2026',
      daysToExpiry: 6,
      certificateNumber: 'PCC/2025/LAG/CD98765432',
      isApiVerified: true,
      issuingAuthority: 'National Pension Commission',
      issuedDate: '15 May 2025',
    },
    {
      id: 'cert-1-3',
      name: 'Nigeria Social Insurance Trust Fund',
      shortName: 'NSITF',
      status: 'expiring-urgent',
      expiryDate: '15 May 2026',
      daysToExpiry: 6,
      certificateNumber: 'NSITF/2025/EF45612378',
      isApiVerified: false,
      issuingAuthority: 'Nigeria Social Insurance Trust Fund',
      issuedDate: '15 May 2025',
    },
    {
      id: 'cert-1-4',
      name: 'Federal Inland Revenue Service Tax Clearance',
      shortName: 'FIRS TCC',
      status: 'active',
      expiryDate: '14 Nov 2026',
      daysToExpiry: 189,
      certificateNumber: 'TCC/2026/LAG/GH78945612',
      isApiVerified: true,
      issuingAuthority: 'Federal Inland Revenue Service',
      issuedDate: '14 Nov 2025',
    },
    {
      id: 'cert-1-5',
      name: 'Bureau of Public Procurement Certificate',
      shortName: 'BPP',
      status: 'active',
      expiryDate: '16 Mar 2027',
      daysToExpiry: 312,
      certificateNumber: 'BPP/2026/IJ12378945',
      isApiVerified: true,
      issuingAuthority: 'Bureau of Public Procurement',
      issuedDate: '16 Mar 2026',
    },
    {
      id: 'cert-1-6',
      name: 'Industrial Training Fund Certificate',
      shortName: 'ITF',
      status: 'active',
      expiryDate: '18 Dec 2026',
      daysToExpiry: 253,
      certificateNumber: 'ITF/2026/KL96325874',
      isApiVerified: true,
      issuingAuthority: 'Industrial Training Fund',
      issuedDate: '18 Dec 2025',
    },
  ],
  'client-2': [
    {
      id: 'cert-2-1',
      name: 'National Health Insurance Authority Certificate',
      shortName: 'NHIA',
      status: 'active',
      expiryDate: '20 Feb 2027',
      daysToExpiry: 287,
      certificateNumber: 'NHIA/2026/LAG/XY98765432',
      isApiVerified: true,
      issuingAuthority: 'National Health Insurance Authority',
      issuedDate: '20 Feb 2026',
    },
    {
      id: 'cert-2-2',
      name: 'Pension Clearance Certificate',
      shortName: 'PCC',
      status: 'active',
      expiryDate: '15 Jan 2027',
      daysToExpiry: 251,
      certificateNumber: 'PCC/2026/ABU/EF12345678',
      isApiVerified: true,
      issuingAuthority: 'National Pension Commission',
      issuedDate: '15 Jan 2026',
    },
    {
      id: 'cert-2-3',
      name: 'Nigeria Social Insurance Trust Fund',
      shortName: 'NSITF',
      status: 'active',
      expiryDate: '10 Dec 2026',
      daysToExpiry: 245,
      certificateNumber: 'NSITF/2026/LAG/GH45678901',
      isApiVerified: true,
      issuingAuthority: 'Nigeria Social Insurance Trust Fund',
      issuedDate: '10 Dec 2025',
    },
    {
      id: 'cert-2-4',
      name: 'Federal Inland Revenue Service Tax Clearance',
      shortName: 'FIRS TCC',
      status: 'active',
      expiryDate: '25 Nov 2026',
      daysToExpiry: 200,
      certificateNumber: 'TCC/2026/LAG/IJ23456789',
      isApiVerified: true,
      issuingAuthority: 'Federal Inland Revenue Service',
      issuedDate: '25 Nov 2025',
    },
    {
      id: 'cert-2-5',
      name: 'Bureau of Public Procurement Certificate',
      shortName: 'BPP',
      status: 'active',
      expiryDate: '08 Apr 2027',
      daysToExpiry: 335,
      certificateNumber: 'BPP/2026/ABU/KL34567890',
      isApiVerified: true,
      issuingAuthority: 'Bureau of Public Procurement',
      issuedDate: '08 Apr 2026',
    },
    {
      id: 'cert-2-6',
      name: 'Industrial Training Fund Certificate',
      shortName: 'ITF',
      status: 'active',
      expiryDate: '12 Jan 2027',
      daysToExpiry: 248,
      certificateNumber: 'ITF/2026/ABU/MN78901234',
      isApiVerified: true,
      issuingAuthority: 'Industrial Training Fund',
      issuedDate: '12 Jan 2026',
    },
  ],
};

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
    nextExpiry: '15 May 2026',
    daysToExpiry: 6,
    monthlyFee: 45000,
    sector: 'Construction',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'client-2',
    companyName: 'BuildCo Construction Ltd',
    rcNumber: 'RC7654321',
    score: 92,
    status: 'healthy',
    activeCertificates: 6,
    totalCertificates: 6,
    nextExpiry: '15 Jan 2027',
    daysToExpiry: 251,
    monthlyFee: 65000,
    sector: 'Construction',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'client-3',
    companyName: 'Alpha Services Ltd',
    rcNumber: 'RC9876543',
    score: 28,
    status: 'critical',
    activeCertificates: 2,
    totalCertificates: 6,
    nextExpiry: '15 Mar 2026',
    daysToExpiry: -55,
    monthlyFee: 45000,
    sector: 'Professional Services',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'client-4',
    companyName: 'ProServe Engineering',
    rcNumber: 'RC1122334',
    score: 88,
    status: 'healthy',
    activeCertificates: 6,
    totalCertificates: 6,
    nextExpiry: '20 Aug 2026',
    daysToExpiry: 133,
    monthlyFee: 55000,
    sector: 'Engineering',
    createdAt: '2024-04-05T11:15:00Z',
  },
  {
    id: 'client-5',
    companyName: 'Delta Logistics Ltd',
    rcNumber: 'RC5566778',
    score: 65,
    status: 'attention',
    activeCertificates: 4,
    totalCertificates: 6,
    nextExpiry: '27 May 2026',
    daysToExpiry: 18,
    monthlyFee: 45000,
    sector: 'Logistics',
    createdAt: '2024-05-12T16:45:00Z',
  },
  {
    id: 'client-6',
    companyName: 'GreenEnergy Solutions',
    rcNumber: 'RC9988776',
    score: 95,
    status: 'healthy',
    activeCertificates: 6,
    totalCertificates: 6,
    nextExpiry: '30 Dec 2026',
    daysToExpiry: 265,
    monthlyFee: 50000,
    sector: 'Energy',
    createdAt: '2024-06-01T08:30:00Z',
  },
  {
    id: 'client-7',
    companyName: 'MediCare Health Services',
    rcNumber: 'RC4455667',
    score: 82,
    status: 'healthy',
    activeCertificates: 5,
    totalCertificates: 6,
    nextExpiry: '10 Jul 2026',
    daysToExpiry: 62,
    monthlyFee: 60000,
    sector: 'Healthcare',
    createdAt: '2024-07-20T13:20:00Z',
  },
  {
    id: 'client-8',
    companyName: 'FinTech Innovations Ltd',
    rcNumber: 'RC3344556',
    score: 78,
    status: 'healthy',
    activeCertificates: 6,
    totalCertificates: 6,
    nextExpiry: '25 Sep 2026',
    daysToExpiry: 169,
    monthlyFee: 70000,
    sector: 'Technology',
    createdAt: '2024-08-15T10:00:00Z',
  },
  {
    id: 'client-9',
    companyName: 'AgriGrow Nigeria',
    rcNumber: 'RC2233445',
    score: 45,
    status: 'critical',
    activeCertificates: 3,
    totalCertificates: 6,
    nextExpiry: '20 Apr 2026',
    daysToExpiry: -19,
    monthlyFee: 40000,
    sector: 'Agriculture',
    createdAt: '2024-09-10T14:00:00Z',
  },
  {
    id: 'client-10',
    companyName: 'EduPrime Schools Ltd',
    rcNumber: 'RC7788990',
    score: 89,
    status: 'healthy',
    activeCertificates: 6,
    totalCertificates: 6,
    nextExpiry: '15 Oct 2026',
    daysToExpiry: 189,
    monthlyFee: 55000,
    sector: 'Education',
    createdAt: '2024-10-05T09:30:00Z',
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

// ─── Activity Tracking ────────────────────────────────────────────────────────

export interface ClientActivity {
  id: string;
  clientId: string;
  clientName: string;
  type: 'certificate_uploaded' | 'certificate_renewed' | 'certificate_expiring' | 'certificate_expired' | 
        'score_change' | 'permission_updated' | 'client_added' | 'client_removed' | 
        'report_generated' | 'reminder_sent' | 'api_verification_failed';
  severity: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  daysAgo: number;
  metadata?: {
    certificateType?: string;
    oldScore?: number;
    newScore?: number;
    permissions?: string[];
    reportType?: string;
  };
}

export const mockClientActivities: ClientActivity[] = [
  {
    id: 'act-1',
    clientId: 'client-1',
    clientName: 'BuildRight Construction Ltd',
    type: 'certificate_renewed',
    severity: 'success',
    title: 'NHIA Certificate Renewed',
    description: 'National Health Insurance Authority certificate renewed successfully',
    timestamp: '2026-01-15T10:30:00Z',
    daysAgo: 1,
    metadata: { certificateType: 'NHIA' },
  },
  {
    id: 'act-2',
    clientId: 'client-1',
    clientName: 'BuildRight Construction Ltd',
    type: 'score_change',
    severity: 'success',
    title: 'Compliance Score Improved',
    description: 'Score increased from 78 to 85 after certificate renewal',
    timestamp: '2026-01-15T10:30:00Z',
    daysAgo: 1,
    metadata: { oldScore: 78, newScore: 85 },
  },
  {
    id: 'act-3',
    clientId: 'client-2',
    clientName: 'ProServe Consulting',
    type: 'certificate_expiring',
    severity: 'warning',
    title: 'PCC Expiring Soon',
    description: 'Pension Clearance Certificate expires in 25 days',
    timestamp: '2026-01-10T14:20:00Z',
    daysAgo: 6,
    metadata: { certificateType: 'PCC' },
  },
  {
    id: 'act-4',
    clientId: 'client-3',
    clientName: 'EcoTech Engineering',
    type: 'certificate_uploaded',
    severity: 'success',
    title: 'NSITF Certificate Uploaded',
    description: 'Employee Compensation Certificate uploaded and verified',
    timestamp: '2026-01-08T09:15:00Z',
    daysAgo: 8,
    metadata: { certificateType: 'NSITF' },
  },
  {
    id: 'act-5',
    clientId: 'client-4',
    clientName: 'SwiftLogistics Nigeria',
    type: 'permission_updated',
    severity: 'info',
    title: 'Permissions Updated',
    description: 'View certificates and Generate reports permissions granted',
    timestamp: '2026-01-05T16:45:00Z',
    daysAgo: 11,
    metadata: { permissions: ['view_certificates', 'generate_reports'] },
  },
  {
    id: 'act-6',
    clientId: 'client-5',
    clientName: 'GreenEnergy Solutions',
    type: 'certificate_expired',
    severity: 'critical',
    title: 'ITF Certificate Expired',
    description: 'Industrial Training Fund certificate expired on 2026-01-01',
    timestamp: '2026-01-01T00:00:00Z',
    daysAgo: 15,
    metadata: { certificateType: 'ITF' },
  },
  {
    id: 'act-7',
    clientId: 'client-6',
    clientName: 'MedCare Health Systems',
    type: 'client_added',
    severity: 'success',
    title: 'New Client Onboarded',
    description: 'Client successfully added to partner portal',
    timestamp: '2025-12-28T11:30:00Z',
    daysAgo: 19,
  },
  {
    id: 'act-8',
    clientId: 'client-1',
    clientName: 'BuildRight Construction Ltd',
    type: 'report_generated',
    severity: 'info',
    title: 'Compliance Report Generated',
    description: 'Monthly compliance report generated for January 2026',
    timestamp: '2025-12-20T14:00:00Z',
    daysAgo: 27,
    metadata: { reportType: 'monthly_compliance' },
  },
  {
    id: 'act-9',
    clientId: 'client-7',
    clientName: 'TechNova Innovations',
    type: 'reminder_sent',
    severity: 'info',
    title: 'Expiry Reminder Sent',
    description: 'Automatic reminder sent for certificate expiry',
    timestamp: '2025-12-15T09:00:00Z',
    daysAgo: 32,
    metadata: { certificateType: 'PCC' },
  },
  {
    id: 'act-10',
    clientId: 'client-8',
    clientName: 'AgriNigeria Farms',
    type: 'api_verification_failed',
    severity: 'warning',
    title: 'API Verification Failed',
    description: 'NHIA certificate verification failed - manual review required',
    timestamp: '2025-12-10T13:20:00Z',
    daysAgo: 37,
    metadata: { certificateType: 'NHIA' },
  },
];

export function getActivitiesForClient(clientId: string): ClientActivity[] {
  return mockClientActivities.filter(activity => activity.clientId === clientId);
}

export function getRecentActivities(limit: number = 10): ClientActivity[] {
  return mockClientActivities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
