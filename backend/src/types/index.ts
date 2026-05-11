import type { Request } from 'express';
import type { Role } from '../config/constants';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string;        // user_id
  email: string;
  role: Role;
  company_id: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── API Response envelope ────────────────────────────────────────────────────

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ─── Database row types (snake_case matches PostgreSQL) ──────────────────────

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: Role;
  company_id: string | null;
  status: 'active' | 'suspended' | 'deleted';
  mfa_enabled: boolean;
  mfa_secret: string | null;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CompanyRow {
  id: string;
  name: string;
  rc_number: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  company_size: string | null;
  industry: string | null;
  website: string | null;
  subscription_tier: string;
  status: 'active' | 'suspended' | 'deleted';
  verified: boolean;
  verification_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CertificateRow {
  id: string;
  company_id: string;
  cert_type: string;
  cert_number: string;
  issuing_authority: string | null;
  issued_date: Date | null;
  expiry_date: Date | null;
  status: 'active' | 'expiring' | 'expired' | 'pending' | 'rejected';
  verification_method: 'api' | 'manual' | 'document' | 'batch' | null;
  document_url: string | null;
  document_hash: string | null;
  verification_data: Record<string, unknown> | null;
  verified_by: string | null;
  verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ComplianceScoreRow {
  id: string;
  company_id: string;
  component_a: number;
  component_b: number;
  component_c: number;
  total_score: number;
  procurement_ready: boolean;
  last_calculated: Date | null;
  calculation_details: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionRow {
  id: string;
  company_id: string;
  tier: string;
  monthly_amount: number | null;
  annual_amount: number | null;
  billing_cycle: 'monthly' | 'annual' | null;
  paystack_customer_code: string | null;
  paystack_authorization_code: string | null;
  last_payment_reference: string | null;
  last_payment_date: Date | null;
  next_billing_date: Date | null;
  status: 'active' | 'paused' | 'cancelled' | 'past_due';
  started_at: Date;
  ended_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuditRow {
  id: string;
  user_id: string | null;
  company_id: string | null;
  action: string;
  resource: string | null;
  resource_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  changes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status: 'success' | 'failure';
  error_message: string | null;
  created_at: Date;
}

export interface ReportRow {
  id: string;
  company_id: string;
  report_type: 'compliance' | 'audit' | 'pre_qual';
  generated_by: string | null;
  pdf_url: string | null;
  pdf_hash: string | null;
  included_certificates: string[];
  compliance_score: number | null;
  generated_at: Date;
  valid_until: Date | null;
  created_at: Date;
}
