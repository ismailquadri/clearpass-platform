export const ROUTES = {
  OVERVIEW: 'overview',
  CERTIFICATES: 'certificates',
  VERIFY: 'verify',
  ACTIVITY: 'activity',
  REPORTS: 'reports',
  ALERTS: 'alerts',
  SETTINGS: 'settings',
} as const;

export const DASHBOARD_STATES = {
  HEALTHY: 'Healthy',
  ATTENTION_REQUIRED: 'Attention Required',
  CRITICAL: 'Critical',
  NON_COMPLIANT: 'Non-Compliant',
  NEW_REGISTRATION: 'New Registration',
  PENDING_VERIFICATION: 'Pending Verification',
} as const;

export const PORTALS = {
  BUSINESS: 'Business',
  MDA: 'MDA',
  PARTNER: 'Partner',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type DashboardStateLabel = (typeof DASHBOARD_STATES)[keyof typeof DASHBOARD_STATES];
export type Portal = (typeof PORTALS)[keyof typeof PORTALS];
