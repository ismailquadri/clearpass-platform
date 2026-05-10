/**
 * Single source of truth for backend endpoints.
 *
 * When the backend team hands over the endpoint list, update only this file —
 * domain modules use these constants, not hardcoded paths.
 */

export const ENDPOINTS = {
  // Auth (placeholder — wire when auth API is provided)
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  // Certificates
  certificates: {
    list: '/certificates',
    detail: (id: string) => `/certificates/${id}`,
    upload: '/certificates',
    delete: (id: string) => `/certificates/${id}`,
    download: (id: string) => `/certificates/${id}/download`,
    exportAll: '/certificates/export',
  },

  // Alerts
  alerts: {
    list: '/alerts',
    markRead: (id: string) => `/alerts/${id}/read`,
    markAllRead: '/alerts/read-all',
    dismiss: (id: string) => `/alerts/${id}`,
  },

  // Activity log
  activity: {
    list: '/activity',
  },

  // Dashboard
  dashboard: {
    snapshot: '/dashboard',
  },

  // MDA portal
  mda: {
    verify: (rcNumber: string) => `/mda/verify/${rcNumber}`,
    prequalification: '/mda/prequalification',
    approve: (id: string) => `/mda/prequalification/${id}/approve`,
    reject: (id: string) => `/mda/prequalification/${id}/reject`,
  },

  // Partner portal
  partner: {
    clients: '/partner/clients',
    addClient: '/partner/clients',
    client: (id: string) => `/partner/clients/${id}`,
    analytics: '/partner/analytics',
  },

  // Settings
  settings: {
    profile: '/settings/profile',
    notifications: '/settings/notifications',
  },

  // Reports
  reports: {
    generate: '/reports/generate',
    download: (id: string) => `/reports/${id}/download`,
  },
} as const;
