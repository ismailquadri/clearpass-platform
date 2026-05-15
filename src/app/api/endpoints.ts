/**
 * Single source of truth for backend endpoints.
 *
 * When the backend team hands over the endpoint list, update only this file —
 * domain modules use these constants, not hardcoded paths.
 */

export const ENDPOINTS = {
  // Auth
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    logoutAll: '/api/auth/logout-all',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
    sessions: '/api/auth/sessions',
  },

  // MFA
  mfa: {
    setup: '/api/mfa/setup',
    enable: '/api/mfa/enable',
    disable: '/api/mfa/disable',
    verify: '/api/mfa/verify',
  },

  // Password Reset
  passwordReset: {
    request: '/api/password-reset/request',
    reset: '/api/password-reset/reset',
    validate: (token: string) => `/api/password-reset/validate/${token}`,
  },

  // Certificates
  certificates: {
    list: '/api/certificates',
    detail: (id: string) => `/api/certificates/${id}`,
    upload: '/api/certificates',
    delete: (id: string) => `/api/certificates/${id}`,
    download: (id: string) => `/api/certificates/${id}/download`,
    exportAll: '/api/certificates/export',
  },

  // Alerts
  alerts: {
    list: '/api/alerts',
    markRead: (id: string) => `/api/alerts/${id}/read`,
    markAllRead: '/api/alerts/read-all',
    dismiss: (id: string) => `/api/alerts/${id}`,
  },

  // Activity log
  activity: {
    list: '/api/activity',
  },

  // Dashboard
  dashboard: {
    snapshot: '/api/dashboard',
  },

  // MDA portal
  mda: {
    verify: (rcNumber: string) => `/api/mda/verify/${rcNumber}`,
    prequalification: '/api/mda/prequalification',
    approve: (id: string) => `/api/mda/prequalification/${id}/approve`,
    reject: (id: string) => `/api/mda/prequalification/${id}/reject`,
  },

  // Partner portal
  partner: {
    clients: '/api/partner/clients',
    addClient: '/api/partner/clients',
    client: (id: string) => `/api/partner/clients/${id}`,
    analytics: '/api/partner/analytics',
    permissions: (id: string) => `/api/partner/clients/${id}/permissions`,
  },

  // Settings
  settings: {
    profile: '/api/settings/profile',
    notifications: '/api/settings/notifications',
  },

  // Reports
  reports: {
    generate: '/api/reports/generate',
    list: '/api/reports',
    download: (id: string) => `/api/reports/${id}/download`,
  },

  // MDA reports (verification-facing)
  mdaReports: {
    list: '/api/mda/reports',
    generateVerification: '/api/mda/reports/verification',
    download: (id: string) => `/api/mda/reports/${id}/download`,
    live: (token: string) => `/api/public/mda-verification/${token}`,
  },

  // Subscriptions
  subscriptions: {
    list: '/api/subscriptions',
    current: '/api/subscriptions/current',
    upgrade: '/api/subscriptions/upgrade',
    cancel: '/api/subscriptions/cancel',
    history: '/api/subscriptions/history',
  },

  // Admin
  admin: {
    health: '/api/admin/health',
    statistics: '/api/admin/statistics',
    users: '/api/admin/users',
    user: (id: string) => `/api/admin/users/${id}`,
    companies: '/api/admin/companies',
    company: (id: string) => `/api/admin/companies/${id}`,
    government: {
      verifyCertificate: '/api/admin/government/verify-certificate',
      verifyCompany: '/api/admin/government/verify-company',
      batchVerify: '/api/admin/government/batch-verify',
    },
  },

  // Webhooks
  webhooks: {
    paystack: '/api/webhooks/paystack',
  },
} as const;
