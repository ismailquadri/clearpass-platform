# Backend Disconnection Guide

## Status: Backend Disconnected

The ClearPass frontend has been **completely disconnected** from the backend API. The frontend now runs in **standalone mock mode** and does not make any HTTP requests to a backend server.

## What This Means

### ✅ Frontend Features (Fully Functional)
- All UI components work with local mock data
- User authentication flow (simulated)
- Certificate management (local state)
- Compliance dashboard (mock data)
- MDA verification portal (mock data)
- Admin portal (fully functional)
- Audit trail system (local storage)
- Rate limiting (local enforcement)
- Notification system (queue simulation)
- Export functionality (client-side only)

### ❌ Backend Features (Disconnected)
- No HTTP requests to backend API
- No database connections
- No real authentication
- No government API integrations
- No email/SMS delivery
- No file uploads to cloud storage

## Configuration Changes Made

### 1. API Client (`src/app/api/client.ts`)
- **Changed:** `useMocks` always set to `true`
- **Changed:** `request()` function throws error if called
- **Reason:** Prevents any accidental HTTP requests to backend

### 2. Environment Files
- **`.env`**: Set `VITE_USE_MOCKS=true`, removed backend URL
- **`.env.example`**: Updated to reflect mock-only mode
- **`.env.production`**: Set `VITE_USE_MOCKS=true` for production

### 3. Mock Data System
- All API domain modules use local mock data
- Mock responses simulate network latency (350ms default)
- Mock data is stored in `src/app/api/mocks.ts`

## How to Reconnect Backend

When your backend API is ready, follow these steps:

### Step 1: Update Environment Variables

**Development (`.env`):**
```bash
# Set your backend API URL
VITE_API_BASE_URL=http://localhost:5001  # Or your backend URL

# Disable mock mode to use real API
VITE_USE_MOCKS=false
```

**Production (`.env.production`):**
```bash
# Set your production backend API URL
VITE_API_BASE_URL=https://your-api-domain.com

# Disable mock mode for production
VITE_USE_MOCKS=false
```

### Step 2: Restore API Client Functionality

**File:** `src/app/api/client.ts`

**Restore the `readEnv()` function:**
```typescript
function readEnv(): Env {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';
  const useMocksRaw = import.meta.env.VITE_USE_MOCKS as string | undefined;
  // Default to mocks in dev, real API in production unless explicitly opted in/out.
  const useMocks = useMocksRaw === undefined ? import.meta.env.DEV : useMocksRaw === 'true';
  const mockLatencyMs = Number((import.meta.env.VITE_MOCK_LATENCY_MS as string | undefined) ?? 350);
  return { apiBaseUrl, useMocks, mockLatencyMs };
}
```

**Restore the `request()` function:**
```typescript
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, headers = {}, signal, retries = 1 } = options;

  const url = buildUrl(path, query);
  const isFormData = body instanceof FormData;

  const init: RequestInit = {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  };

  const token = getAuthToken();
  if (token) {
    (init.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  if (body !== undefined && method !== 'GET') {
    init.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        if (res.status >= 500 && attempt < retries) {
          await wait(backoffMs(attempt));
          continue;
        }
        throw await parseError(res);
      }
      if (res.status === 204) return undefined as T;
      const ct = res.headers.get('content-type') ?? '';
      if (ct.includes('application/json')) {
        return (await res.json()) as T;
      }
      return (await res.text()) as unknown as T;
    } catch (err) {
      if (isAbortError(err)) throw err;
      lastError = err;
      if (err instanceof ApiClientError && err.status < 500) throw err;
      if (attempt < retries) {
        await wait(backoffMs(attempt));
        continue;
      }
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new ApiClientError(0, 'NETWORK', 'Network request failed');
}
```

### Step 3: Update API Domain Modules

Each API domain module (e.g., `auth.ts`, `certificates.ts`, `dashboard.ts`) has a structure like this:

```typescript
export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      if (env.useMocks) {
        return mockResponse(MOCK_AUTH_DATA);
      }
      return request<AuthResponse>('/auth/me');
    },
  });
}
```

**No changes needed** - the modules already check `env.useMocks` and will automatically switch to real API calls when `VITE_USE_MOCKS=false`.

### Step 4: Backend API Requirements

Your backend API should implement these endpoints:

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

#### Certificates
- `GET /certificates` - List certificates
- `POST /certificates` - Upload certificate
- `PUT /certificates/:id` - Update certificate
- `DELETE /certificates/:id` - Delete certificate
- `GET /certificates/:id` - Get certificate details

#### Dashboard
- `GET /dashboard` - Get dashboard data
- `GET /dashboard/stats` - Get statistics

#### MDA Portal
- `POST /mda/verify` - Verify vendor compliance
- `POST /mda/bulk-verify` - Bulk verification
- `GET /mda/watchlist` - Get watchlist

#### Government APIs
- Integration with NHIA, CAC, FIRS, PenCom, BPP, NSITF, ITF APIs

### Step 5: CORS Configuration

Ensure your backend allows CORS requests from your frontend:

**Backend CORS Configuration (Node.js/Express example):**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5176',
  credentials: true,
}));
```

### Step 6: Testing the Connection

1. Start your backend server
2. Update frontend environment variables
3. Restart frontend dev server
4. Test authentication flow
5. Test API calls in browser DevTools Network tab
6. Verify data persistence

## Current Mock Data Structure

### Authentication Mock
```typescript
{
  user: {
    id: 'user_123',
    name: 'Amaka Okoro',
    email: 'amaka@techventures.ng',
    accountType: 'business',
  },
  isAuthenticated: true,
}
```

### Certificates Mock
```typescript
[
  {
    id: 'cert_001',
    name: 'NHIA Certificate',
    shortName: 'NHIA',
    status: 'active',
    expiryDate: '2024-12-31',
    daysToExpiry: 234,
    certificateNumber: 'NHIA-2024-001',
    isApiVerified: true,
  },
  // ... more certificates
]
```

### Dashboard Mock
```typescript
{
  summary: {
    score: 85,
    procurementReady: true,
    activeCertificates: 5,
    expiringCount: 1,
    expiredCount: 0,
    pendingCount: 0,
  },
  recentActivity: [...],
  alerts: [...],
}
```

## Local Storage Usage

The frontend uses local storage for:
- **Audit trail:** `clearpass_audit_trail`
- **Rate limits:** `clearpass_rate_limits`
- **Notification queue:** `clearpass_email_queue`, `clearpass_sms_queue`
- **Notification history:** `clearpass_notification_history`
- **User preferences:** Various keys for settings
- **Onboarding state:** `clearpass_onboarded`

**Note:** When backend is reconnected, some of these may need to be migrated to server-side storage.

## Development Workflow

### Current (Backend Disconnected)
1. Frontend runs independently
2. All data is mock/local
3. Perfect for UI/UX development
4. No backend dependencies

### After Reconnection
1. Frontend makes real API calls
2. Data persists in backend database
3. Real authentication
4. Government API integrations work

## Troubleshooting

### Issue: "BACKEND_DISCONNECTED" error
**Cause:** API client is still in disconnected mode
**Solution:** Update `VITE_USE_MOCKS=false` in environment variables

### Issue: CORS errors
**Cause:** Backend not configured to allow frontend origin
**Solution:** Update backend CORS configuration

### Issue: Authentication not working
**Cause:** Backend auth endpoints not implemented
**Solution:** Implement auth endpoints in backend

### Issue: Data not persisting
**Cause:** Frontend still using local storage
**Solution:** Ensure backend endpoints are called and data is saved to database

## Files Modified for Disconnection

1. **`src/app/api/client.ts`** - Modified to always use mocks
2. **`.env`** - Set `VITE_USE_MOCKS=true`
3. **`.env.example`** - Updated for mock-only mode
4. **`.env.production`** - Set `VITE_USE_MOCKS=true`

## Files to Restore for Reconnection

1. **`src/app/api/client.ts`** - Restore original `readEnv()` and `request()` functions
2. **Environment files** - Set `VITE_USE_MOCKS=false` and `VITE_API_BASE_URL`

## Support

For questions about:
- **Frontend UI/UX:** Work with frontend as-is
- **Backend API Development:** Build according to endpoint specifications above
- **Integration:** Follow the reconnection steps when backend is ready

## Summary

✅ **Frontend is fully functional** without backend
✅ **All features work** with local mock data
✅ **Perfect for** parallel development
✅ **Easy to reconnect** when backend is ready

The frontend and backend can now be developed **independently** and **in parallel**!