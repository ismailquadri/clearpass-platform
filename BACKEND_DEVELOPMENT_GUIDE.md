# ClearPass Backend Development Guide

## Complete Technical Specification & Team Handbook

**Version:** 1.0  
**Date:** May 9, 2026  
**Status:** Ready for Backend Team Implementation  
**Target Completion:** Week 0 (Launch Week)

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Specification](#api-specification)
6. [Authentication & Security](#authentication--security)
7. [Payment Integration (Paystack)](#payment-integration-paystack)
8. [Government API Integration](#government-api-integration)
9. [Deployment & Infrastructure](#deployment--infrastructure)
10. [Testing Strategy](#testing-strategy)
11. [Success Criteria & Metrics](#success-criteria--metrics)
12. [Rollout Timeline](#rollout-timeline)
13. [Team Responsibilities](#team-responsibilities)
14. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## EXECUTIVE SUMMARY

### What We're Building

ClearPass is a **federal contractor compliance verification platform** for Nigeria. It enables:

- **Contractors** to manage 6 compliance certificates, get a real-time health score, and submit bid-ready reports
- **Government MDAs** to verify contractor compliance in real-time for procurement
- **Consultants** to manage multiple contractor clients and generate referral revenue

### Current Status

- ✅ **Frontend:** Production-grade React UI (3 portals: Contractor, MDA, Partner)
- ✅ **Design:** Figma design system complete
- ✅ **Product:** PRD v2.2 finalized
- ✅ **Go-To-Market:** GTM v3.0 complete
- ❌ **Backend:** TODO (this document)

### What Backend Team Is Building

A **REST API** that:

1. Manages user authentication (registration, login, JWT tokens)
2. Stores real certificate data in PostgreSQL
3. Calculates compliance health scores
4. Processes Paystack payments (subscription management)
5. Scaffolds government API integrations (NHIA, CAC, FIRS)
6. Logs all user actions for audit trails
7. Generates PDF reports
8. Sends email notifications

### Scope for This Phase (Week -2 to 0)

**MVP Backend** = Enough to make the frontend work with real data.

**NOT included yet:**

- Full government API integrations (scaffold only)
- SMS notifications (email only)
- Advanced analytics
- White-label features
- Mobile app APIs

---

## ARCHITECTURE OVERVIEW

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  (3 Portals: Contractor, MDA, Partner)                      │
│  Deployed: Vercel (clearpass-seven.vercel.app)              │
└────────────────────┬────────────────────────────────────────┘
                     │ (HTTPS API Calls)
                     │
        ┌────────────▼─────────────────┐
        │   API GATEWAY / LOAD BALANCER │
        │   (Nginx / Railway managed)   │
        └────────────┬──────────────────┘
                     │
    ┌────────────────┼────────────────────┐
    │                │                    │
┌───▼────┐    ┌─────▼────┐      ┌────────▼────┐
│ AUTH   │    │ BUSINESS │      │ INTEGRATIONS│
│SERVICE │    │ LOGIC    │      │ SERVICE     │
│        │    │          │      │             │
│• JWT   │    │• Certs   │      │• Gov APIs   │
│• OAuth │    │• Scores  │      │• Paystack   │
│• MFA   │    │• Reports │      │• Email      │
└───┬────┘    └─────┬────┘      └────────┬────┘
    │               │                    │
    └───────────────┼────────────────────┘
                    │
         ┌──────────▼──────────┐
         │   DATA LAYER        │
         │  (PostgreSQL)       │
         │                     │
         │ • Users             │
         │ • Companies         │
         │ • Certificates      │
         │ • Compliance Scores │
         │ • Subscriptions     │
         │ • Audit Trail       │
         └──────────────────────┘
```

### Request/Response Flow

```
1. FRONTEND REQUEST
   POST /api/auth/login
   {
     "email": "amaka@techbuild.com",
     "password": "password123"
   }

2. BACKEND VALIDATION
   • Hash password, compare with database
   • Generate JWT token
   • Return token + user data

3. FRONTEND STORES TOKEN
   localStorage.setItem('token', jwt)

4. SUBSEQUENT REQUESTS (with auth)
   GET /api/certificates
   Headers: { Authorization: "Bearer jwt_token" }

5. BACKEND VALIDATION
   • Decode JWT
   • Verify signature
   • Check user permissions
   • Return data

6. FRONTEND DISPLAYS
   • Parse response
   • Update React state
   • Re-render UI
```

---

## TECHNOLOGY STACK

### Required Technologies

| Layer                  | Technology     | Version   | Why                                    |
| ---------------------- | -------------- | --------- | -------------------------------------- |
| **Runtime**            | Node.js        | 18+       | Fast, async, JavaScript                |
| **Framework**          | Express.js     | 4.18+     | Lightweight, mature, industry standard |
| **Database**           | PostgreSQL     | 14+       | Relational, reliable, JSONB support    |
| **Authentication**     | JWT            | —         | Stateless, scalable, secure            |
| **Password Hashing**   | bcryptjs       | 2.4.3+    | Industry standard                      |
| **Environment**        | dotenv         | 16+       | Config management                      |
| **HTTP Client**        | axios          | 1.4+      | API calls to gov services              |
| **Email**              | Postmark SDK   | 3.0+      | Email delivery                         |
| **Payment**            | Paystack SDK   | via axios | Payment processing                     |
| **Deployment**         | Railway/Render | —         | Free tier, managed Postgres            |
| **Database Migration** | Knex.js        | 2.5+      | Schema versioning                      |
| **Validation**         | Joi / Zod      | —         | Input validation                       |

### Recommended Project Structure

```
clearpass-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # PostgreSQL connection
│   │   │   ├── env.js               # Environment variables
│   │   │   └── constants.js         # App constants
│   │   │
│   │   ├── models/
│   │   │   ├── User.js              # User data model
│   │   │   ├── Company.js           # Company/Organization model
│   │   │   ├── Certificate.js       # Certificate model
│   │   │   ├── ComplianceScore.js   # Score calculation
│   │   │   ├── Subscription.js      # Billing model
│   │   │   ├── AuditTrail.js        # Activity logging
│   │   │   └── index.js             # Export all models
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login, register, JWT
│   │   │   ├── certificateController.js # Cert management
│   │   │   ├── complianceController.js  # Score calculation
│   │   │   ├── subscriptionController.js # Payment handling
│   │   │   ├── reportController.js  # PDF generation
│   │   │   └── governmentController.js # Gov API calls
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth endpoints
│   │   │   ├── certificates.js      # Cert endpoints
│   │   │   ├── compliance.js        # Score endpoints
│   │   │   ├── subscriptions.js     # Payment endpoints
│   │   │   ├── reports.js           # Report endpoints
│   │   │   └── government.js        # Gov API endpoints
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   ├── logger.js            # Request logging
│   │   │   ├── validation.js        # Input validation
│   │   │   └── rateLimiter.js       # Rate limiting
│   │   │
│   │   ├── services/
│   │   │   ├── paystack.js          # Paystack integration
│   │   │   ├── email.js             # Email sending
│   │   │   ├── pdf.js               # PDF generation
│   │   │   ├── government.js        # Gov API calls
│   │   │   └── compliance.js        # Score calculation logic
│   │   │
│   │   ├── migrations/
│   │   │   ├── 001_create_users.js
│   │   │   ├── 002_create_companies.js
│   │   │   ├── 003_create_certificates.js
│   │   │   └── ...
│   │   │
│   │   ├── seeds/
│   │   │   ├── test-users.js
│   │   │   └── test-companies.js
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── calculations.js
│   │   │   └── logger.js
│   │   │
│   │   └── index.js                 # Main entry point
│   │
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   │
│   ├── .env.example                 # Environment template
│   ├── .env.test                    # Test environment
│   ├── .env.production              # Production env (secrets)
│   ├── package.json
│   ├── knexfile.js                  # Migration config
│   ├── docker-compose.yml           # Local dev setup
│   └── README.md                    # Setup instructions
│
├── frontend/                        # (Existing React app)
└── BACKEND_GUIDE.md                 # This file
```

---

## DATABASE SCHEMA

### Entity Relationship Diagram

```
┌──────────────────┐
│     USERS        │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ password (HASH)  │
│ first_name       │
│ last_name        │
│ role             │────────┐
│ company_id (FK)  │        │
│ created_at       │        │
│ updated_at       │        │
└──────────────────┘        │
         │                  │
         │ 1:M              │
         │              ┌───▼──────────────┐
         │              │    COMPANIES     │
         │              ├──────────────────┤
         │              │ id (PK)          │
         │              │ name             │
         │              │ rc_number        │
         │              │ email            │
         │              │ phone            │
         │              │ address          │
         │              │ company_size     │
         │              │ industry         │
         │              │ subscription_tier│
         │              │ status           │
         │              │ created_at       │
         │              └────┬─────────────┘
         │                   │
         │                   │ 1:M
         │              ┌────▼──────────────┐
         │              │  CERTIFICATES     │
         │              ├──────────────────┤
         │              │ id (PK)          │
         │              │ company_id (FK)  │
         │              │ cert_type        │
         │              │ cert_number      │
         │              │ issued_date      │
         │              │ expiry_date      │
         │              │ issuing_authority
         │              │ status           │
         │              │ document_url     │
         │              │ verification_data│
         │              │ created_at       │
         │              └────┬─────────────┘
         │                   │
         │                   │ 1:1
         │              ┌────▼──────────────────┐
         │              │ COMPLIANCE_SCORES     │
         │              ├───────────────────────┤
         │              │ id (PK)               │
         │              │ company_id (FK)      │
         │              │ score (0-100)        │
         │              │ component_a (0-50)   │
         │              │ component_b (0-30)   │
         │              │ component_c (0-20)   │
         │              │ procurement_ready    │
         │              │ last_calculated      │
         │              └──────────────────────┘
         │
         │ 1:M
         ├────────────────┐
         │                │
    ┌────▼────────────┐  ┌──▼──────────────┐
    │ SUBSCRIPTIONS   │  │  AUDIT_TRAIL    │
    ├─────────────────┤  ├─────────────────┤
    │ id (PK)         │  │ id (PK)         │
    │ user_id (FK)    │  │ user_id (FK)    │
    │ company_id (FK) │  │ company_id (FK) │
    │ tier            │  │ action          │
    │ start_date      │  │ resource        │
    │ end_date        │  │ changes         │
    │ amount_paid     │  │ ip_address      │
    │ paystack_ref    │  │ timestamp       │
    │ status          │  └─────────────────┘
    │ created_at      │
    └─────────────────┘
```

### SQL Schema (PostgreSQL)

```sql
-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL, -- 'contractor', 'mda', 'consultant', 'admin'
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'deleted'
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role ON users(role);

-- ========================================
-- COMPANIES TABLE
-- ========================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  rc_number VARCHAR(50) UNIQUE, -- CAC Registration Number
  bvn VARCHAR(20), -- Bank Verification Number (hashed)
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Nigeria',
  company_size VARCHAR(50), -- 'startup', 'small', 'medium', 'large', 'enterprise'
  industry VARCHAR(100),
  website VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'starter', -- 'starter', 'professional', 'enterprise'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'deleted'
  verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_companies_rc_number ON companies(rc_number);
CREATE INDEX idx_companies_subscription_tier ON companies(subscription_tier);
CREATE INDEX idx_companies_status ON companies(status);

-- ========================================
-- CERTIFICATES TABLE
-- ========================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  cert_type VARCHAR(50) NOT NULL, -- 'nhia', 'pcc', 'nsitf', 'firs', 'bpp', 'itf'
  cert_number VARCHAR(100) NOT NULL,
  issuing_authority VARCHAR(255),
  issued_date DATE,
  expiry_date DATE,
  status VARCHAR(50), -- 'active', 'expiring', 'expired', 'pending', 'rejected'
  verification_method VARCHAR(50), -- 'api', 'manual', 'document', 'batch'
  document_url VARCHAR(500), -- S3/CloudflareR2 URL
  document_hash VARCHAR(255), -- SHA-256 for tamper detection
  verification_data JSONB, -- Gov API response data
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  next_renewal_date DATE,
  renewal_cost DECIMAL(10, 2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_certificates_company_id ON certificates(company_id);
CREATE INDEX idx_certificates_cert_type ON certificates(cert_type);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_expiry_date ON certificates(expiry_date);

-- ========================================
-- COMPLIANCE_SCORES TABLE
-- ========================================
CREATE TABLE compliance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,

  -- Components (PRD specified)
  component_a INT DEFAULT 0, -- Coverage (0-50): % of required certs present
  component_b INT DEFAULT 0, -- Freshness (0-30): % of certs not expiring soon
  component_c INT DEFAULT 0, -- Quality (0-20): % of certs verified via API

  total_score INT DEFAULT 0, -- Sum of components (0-100)
  procurement_ready BOOLEAN DEFAULT FALSE, -- score >= 80 AND nhia active

  last_calculated TIMESTAMP,
  calculation_details JSONB, -- Detailed breakdown of score

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_compliance_scores_company_id ON compliance_scores(company_id);
CREATE INDEX idx_compliance_scores_total_score ON compliance_scores(total_score);
CREATE INDEX idx_compliance_scores_procurement_ready ON compliance_scores(procurement_ready);

-- ========================================
-- SUBSCRIPTIONS TABLE
-- ========================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Subscription details
  tier VARCHAR(50) NOT NULL, -- 'starter', 'professional', 'enterprise'
  monthly_amount DECIMAL(10, 2),
  annual_amount DECIMAL(10, 2),
  billing_cycle VARCHAR(50), -- 'monthly', 'annual'

  -- Payment info
  paystack_customer_code VARCHAR(100), -- For recurring charges
  paystack_authorization_code VARCHAR(100), -- For auto-renew
  last_payment_reference VARCHAR(100),
  last_payment_date TIMESTAMP,
  next_billing_date TIMESTAMP,

  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'cancelled', 'past_due'
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,

  -- Features (based on tier)
  max_profiles INT, -- Number of company profiles
  max_bulk_verifications INT DEFAULT 100, -- Per month
  api_access BOOLEAN DEFAULT FALSE,
  team_members INT DEFAULT 1,
  white_label BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_company_id ON subscriptions(company_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);

-- ========================================
-- AUDIT_TRAIL TABLE
-- ========================================
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,

  action VARCHAR(100) NOT NULL, -- 'login', 'cert_upload', 'cert_verify', 'payment', 'score_update'
  resource VARCHAR(100), -- 'user', 'certificate', 'company', 'subscription'
  resource_id UUID,

  old_values JSONB, -- Before change
  new_values JSONB, -- After change
  changes TEXT, -- Human-readable description

  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50), -- 'success', 'failure'
  error_message TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX idx_audit_trail_company_id ON audit_trail(company_id);
CREATE INDEX idx_audit_trail_created_at ON audit_trail(created_at);
CREATE INDEX idx_audit_trail_action ON audit_trail(action);

-- ========================================
-- GOVERNMENT_API_LOGS TABLE
-- ========================================
CREATE TABLE government_api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID REFERENCES certificates(id) ON DELETE SET NULL,

  api_endpoint VARCHAR(255), -- 'nhia', 'cac', 'firs', etc.
  request_type VARCHAR(50), -- 'verification', 'lookup', 'batch'
  request_payload JSONB,

  response_status INT, -- HTTP status code
  response_body JSONB,

  processing_time_ms INT, -- Latency
  success BOOLEAN,
  error_message TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gov_api_logs_certificate_id ON government_api_logs(certificate_id);
CREATE INDEX idx_gov_api_logs_api_endpoint ON government_api_logs(api_endpoint);
CREATE INDEX idx_gov_api_logs_created_at ON government_api_logs(created_at);

-- ========================================
-- REPORTS TABLE
-- ========================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  report_type VARCHAR(50), -- 'compliance', 'audit', 'pre_qual'
  generated_by UUID REFERENCES users(id),

  pdf_url VARCHAR(500), -- S3/CloudflareR2 URL
  pdf_hash VARCHAR(255),

  included_certificates TEXT[], -- Array of cert types
  compliance_score INT,
  generated_at TIMESTAMP NOT NULL,
  valid_until TIMESTAMP, -- Expiry for bid submission

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_company_id ON reports(company_id);
CREATE INDEX idx_reports_report_type ON reports(report_type);
```

---

## API SPECIFICATION

### Base URL

**Development:** `http://localhost:5000/api`  
**Staging:** `https://api-staging.clearpass.com.ng/api`  
**Production:** `https://api.clearpass.com.ng/api`

### Authentication Header

All protected endpoints require:

```
Authorization: Bearer {jwt_token}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Success Response Format

```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-05-09T10:30:00Z",
    "request_id": "uuid"
  }
}
```

---

## AUTHENTICATION ENDPOINTS

### 1. POST /auth/register

**Purpose:** Create a new user account

**Request:**

```json
{
  "email": "amaka@techbuild.com",
  "password": "SecurePassword123!",
  "first_name": "Amaka",
  "last_name": "Okoro",
  "phone": "+234 8012345678",
  "role": "contractor",
  "company_name": "TechBuild Nigeria Ltd",
  "rc_number": "RC1234567"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "amaka@techbuild.com",
      "first_name": "Amaka",
      "role": "contractor"
    },
    "company": {
      "id": "uuid",
      "name": "TechBuild Nigeria Ltd",
      "rc_number": "RC1234567"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Cases:**

- 400: Invalid email format
- 409: Email already exists
- 400: Password too weak

---

### 2. POST /auth/login

**Purpose:** Authenticate user and return JWT token

**Request:**

```json
{
  "email": "amaka@techbuild.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "amaka@techbuild.com",
      "role": "contractor",
      "company_id": "uuid"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 86400
  }
}
```

**Error Cases:**

- 401: Invalid credentials
- 429: Too many login attempts (rate limit)

---

### 3. POST /auth/refresh

**Purpose:** Get a new token using refresh token

**Request:**

```json
{
  "refresh_token": "..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 86400
  }
}
```

---

### 4. POST /auth/logout

**Purpose:** Invalidate current token

**Request:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## CERTIFICATE ENDPOINTS

### 5. POST /certificates

**Purpose:** Upload a new certificate

**Request (multipart/form-data):**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data

cert_type: "nhia"
cert_number: "NHIA/2026/FC123456"
issued_date: "2025-01-15"
expiry_date: "2027-01-15"
issuing_authority: "National Health Insurance Authority"
document: [PDF file]
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "cert_type": "nhia",
    "cert_number": "NHIA/2026/FC123456",
    "status": "pending",
    "document_url": "https://s3.aws.com/...",
    "created_at": "2026-05-09T10:30:00Z"
  }
}
```

---

### 6. GET /certificates

**Purpose:** List all certificates for a company

**Query Parameters:**

```
?status=active
&cert_type=nhia
&page=1
&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "certificates": [
      {
        "id": "uuid",
        "cert_type": "nhia",
        "cert_number": "...",
        "status": "active",
        "expiry_date": "2027-01-15",
        "days_to_expiry": 245
      }
    ],
    "pagination": {
      "total": 6,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

### 7. GET /certificates/:id

**Purpose:** Get details of a specific certificate

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "cert_type": "nhia",
    "cert_number": "NHIA/2026/FC123456",
    "issued_date": "2025-01-15",
    "expiry_date": "2027-01-15",
    "status": "active",
    "verification_method": "api",
    "verified_at": "2026-05-09T10:35:00Z",
    "verification_data": {
      "verified": true,
      "nhia_status": "active",
      "last_checked": "2026-05-09"
    }
  }
}
```

---

### 8. PUT /certificates/:id

**Purpose:** Update certificate details

**Request:**

```json
{
  "cert_number": "NHIA/2026/FC654321",
  "expiry_date": "2027-02-15"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": { ... updated certificate ... }
}
```

---

### 9. DELETE /certificates/:id

**Purpose:** Delete a certificate

**Response (200):**

```json
{
  "success": true,
  "message": "Certificate deleted successfully"
}
```

---

## COMPLIANCE SCORE ENDPOINTS

### 10. GET /compliance/score

**Purpose:** Get the current compliance health score for a company

**Response (200):**

```json
{
  "success": true,
  "data": {
    "company_id": "uuid",
    "total_score": 73,
    "component_a": 30, // Coverage (out of 50)
    "component_b": 25, // Freshness (out of 30)
    "component_c": 18, // Quality (out of 20)
    "procurement_ready": false,
    "breakdown": {
      "total_certificates": 6,
      "active_certificates": 3,
      "expiring_certificates": 2,
      "expired_certificates": 1,
      "api_verified": 4,
      "manually_verified": 2
    },
    "insights": [
      {
        "type": "warning",
        "message": "NHIA certificate expires in 6 days. Renew now."
      },
      {
        "type": "alert",
        "message": "NSITF certificate expired. This affects procurement eligibility."
      }
    ],
    "last_calculated": "2026-05-09T10:30:00Z"
  }
}
```

---

### 11. POST /compliance/calculate

**Purpose:** Manually recalculate compliance score

**Response (200):**

```json
{
  "success": true,
  "message": "Score recalculated successfully",
  "data": { ...score object... }
}
```

---

## SUBSCRIPTION/PAYMENT ENDPOINTS

### 12. GET /subscriptions/plans

**Purpose:** Get available subscription tiers

**Response (200):**

```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "starter",
        "name": "Starter",
        "monthly_price": 5000,
        "annual_price": 50000,
        "currency": "NGN",
        "features": {
          "profiles": 1,
          "certificates_per_month": "unlimited",
          "bulk_verifications": 100,
          "team_members": 1,
          "api_access": false
        },
        "description": "For individual contractors"
      },
      {
        "id": "professional",
        "name": "Professional",
        "monthly_price": 25000,
        "annual_price": 250000,
        "currency": "NGN",
        "features": {
          "profiles": 50,
          "certificates_per_month": "unlimited",
          "bulk_verifications": "unlimited",
          "team_members": 3,
          "api_access": true
        },
        "description": "For consultants and small firms"
      },
      {
        "id": "enterprise",
        "name": "Enterprise",
        "monthly_price": 100000,
        "annual_price": 1000000,
        "currency": "NGN",
        "features": {
          "profiles": "unlimited",
          "certificates_per_month": "unlimited",
          "bulk_verifications": "unlimited",
          "team_members": "unlimited",
          "api_access": true,
          "white_label": true,
          "sla": "99.9%"
        },
        "description": "For large organizations and MDAs"
      }
    ]
  }
}
```

---

### 13. POST /subscriptions/initialize

**Purpose:** Start a subscription and initialize payment

**Request:**

```json
{
  "plan_id": "professional",
  "billing_cycle": "monthly",
  "email": "amaka@techbuild.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "subscription_id": "uuid",
    "amount": 25000,
    "currency": "NGN",
    "paystack": {
      "authorization_url": "https://checkout.paystack.com/...",
      "access_code": "...",
      "reference": "..."
    }
  }
}
```

---

### 14. POST /subscriptions/verify-payment

**Purpose:** Verify Paystack payment and activate subscription

**Request:**

```json
{
  "reference": "paystack_reference"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "uuid",
      "plan": "professional",
      "status": "active",
      "next_billing_date": "2026-06-09",
      "started_at": "2026-05-09T10:30:00Z"
    },
    "message": "Subscription activated successfully"
  }
}
```

---

### 15. GET /subscriptions/current

**Purpose:** Get current subscription details

**Response (200):**

```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "uuid",
      "plan": "professional",
      "billing_cycle": "monthly",
      "amount": 25000,
      "status": "active",
      "started_at": "2026-05-09",
      "next_billing_date": "2026-06-09",
      "auto_renew": true,
      "features": { ...features... }
    }
  }
}
```

---

### 16. POST /subscriptions/cancel

**Purpose:** Cancel subscription

**Request:**

```json
{
  "reason": "Optional cancellation reason"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Subscription cancelled. Access until 2026-06-09.",
  "data": {
    "cancelled_at": "2026-05-09T10:30:00Z",
    "access_until": "2026-06-09T10:30:00Z"
  }
}
```

---

## REPORT ENDPOINTS

### 17. POST /reports/generate

**Purpose:** Generate a PDF compliance report

**Request:**

```json
{
  "report_type": "compliance",
  "include_certificates": ["nhia", "pcc", "nsitf"]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "report_id": "uuid",
    "report_type": "compliance",
    "pdf_url": "https://s3.aws.com/...",
    "generated_at": "2026-05-09T10:30:00Z",
    "valid_until": "2026-06-09T10:30:00Z",
    "compliance_score": 73
  }
}
```

---

### 18. GET /reports

**Purpose:** List all reports for a company

**Query Parameters:**

```
?report_type=compliance
&page=1
&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "uuid",
        "report_type": "compliance",
        "generated_at": "2026-05-09T10:30:00Z",
        "pdf_url": "...",
        "compliance_score": 73
      }
    ]
  }
}
```

---

## GOVERNMENT API INTEGRATION ENDPOINTS

### 19. POST /government/verify

**Purpose:** Verify a certificate against government API

**Request:**

```json
{
  "certificate_id": "uuid",
  "api_endpoint": "nhia"
}
```

**Response (202 - Processing):**

```json
{
  "success": true,
  "message": "Verification in progress",
  "data": {
    "verification_id": "uuid",
    "status": "processing"
  }
}
```

**Note:** This is async. Poll `/government/verify/{verification_id}` for status.

---

### 20. GET /government/verify/:verification_id

**Purpose:** Get verification status

**Response (200):**

```json
{
  "success": true,
  "data": {
    "verification_id": "uuid",
    "status": "completed",
    "result": {
      "verified": true,
      "nhia_status": "active",
      "enrollment_number": "...",
      "last_verified": "2026-05-09T10:35:00Z"
    }
  }
}
```

---

## AUDIT TRAIL ENDPOINTS

### 21. GET /audit/trail

**Purpose:** Get activity log for a company

**Query Parameters:**

```
?action=cert_upload
&days=30
&page=1
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "action": "cert_upload",
        "resource": "certificate",
        "user": "amaka@techbuild.com",
        "changes": "Certificate NHIA uploaded",
        "timestamp": "2026-05-09T10:30:00Z"
      }
    ]
  }
}
```

---

## COMPANY/PROFILE ENDPOINTS

### 22. GET /companies/:id

**Purpose:** Get company profile

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "TechBuild Nigeria Ltd",
    "rc_number": "RC1234567",
    "email": "info@techbuild.com",
    "phone": "+234 8012345678",
    "address": "123 Main Street, Lagos",
    "company_size": "medium",
    "industry": "Technology",
    "subscription_tier": "professional",
    "status": "active",
    "verified": true,
    "certificates_count": 6,
    "compliance_score": 73,
    "created_at": "2026-05-09"
  }
}
```

---

### 23. PUT /companies/:id

**Purpose:** Update company profile

**Request:**

```json
{
  "name": "TechBuild Nigeria Ltd",
  "email": "newmail@techbuild.com",
  "phone": "+234 8099999999",
  "address": "456 New Street, Abuja"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": { ...updated company... }
}
```

---

## ADMIN ENDPOINTS (If Needed)

### 24. GET /admin/companies

**Purpose:** List all companies (admin only)

**Query Parameters:**

```
?status=active
&subscription_tier=enterprise
&page=1
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "companies": [ ...list... ],
    "total": 100,
    "page": 1
  }
}
```

---

### 25. POST /admin/verify-certificate

**Purpose:** Manually verify a certificate (admin)

**Request:**

```json
{
  "certificate_id": "uuid",
  "verified": true,
  "notes": "Verified against NHIA database"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": { ...updated certificate... }
}
```

---

## AUTHENTICATION & SECURITY

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user_id",
  "email": "user@example.com",
  "role": "contractor",
  "company_id": "company_id",
  "iat": 1620000000,
  "exp": 1620086400
}

Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

### Token Expiration & Refresh

- **Access Token:** 24 hours
- **Refresh Token:** 30 days
- Users must refresh tokens before expiry

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&\*)

### Security Headers (All Responses)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Rate Limiting

- Login: 5 attempts per 15 minutes per IP
- API: 100 requests per minute per user
- Certificate uploads: 10 per hour per user

### CORS Configuration

```javascript
const corsOptions = {
  origin: [
    'https://clearpass-seven.vercel.app',
    'https://staging.clearpass.com.ng',
    'http://localhost:3000', // development
    'http://localhost:5173', // Vite dev
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## PAYMENT INTEGRATION (PAYSTACK)

### Paystack Integration Flow

```
1. USER SELECTS PLAN
   ├─ POST /subscriptions/initialize
   └─ Returns: authorization_url + access_code

2. USER REDIRECTED TO PAYSTACK
   ├─ User enters card details
   └─ Paystack processes payment

3. PAYSTACK CALLBACK
   ├─ POST /webhooks/paystack (from Paystack)
   └─ Verify reference + update database

4. USER RETURNS TO APP
   ├─ Frontend shows success
   └─ Subscription activated

5. AUTO-RENEWAL (Monthly)
   ├─ Scheduled job (cron)
   └─ Use Paystack recurring charge API
```

### Paystack Webhook Handler

```javascript
// POST /webhooks/paystack
// Payload from Paystack:
{
  "event": "charge.success",
  "data": {
    "id": 123456,
    "reference": "paystack_reference",
    "amount": 2500000, // in kobo
    "customer": {
      "email": "user@example.com"
    },
    "authorization": {
      "authorization_code": "AUTH_CODE",
      "bin": "123456",
      "last4": "1234"
    }
  }
}

// Backend should:
// 1. Verify webhook signature (HMAC-SHA512)
// 2. Find subscription by reference
// 3. Update subscription status to "active"
// 4. Create audit log
// 5. Send confirmation email
```

### Paystack Test Keys

```
Public Key: pk_test_xxxxxxxxxxxxx
Secret Key: sk_test_xxxxxxxxxxxxx
```

Available test cards:

```
4084084084084081 (Success)
5060666666666666 (Error)
```

---

## GOVERNMENT API INTEGRATION

### NHIA Integration

**Endpoint:** (To be provided by NHIA)
**Authentication:** API Key + Signature
**Method:** REST API

**Request:**

```json
{
  "enrollment_number": "NHIA/2026/FC123456",
  "search_type": "enrollment"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "enrollment_number": "NHIA/2026/FC123456",
    "company_name": "TechBuild Nigeria Ltd",
    "enrollment_date": "2025-01-15",
    "expiry_date": "2027-01-15",
    "status": "active"
  }
}
```

### CAC (RC Verification) Integration

**Endpoint:** (To be provided by CAC/BPP)
**Method:** REST API or SFTP batch

**Implementation Note:**

> For MVP, we scaffold the integration. Full implementation happens in Week 1 post-launch based on CAC's API specs.

### FIRS Integration

**Endpoint:** (To be provided by FIRS)
**Method:** Web service or batch

**Implementation Note:**

> Similar to CAC—scaffold now, integrate Week 1.

---

## DEPLOYMENT & INFRASTRUCTURE

### Deployment Checklist

#### Week -1 (Before Launch)

- [ ] PostgreSQL database provisioned (Railway or AWS RDS)
- [ ] Node.js backend deployed to Railway/Render
- [ ] Environment variables set in production
- [ ] SSL certificates configured
- [ ] Database migrations run
- [ ] Seed test data
- [ ] API health check working
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Logging configured
- [ ] Monitoring alerts set up

#### Production Deployment Steps

1. **Create Railway Account**

   ```
   1. Go to railway.app
   2. Sign up with GitHub
   3. Create new project
   4. Add PostgreSQL
   5. Add Node.js service
   6. Connect to GitHub repo
   7. Set environment variables
   8. Deploy
   ```

2. **Environment Variables (Production)**

   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=very-long-random-string
   PAYSTACK_PUBLIC_KEY=pk_live_...
   PAYSTACK_SECRET_KEY=sk_live_...
   NODE_ENV=production
   PORT=3000 (Railway assigns)
   FRONTEND_URL=https://clearpass-seven.vercel.app
   LOG_LEVEL=info
   API_RATE_LIMIT=100
   ```

3. **Database Migrations (Production)**

   ```bash
   npm run migrate:latest  # From CI/CD pipeline
   ```

4. **Health Check Endpoint**
   ```
   GET /health
   Response: { "status": "ok", "timestamp": "2026-05-09T..." }
   ```

### Monitoring & Logging

**Logging Service:** Winston or Pino

- Log all API requests (method, path, duration, status)
- Log errors with stack traces
- Log government API calls and responses
- Store in CloudWatch or similar

**Error Tracking:** Sentry (free tier)

- Capture exceptions automatically
- Real-time alerts for critical errors
- Source map support

**Uptime Monitoring:** UptimeRobot (free)

- Monitor API health endpoint
- Alert if down for >5 min
- Historical uptime tracking

### Backup Strategy

- PostgreSQL automated backups (Railway handles)
- Daily backups retained for 30 days
- Test restore procedure weekly
- Document recovery steps

---

## TESTING STRATEGY

### Unit Tests (40% coverage minimum)

**Technology:** Jest + Supertest

```javascript
// Example: authController.test.js
describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'SecurePass123!',
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe('test@example.com');
  });

  it('should reject duplicate emails', async () => {
    // Create first user
    // Try to create with same email
    // Expect 409 Conflict
  });
});
```

### Integration Tests (20% coverage minimum)

```javascript
// Example: certificates.integration.test.js
describe('Certificate Flow', () => {
  it('should upload cert and update score', async () => {
    // 1. Register user
    // 2. Upload certificate
    // 3. Verify in database
    // 4. Check compliance score updated
    // 5. Check audit trail logged
  });
});
```

### API Tests (All endpoints)

- Test happy path (200/201)
- Test error cases (400/401/404/409/429)
- Test input validation
- Test authentication required
- Test rate limiting
- Test pagination
- Test sorting/filtering

### Load Testing (Week 0)

Use Apache JMeter or k6:

```bash
# Test that API handles 100 concurrent users
# Without response time > 2 seconds
k6 run load-test.js
```

### Test Coverage Target

| Layer       | Target  |
| ----------- | ------- |
| Controllers | 80%     |
| Services    | 90%     |
| Models      | 85%     |
| Middleware  | 80%     |
| **Overall** | **80%** |

---

## SUCCESS CRITERIA & METRICS

### Phase 1 Success Criteria (Week 0 Launch)

✅ **Functionality:**

- [ ] All 25+ API endpoints functional and tested
- [ ] Authentication working (register, login, token refresh)
- [ ] Certificate upload, verification, and storage working
- [ ] Compliance score calculation accurate
- [ ] Paystack integration operational
- [ ] Audit trail logging all actions
- [ ] PDF report generation working

✅ **Quality:**

- [ ] 80% test coverage
- [ ] Zero critical bugs
- [ ] <500ms response time on 95th percentile
- [ ] <1% error rate on production traffic
- [ ] All security headers in place

✅ **Security:**

- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens properly validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled
- [ ] CORS correctly configured
- [ ] Rate limiting working

✅ **Operations:**

- [ ] Deployment automated (GitHub Actions)
- [ ] Database backups automated
- [ ] Monitoring and alerts active
- [ ] Logging comprehensive
- [ ] Documentation complete

### Key Metrics to Track

**Performance:**

- API response time (target: <500ms)
- Database query time (target: <100ms)
- Error rate (target: <0.1%)
- Uptime (target: 99.5%)

**User Metrics (Week 1-2):**

- Registration rate
- Certificate uploads per user
- Subscription conversion rate
- Daily active users
- Report generation rate

**Business Metrics (Week 1-4):**

- Paying customers
- MRR (Monthly Recurring Revenue)
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)

---

## ROLLOUT TIMELINE

### Week -2 (Database Setup & API Scaffolding)

- [ ] Database schema finalized
- [ ] PostgreSQL provisioned
- [ ] Express server scaffolded
- [ ] Authentication endpoints built
- [ ] Initial API tests written

**Deliverable:** Core API running on localhost with test data

### Week -1 (Core Features Implementation)

- [ ] Certificate management endpoints
- [ ] Compliance score calculation
- [ ] Paystack integration
- [ ] PDF report generation
- [ ] Government API scaffolds
- [ ] Comprehensive testing

**Deliverable:** Complete API ready for frontend integration

### Week 0 (Frontend Integration & Testing)

- [ ] API deployed to production (Railway)
- [ ] Frontend connected to backend API
- [ ] End-to-end testing in staging
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Bug fixes and optimizations
- [ ] Team training

**Deliverable:** Live product accessible at clearpass-seven.vercel.app with working backend

### Week 1 (Launch & Monitoring)

- [ ] Monitor production metrics
- [ ] Respond to user feedback
- [ ] Fix bugs reported by early users
- [ ] Prepare for government pilot
- [ ] Gather data for Series A narrative

---

## TEAM RESPONSIBILITIES

### Backend Lead

**Responsible for:**

- Overall architecture and design
- Code quality and standards
- API specification adherence
- Database optimization
- Security best practices
- Team coordination

**Deliverables:**

- Working API deployed to production
- All tests passing
- Documentation complete
- Team onboarded

### Backend Engineers (2-3 needed)

**Responsibilities:**

1. **Engineer 1:** Authentication + Core Infrastructure
   - User registration, login, JWT
   - Middleware setup
   - Error handling
   - Logging & monitoring

2. **Engineer 2:** Certificate Management + Government APIs
   - Certificate upload, storage, retrieval
   - Government API integrations
   - Verification logic
   - Audit logging

3. **Engineer 3 (Optional):** Payments + Reports
   - Paystack integration
   - Subscription management
   - PDF generation
   - Analytics

### QA/Testing

**Responsible for:**

- Writing test cases
- Running integration tests
- Load testing
- Security testing
- Bug reporting and tracking

**Deliverables:**

- Test report with 80% coverage
- Load test results
- Bug list (P0/P1/P2 classification)

### DevOps/Infrastructure

**Responsible for:**

- PostgreSQL setup and optimization
- API deployment pipeline
- Monitoring and alerting
- Backups and disaster recovery
- Performance optimization

**Deliverables:**

- Production API live
- Automated backups
- Monitoring dashboard
- Incident response procedures

---

## FAQ & TROUBLESHOOTING

### Q: How do I set up the database locally?

**A:** Use Docker:

```bash
docker run --name clearpass-postgres \
  -e POSTGRES_USER=clearpass \
  -e POSTGRES_PASSWORD=clearpass123 \
  -e POSTGRES_DB=clearpass \
  -p 5432:5432 \
  -d postgres:16

# Then run migrations:
npm run migrate:latest
```

---

### Q: How do I test the API locally?

**A:** Use Postman or Insomnia:

1. Import the OpenAPI spec (provided separately)
2. Set environment variables (BASE_URL, TOKEN)
3. Run requests
4. Use the test suite included

Or run automated tests:

```bash
npm run test          # Unit tests
npm run test:integration  # Integration tests
npm run test:coverage     # Coverage report
```

---

### Q: How do I debug a failed government API call?

**A:** Check the logs:

```bash
# View government_api_logs table
SELECT * FROM government_api_logs
WHERE success = false
ORDER BY created_at DESC
LIMIT 10;
```

Also check:

- API key is correct
- Endpoint is accessible
- Request payload matches spec
- Error message in logs

---

### Q: What do I do if the database is down?

**A:**

1. Check Railway dashboard for status
2. Check backup age
3. Restore from latest backup
4. Run migrations again
5. Verify data integrity

---

### Q: How do I handle payment failures?

**A:** Paystack automatically retries failed payments 3 times. For manual intervention:

1. Check Paystack dashboard
2. Verify customer has valid card
3. Send email to customer requesting update
4. Pause subscription if payment fails after 3 retries

---

### Q: How do I scale the API if we get 1000 concurrent users?

**A:**

1. Enable database connection pooling (pgBouncer)
2. Add caching layer (Redis)
3. Optimize N+1 queries
4. Scale API horizontally (Railway auto-scales)
5. Use CDN for static assets
6. Consider read replicas for heavy queries

---

## DEPLOYMENT CHECKLIST

- [ ] All tests passing (80% coverage)
- [ ] Code reviewed and merged
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] SSL certificate valid
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Monitoring alerts configured
- [ ] Logging working
- [ ] Backups tested
- [ ] Team trained
- [ ] Documentation complete
- [ ] Health check responding
- [ ] API responding <500ms
- [ ] Error rate <0.1%
- [ ] Security audit passed

---

## FINAL NOTES

### For Backend Team

This is the **definitive specification** for the backend. Every endpoint, every field, every error case is documented here. Questions about requirements should reference this guide first.

**Your job is to build a backend that a contractor can use on Monday morning without thinking about infrastructure, security, or data storage.**

Build it like you're building it for production (because you are).

### For Product Team

This backend is designed to:

1. **Validate the market** (Week 1-2: measure conversion)
2. **Close government deals** (Week 2-4: pilot MDAs)
3. **Scale to Series A** (Month 3: ₦1-2M MRR)

Every API endpoint is built for a reason. Every field is required for functionality.

### For Executive Team

Backend delivery is **critical path** for launch. Everything else (landing pages, sales playbooks, partnerships) depends on a working API.

**Target:** Week 0 (launch week)  
**Budget:** Hosting ~₦50K/month (Railway free tier covers), engineer salaries  
**Risk:** If backend slips 2 weeks, entire launch slips 2 weeks

---

## NEXT STEPS

1. **Assign team members** to roles above
2. **Set up development environment** (GitHub, Railway, local Postgres)
3. **Begin Week -2 tasks** (database schema, scaffolding)
4. **Daily standup** (15 min) to track progress
5. **Weekly code review** to ensure quality
6. **Test early** (don't wait until end)

---

## SUPPORT & QUESTIONS

For clarifications on this specification:

- **Product questions:** Contact Quadri (Product Strategy)
- **Technical questions:** Create GitHub issue with [BACKEND] tag
- **Urgent blockers:** Slack #backend-team

---

**Document Version:** 1.0  
**Last Updated:** May 9, 2026  
**Next Review:** May 12, 2026 (post-launch)

---

**END OF BACKEND DEVELOPMENT GUIDE**

**Ready to ship. Let's build.**
