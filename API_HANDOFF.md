# ClearPass — API Integration Handoff

**Audience:** the backend team (and future-me when the endpoints arrive).
**Goal:** make wiring the live API a 30-minute job, not a rewrite.

---

## How the seam works

The frontend is fully decoupled from data origin. Every view consumes typed
hooks (`useCertificates`, `useAlerts`, etc.) that look identical regardless
of whether the response came from a real backend or the local mock store.

```
View component
   ↓
useCertificates()  ← typed hook in src/app/api/certificates.ts
   ↓
listCertificates()  ← if env.useMocks → mockResponse(...)
                    else → request<T>(ENDPOINTS.certificates.list)
```

To go live: set `VITE_USE_MOCKS=false` in `.env`, point `VITE_API_BASE_URL`
at the backend, and ensure the backend returns the shapes documented below.
**No component code changes required** unless a shape disagrees.

---

## Environment variables

| Var                    | Default                        | What it does                                                 |
| ---------------------- | ------------------------------ | ------------------------------------------------------------ |
| `VITE_API_BASE_URL`    | `/api`                         | Base URL for all requests. Use a proxy or full origin.       |
| `VITE_USE_MOCKS`       | `true` in dev, `false` in prod | When true, hooks short-circuit to local fixtures.            |
| `VITE_MOCK_LATENCY_MS` | `350`                          | Simulated latency in mock mode — keep loading states honest. |
| `VITE_SENTRY_DSN`      | (unset)                        | Sentry crash reporting.                                      |
| `VITE_APP_ENV`         | `development`                  | Sentry environment tag.                                      |

Copy `.env.example` to `.env` and fill in.

---

## Auth

The HTTP client (`src/app/api/client.ts`) already attaches `Authorization:
Bearer <token>` when a token is present in `sessionStorage` under the key
`clearpass.auth.token`. Use `setAuthToken(token)` after login, and
`setAuthToken(null)` on logout.

When the auth API exists, wire `ENDPOINTS.auth.login`, `auth.refresh`,
`auth.me` and add a small `useAuth` hook. The plumbing is ready.

---

## Endpoints expected

All paths below are appended to `VITE_API_BASE_URL`. Status codes follow
REST conventions: `200/201` on success, `204` for empty responses,
`4xx` for client errors, `5xx` triggers automatic retry (1 attempt).

### Certificates

| Method | Path                         | Hook / function          | Response                                    |
| ------ | ---------------------------- | ------------------------ | ------------------------------------------- |
| GET    | `/certificates`              | `useCertificates()`      | `Certificate[]`                             |
| GET    | `/certificates/:id`          | `useCertificate(id)`     | `Certificate`                               |
| POST   | `/certificates`              | `useUploadCertificate()` | `Certificate` (sends `multipart/form-data`) |
| DELETE | `/certificates/:id`          | `useDeleteCertificate()` | `204`                                       |
| GET    | `/certificates/:id/download` | (link)                   | binary PDF                                  |
| GET    | `/certificates/export`       | (link)                   | binary ZIP                                  |

`POST /certificates` body fields (multipart): `shortName`, `certificateNumber`,
`issuedDate`, `expiryDate`, `file`.

### Alerts

| Method | Path               | Hook                     | Response  |
| ------ | ------------------ | ------------------------ | --------- |
| GET    | `/alerts`          | `useAlerts()`            | `Alert[]` |
| POST   | `/alerts/:id/read` | `useMarkAlertRead()`     | `204`     |
| POST   | `/alerts/read-all` | `useMarkAllAlertsRead()` | `204`     |
| DELETE | `/alerts/:id`      | `useDismissAlert()`      | `204`     |

### Activity log

| Method | Path        | Hook            | Response         |
| ------ | ----------- | --------------- | ---------------- |
| GET    | `/activity` | `useActivity()` | `ActivityItem[]` |

### Dashboard

| Method | Path                       | Hook                  | Response            |
| ------ | -------------------------- | --------------------- | ------------------- |
| GET    | `/dashboard?state=<label>` | `useDashboard(state)` | `DashboardSnapshot` |

`state` query is the Tweaks Panel state label (e.g. `Healthy`,
`Attention Required`). Production can ignore the query and return the real
state — this is just demo plumbing.

### MDA portal

| Method | Path                                | Hook                    | Response                            |
| ------ | ----------------------------------- | ----------------------- | ----------------------------------- |
| GET    | `/mda/verify/:rcNumber`             | `useVerifyVendor()`     | `VendorVerification`                |
| GET    | `/mda/prequalification`             | `usePrequalification()` | `PrequalificationApplicant[]`       |
| POST   | `/mda/prequalification/:id/approve` | `useApproveApplicant()` | `204`                               |
| POST   | `/mda/prequalification/:id/reject`  | `useRejectApplicant()`  | `204` (body: `{ reason?: string }`) |

### Partner portal

| Method | Path                 | Hook                    | Response           |
| ------ | -------------------- | ----------------------- | ------------------ |
| GET    | `/partner/clients`   | `usePartnerClients()`   | `PartnerClient[]`  |
| GET    | `/partner/analytics` | `usePartnerAnalytics()` | `PartnerAnalytics` |

### Settings

| Method | Path                      | Hook                                 | Response                  |
| ------ | ------------------------- | ------------------------------------ | ------------------------- |
| GET    | `/settings/profile`       | `useProfile()`                       | `UserProfile`             |
| PATCH  | `/settings/profile`       | `useUpdateProfile()`                 | `UserProfile`             |
| GET    | `/settings/notifications` | `useNotificationPreferences()`       | `NotificationPreferences` |
| PUT    | `/settings/notifications` | `useUpdateNotificationPreferences()` | `NotificationPreferences` |

### Reports

| Method | Path                    | Notes                    |
| ------ | ----------------------- | ------------------------ |
| POST   | `/reports/generate`     | (used from Reports view) |
| GET    | `/reports/:id/download` | (used from Reports view) |

These are wired as constants in `endpoints.ts` but not yet exposed via a
typed hook — we can add `useReports` once the spec is final.

---

## Response shapes

All types live in `src/app/api/types.ts`. Field types are exact — return
the same casing and structure on the wire. Below is the canonical version
of each shape; see the file for full JSDoc.

### `Certificate`

```ts
{
  id: string;
  name: string;
  shortName: string;            // 'NHIA' | 'PCC' | ...
  status:
    | 'active'
    | 'expiring-soon'
    | 'expiring-urgent'
    | 'expiring-critical'
    | 'expired'
    | 'pending'
    | 'not-connected';
  daysToExpiry?: number;
  expiryDate: string;           // human format e.g. '15 Jan 2027'
  certificateNumber?: string;
  isApiVerified: boolean;
  issuingAuthority?: string;
  issuedDate?: string;
  documentUrl?: string;
}
```

### `Alert`

```ts
{
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;            // human format
  certificateName?: string;
  daysToExpiry?: number;
  actionRequired: boolean;
  isRead: boolean;
  canDismiss: boolean;
}
```

### `ActivityItem`

```ts
{
  id: string;
  type: 'verification' | 'upload' | 'download' | 'renewal' | 'alert' | 'email' | 'report';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}
```

### `DashboardSnapshot`

```ts
{
  state: 'Healthy' | 'Attention Required' | 'Critical' | 'Non-Compliant' | 'New Registration' | 'Pending Verification';
  summary: {
    score: number;              // 0..100
    procurementReady: boolean;
    totalCertificates: number;
    activeCertificates: number;
    expiringCount: number;
    expiredCount: number;
    pendingCount: number;
  };
  certificates: Certificate[];
  recentAlerts: Alert[];
}
```

### `VendorVerification` (MDA)

```ts
{
  rcNumber: string;
  companyName: string;
  score: number; // 0..100
  status: 'procurement-ready' | 'attention-required' | 'ineligible';
  lastVerified: string;
  certificates: {
    name: string; // short code
    status: 'active' | 'expired' | 'expiring';
    expiryDate: string;
  }
  [];
}
```

### `PrequalificationApplicant`

```ts
{
  id: string;
  companyName: string;
  rcNumber: string;
  score: number;
  status: 'procurement-ready' | 'attention-required' | 'ineligible';
  submittedAt: string;
  reviewedAt?: string;
}
```

### `PartnerClient`

```ts
{
  id: string;
  companyName: string;
  rcNumber: string;
  score: number;
  status: 'healthy' | 'attention' | 'critical';
  activeCertificates: number;
  totalCertificates: number;
  nextExpiry: string; // short code of next-to-expire cert
  daysToExpiry: number; // negative when overdue
  monthlyFee: number;
}
```

### `PartnerAnalytics`

```ts
{
  revenueTrend: {
    month: string;
    revenue: number;
    clients: number;
  }
  [];
  complianceDistribution: {
    name: string;
    value: number;
    color: string;
  }
  [];
  expiryTimeline: {
    period: string;
    count: number;
  }
  [];
  certificateTypes: {
    name: string;
    renewals: number;
  }
  [];
  kpi: {
    monthlyRevenue: number;
    monthlyRevenueDeltaPct: number;
    activeClients: number;
    activeClientsDelta: number;
    avgComplianceScore: number;
    avgComplianceScoreDelta: number;
    renewalsThisMonth: number;
    renewalsPendingAction: number;
  }
}
```

### `UserProfile`, `NotificationPreferences`

```ts
UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  rcNumber?: string;
  role: 'business' | 'mda' | 'partner';
  avatarUrl?: string;
};

NotificationPreferences = {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  expiryReminderDays: number[];   // e.g. [30, 14, 7, 1]
};
```

---

## Error contract

The frontend expects errors in the following JSON shape:

```json
{
  "code": "RC_NUMBER_INVALID",
  "message": "RC number must start with 'RC' and have at least 7 digits",
  "details": { "field": "rcNumber" }
}
```

- `code` — short, stable identifier (frontend can map to user-friendly copy).
- `message` — human-readable fallback (rendered when there's no specific UI for `code`).
- `details` — optional, for field-level validation hints.

The HTTP status drives behaviour:

| Status          | Behaviour                                                            |
| --------------- | -------------------------------------------------------------------- |
| `4xx`           | Surfaces immediately as `ApiClientError`. UI shows `message` inline. |
| `5xx`           | Auto-retried once with 250ms backoff before surfacing.               |
| Network failure | Auto-retried once, then surfaces as `code: NETWORK`.                 |

---

## Where to swap mocks for live calls

Each domain module has the same shape. To swap an endpoint, edit the `if
(env.useMocks)` branch — or just leave it and flip `VITE_USE_MOCKS=false`.

| Domain         | File                          |
| -------------- | ----------------------------- |
| Certificates   | `src/app/api/certificates.ts` |
| Alerts         | `src/app/api/alerts.ts`       |
| Activity log   | `src/app/api/activity.ts`     |
| Dashboard      | `src/app/api/dashboard.ts`    |
| MDA portal     | `src/app/api/mda.ts`          |
| Partner portal | `src/app/api/partner.ts`      |
| Settings       | `src/app/api/settings.ts`     |

Public surface area is exported from `src/app/api/index.ts` (the barrel).
Components only ever import from `'../api'`, never reach into individual files.

---

## Recommended backend defaults

A few opinionated suggestions to keep wiring smooth:

1. **CORS** — allow the frontend origin and the `Authorization` header.
2. **Date format on the wire** — return both a machine-readable `expiryDateIso`
   and a human `expiryDate` if you want full timezone control. The current
   shape uses pre-formatted strings (`"15 Jan 2027"`) which is fine for the
   demo but limits client-side reformatting.
3. **Pagination** — when list endpoints exceed ~50 rows, switch to
   `PaginatedResponse<T>` (already typed in `types.ts`) and we'll add
   `?page=&pageSize=` query params to the hooks.
4. **Idempotency** — for `POST /certificates`, accept an `Idempotency-Key`
   header so retries don't create duplicates. The client's retry policy
   only retries on 5xx so this is mostly belt-and-braces.

---

## Smoke test the integration

Once endpoints are live:

1. `cp .env.example .env` and set `VITE_USE_MOCKS=false` + real `VITE_API_BASE_URL`.
2. `npm run dev` — open `http://localhost:5173`.
3. Walk the three personas via the Tweaks Panel (bottom-right). Each should
   load real data, show inline errors on bad input, and toast on success.
4. `npm run build && npm run preview` — verify the production bundle hits
   the same endpoints.

If anything 404s, the most likely cause is a path mismatch — double-check
`src/app/api/endpoints.ts` against the live spec.
