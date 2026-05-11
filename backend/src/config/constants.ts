// Certificate types the platform tracks
export const CERT_TYPES = ['nhia', 'pcc', 'nsitf', 'firs', 'bpp', 'itf'] as const;
export type CertType = (typeof CERT_TYPES)[number];

// User roles
export const ROLES = ['contractor', 'mda', 'consultant', 'hmo', 'admin'] as const;
export type Role = (typeof ROLES)[number];

// Subscription tiers (aligned with PRD pricing)
export const SUBSCRIPTION_TIERS = ['starter', 'business', 'enterprise'] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

// PRD pricing in NGN kobo (Paystack uses kobo)
export const PLAN_PRICES = {
  starter:    { monthly: 0,        annual: 0 },
  business:   { monthly: 700000,   annual: 6000000 },   // ₦7k/mo, ₦60k/yr
  enterprise: { monthly: 1800000,  annual: 20000000 },  // ₦18k/mo, ₦200k/yr
} as const;

// Compliance score components (PRD spec)
export const SCORE_WEIGHTS = {
  coverage:  50,  // Component A — % of 6 certs present
  freshness: 30,  // Component B — % not expiring within 30 days
  quality:   20,  // Component C — % API-verified
} as const;

// Expiry warning thresholds (days)
export const EXPIRY_THRESHOLDS = {
  critical: 7,
  urgent: 14,
  soon: 30,
} as const;

// Procurement-ready threshold
export const PROCUREMENT_READY_SCORE = 80;

// Rate limit windows
export const RATE_LIMITS = {
  loginWindowMs: 15 * 60 * 1000,  // 15 minutes
  loginMax: 5,
  apiWindowMs: 60 * 1000,          // 1 minute
  apiMax: 100,
  uploadWindowMs: 60 * 60 * 1000,  // 1 hour
  uploadMax: 10,
} as const;
