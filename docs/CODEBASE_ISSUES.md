# ClearPass Frontend - Known Issues & Inconsistencies

**Analysis Date:** May 9, 2026  
**Status:** Ready for Remediation  
**Priority:** HIGH

---

## Critical Issues

### 1. Missing Development Infrastructure

**Severity:** CRITICAL  
**Impact:** No code quality enforcement, potential for bugs  
**Location:** Project root

**Issues:**
- No ESLint configuration
- No Prettier configuration
- No TypeScript strict mode
- No pre-commit hooks
- No automated testing
- No CI/CD pipeline

**Remediation:**
```bash
# Install linting tools
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Install testing tools
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @playwright/test

# Install git hooks
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

---

### 2. Inline Styles in React Components

**Severity:** HIGH  
**Impact:** Inconsistent styling, harder to maintain, not responsive  
**Location:** `src/app/App.tsx:107`

**Current Code:**
```typescript
<h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
</h2>
```

**Issue:** Inline styles override Tailwind classes, not responsive

**Fix:**
```typescript
<h2 className="text-2xl mb-2">
  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
</h2>
```

---

### 3. Magic Strings Throughout Codebase

**Severity:** HIGH  
**Impact:** Typos cause runtime errors, hard to refactor, no type safety  
**Location:** Multiple components

**Examples:**
```typescript
// App.tsx
setActiveSection('overview')
setActiveSection('certificates')
setActiveSection('verify')

// StateAwareDashboard.tsx
case 'Healthy':
case 'Attention Required':
case 'Critical':
```

**Fix:** Create constants file
```typescript
// src/constants/routes.ts
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
```

---

### 4. Missing Default Cases in Switch Statements

**Severity:** MEDIUM  
**Impact:** Potential undefined behavior, no error handling  
**Location:** Multiple components

**Example - App.tsx:58-101:**
```typescript
const renderMainContent = () => {
  if (selectedPersona === 'Business') {
    switch (activeSection) {
      case 'overview':
        return <StateAwareDashboard state={selectedState} onNavigate={setActiveSection} />;
      case 'certificates':
        return <CertificatesView />;
      // ... other cases
      // MISSING DEFAULT CASE
    }
  }
  // ... other personas
  // MISSING DEFAULT CASE
};
```

**Fix:**
```typescript
const renderMainContent = () => {
  if (selectedPersona === 'Business') {
    switch (activeSection) {
      case 'overview':
        return <StateAwareDashboard state={selectedState} onNavigate={setActiveSection} />;
      case 'certificates':
        return <CertificatesView />;
      // ... other cases
      default:
        console.warn(`Unknown section: ${activeSection}`);
        return <div>Section not found</div>;
    }
  }
  // ... other personas with default cases
};
```

---

### 5. No Error Boundaries

**Severity:** HIGH  
**Impact:** Component crashes break entire app, poor user experience  
**Location:** Application root

**Issue:** No error boundary to catch React component errors

**Fix:**
```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-4">
              An error occurred while rendering this page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Usage in App.tsx
<ErrorBoundary>
  <ToastProvider>
    {/* app content */}
  </ToastProvider>
</ErrorBoundary>
```

---

### 6. Hardcoded Mock Data in Components

**Severity:** MEDIUM  
**Impact:** Hard to test, hard to maintain, data duplication  
**Location:** Multiple components

**Example - StateAwareDashboard.tsx:28-200:**
```typescript
const getCertificatesForState = () => {
  switch (state.label) {
    case 'Healthy':
      return [
        {
          name: 'National Health Insurance Authority Certificate',
          shortName: 'NHIA',
          status: 'active' as const,
          daysToExpiry: 245,
          expiryDate: '15 Jan 2027',
          certificateNumber: 'NHIA/2026/FCT/AB12345678',
          isApiVerified: true,
        },
        // ... more hardcoded data
      ];
  }
};
```

**Fix:** Create separate mock data files
```typescript
// src/mock/certificates.ts
export const mockCertificates = {
  healthy: [
    {
      name: 'National Health Insurance Authority Certificate',
      shortName: 'NHIA',
      status: 'active' as const,
      daysToExpiry: 245,
      expiryDate: '15 Jan 2027',
      certificateNumber: 'NHIA/2026/FCT/AB12345678',
      isApiVerified: true,
    },
    // ... more certificates
  ],
  attentionRequired: [
    // ... certificates for attention required state
  ],
  // ... other states
};

// Usage in component
import { mockCertificates } from '@/mock/certificates';

const getCertificatesForState = () => {
  return mockCertificates[state.label.toLowerCase().replace(' ', '')] || [];
};
```

---

### 7. Missing Loading States

**Severity:** MEDIUM  
**Impact:** Poor UX during async operations, user confusion  
**Location:** All async operations

**Example - CertificateUploadModal.tsx:**
```typescript
const handleFileUpload = async () => {
  setIsUploading(true);
  // No loading indicator shown
  await uploadFile(selectedFile);
  setIsUploading(false);
};
```

**Fix:**
```typescript
const handleFileUpload = async () => {
  setIsUploading(true);
  try {
    await uploadFile(selectedFile);
    showToast('success', 'Upload Complete', 'Certificate uploaded successfully');
  } catch (error) {
    showToast('error', 'Upload Failed', 'Failed to upload certificate');
  } finally {
    setIsUploading(false);
  }
};

// In JSX
{isUploading && (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2">Uploading...</span>
  </div>
)}
```

---

## High Priority Issues

### 8. Inconsistent Component Naming

**Severity:** MEDIUM  
**Impact:** Confusing, harder to find components  
**Location:** Various component files

**Issues:**
- Some components use descriptive names: `CertificateUploadModal`
- Some use abbreviated names: `MDASidebar`, `MDAVerifyView`
- Inconsistent capitalization patterns

**Fix:** Standardize naming
```typescript
// Good
CertificateUploadModal.tsx
BusinessVerifyView.tsx
PartnerAnalyticsView.tsx

// Avoid (abbreviations)
MDASidebar.tsx → MdaSidebar.tsx or MetropolitanDevelopmentAgencySidebar.tsx
```

---

### 9. Missing TypeScript Strict Mode

**Severity:** MEDIUM  
**Impact:** Type safety compromised, potential runtime errors  
**Location:** `tsconfig.json`

**Current Configuration:** (file may not exist or have loose settings)

**Fix:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### 10. No Form Validation

**Severity:** HIGH  
**Impact:** Invalid data submission, poor UX  
**Location:** All form components

**Example - CertificateUploadModal.tsx:**
```typescript
const handleManualEntry = () => {
  // No validation
  if (!certificateNumber || !issuedDate || !expiryDate) {
    showToast('error', 'Missing Fields', 'Please fill all required fields');
    return;
  }
  // No format validation
};
```

**Fix:**
```typescript
// src/utils/validation.ts
export const validateCertificateNumber = (number: string): boolean => {
  const regex = /^[A-Z]{2}\/\d{4}\/[A-Z]{3}\/\d{8}$/;
  return regex.test(number);
};

export const validateDate = (date: string): boolean => {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};

export const validateExpiryDate = (expiryDate: string): boolean => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  return expiry > today;
};

// Usage in component
const handleManualEntry = () => {
  if (!certificateNumber.trim()) {
    showToast('error', 'Invalid Input', 'Certificate number is required');
    return;
  }
  
  if (!validateCertificateNumber(certificateNumber)) {
    showToast('error', 'Invalid Format', 'Certificate number format is invalid');
    return;
  }
  
  if (!validateDate(issuedDate)) {
    showToast('error', 'Invalid Date', 'Issue date is not valid');
    return;
  }
  
  if (!validateExpiryDate(expiryDate)) {
    showToast('error', 'Invalid Date', 'Expiry date must be in the future');
    return;
  }
  
  // Proceed with submission
};
```

---

### 11. No Environment Configuration

**Severity:** MEDIUM  
**Impact:** Hard to manage different environments, security risk  
**Location:** Project root

**Issue:** No `.env` files, environment variables hardcoded

**Fix:**
```bash
# .env.example
VITE_API_BASE_URL=https://api.clearpass.com.ng
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG=false
VITE_SENTRY_DSN=

# .env.development
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG=true

# .env.production
VITE_API_BASE_URL=https://api.clearpass.com.ng
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG=false
VITE_SENTRY_DSN=https://your-sentry-dsn
```

---

### 12. Missing Accessibility Attributes

**Severity:** HIGH  
**Impact:** Not accessible to screen readers, WCAG violation  
**Location:** Interactive components

**Examples:**
- Missing `aria-label` on icon-only buttons
- Missing `alt` text on images
- Missing `role` attributes on custom components
- Missing keyboard navigation support

**Fix:**
```typescript
// Button with icon only
<button
  onClick={handleCopy}
  aria-label="Copy certificate number to clipboard"
  className="p-2 hover:bg-accent rounded"
>
  <Copy className="w-4 h-4" />
</button>

// Modal with proper ARIA
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Upload Certificate</h2>
  <p id="modal-description">Choose your preferred upload method</p>
</div>

// Form labels
<label htmlFor="certificate-number">Certificate Number</label>
<input
  id="certificate-number"
  type="text"
  aria-required="true"
  aria-describedby="cert-number-hint"
/>
<span id="cert-number-hint" className="text-sm text-muted-foreground">
  Format: XX/YYYY/ZZZ/12345678
</span>
```

---

## Medium Priority Issues

### 13. Large Component Files

**Severity:** MEDIUM  
**Impact:** Hard to maintain, hard to test  
**Location:** Several components

**Examples:**
- `StateAwareDashboard.tsx`: 599 lines
- `CertificateUploadModal.tsx`: 514 lines
- `MDAVerifyView.tsx`: ~400 lines

**Fix:** Break down into smaller components
```typescript
// StateAwareDashboard.tsx → split into:
// - DashboardHeader.tsx
// - CertificateGrid.tsx
// - UrgencyBanner.tsx
// - QuickActions.tsx
// - ComplianceSummary.tsx

// CertificateUploadModal.tsx → split into:
// - UploadMethodSelector.tsx
// - FileUploadZone.tsx
// - ManualEntryForm.tsx
// - ApiConnectForm.tsx
// - UploadProgress.tsx
```

---

### 14. No PropTypes or TypeScript Interfaces for All Props

**Severity:** LOW  
**Impact:** Less type safety, harder to understand component API  
**Location:** Some components

**Fix:** Ensure all components have proper TypeScript interfaces
```typescript
interface CertificateCardProps {
  certificate: {
    name: string;
    shortName: string;
    status: 'active' | 'expiring' | 'expired' | 'not-connected';
    daysToExpiry: number;
    expiryDate: string;
    certificateNumber?: string;
    isApiVerified?: boolean;
  };
  onConnect?: () => void;
  onRenew?: () => void;
  onView?: () => void;
}

export function CertificateCard({ certificate, onConnect, onRenew, onView }: CertificateCardProps) {
  // component implementation
}
```

---

### 15. Inconsistent Error Handling

**Severity:** MEDIUM  
**Impact:** Poor UX, hard to debug  
**Location:** Various async operations

**Issue:** Some functions use try-catch, some don't; error handling inconsistent

**Fix:** Standardize error handling
```typescript
// src/utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, context: string) => {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof AppError) {
    showToast('error', 'Error', error.message);
  } else if (error instanceof Error) {
    showToast('error', 'Error', error.message);
  } else {
    showToast('error', 'Error', 'An unexpected error occurred');
  }
  
  // Log to error reporting service
  // logErrorToService(error, context);
};

// Usage
const handleUpload = async () => {
  try {
    await uploadCertificate(file);
    showToast('success', 'Success', 'Certificate uploaded');
  } catch (error) {
    handleError(error, 'CertificateUpload');
  }
};
```

---

### 16. No Internationalization (i18n) Support

**Severity:** LOW  
**Impact:** Limited to English only, not scalable  
**Location:** All hardcoded text

**Fix:** Setup i18n framework
```typescript
// npm install i18next react-i18next
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        'dashboard.overview': 'Overview',
        'dashboard.certificates': 'Certificates',
        'certificate.upload': 'Upload Certificate',
        // ... more translations
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
});

// Usage in components
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<h1>{t('dashboard.overview')}</h1>
```

---

## Low Priority Issues

### 17. Unused Dependencies

**Severity:** LOW  
**Impact:** Larger bundle size  
**Location:** `package.json`

**Potential Unused Dependencies:**
- `react-router` (not used, using conditional rendering)
- `react-slick` (may not be used)
- `react-responsive-masonry` (may not be used)

**Fix:** Audit and remove unused dependencies
```bash
npx depcheck
```

---

### 18. No Bundle Size Optimization

**Severity:** LOW  
**Impact:** Slower load times  
**Location:** Build configuration

**Fix:** Setup bundle analysis
```bash
npm install --save-dev rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({
      open: true,
      filename: 'dist/stats.html',
    }),
  ],
});
```

---

### 19. No Service Worker for Offline Support

**Severity:** LOW  
**Impact:** No offline capability  
**Location:** Project root

**Fix:** Add service worker
```bash
npm install vite-plugin-pwa
```

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
});
```

---

## Summary Statistics

### Issue Breakdown by Severity:
- **Critical:** 1 issue
- **High:** 7 issues  
- **Medium:** 7 issues
- **Low:** 3 issues

### Issue Breakdown by Category:
- **Code Quality:** 8 issues
- **Performance:** 3 issues
- **Accessibility:** 2 issues
- **Security:** 1 issue
- **Maintainability:** 4 issues

### Estimated Remediation Time:
- **Critical Issues:** 2-3 days
- **High Priority Issues:** 5-7 days
- **Medium Priority Issues:** 4-5 days
- **Low Priority Issues:** 2-3 days
- **Total:** ~13-18 days

---

## Recommended Fix Order

### Week 1 (Critical + High Priority):
1. Setup development infrastructure (Issue #1)
2. Add error boundaries (Issue #5)
3. Fix inline styles (Issue #2)
4. Create constants file (Issue #3)
5. Add default cases (Issue #4)
6. Extract mock data (Issue #6)
7. Add loading states (Issue #7)

### Week 2 (Medium Priority):
8. Standardize naming (Issue #8)
9. Enable TypeScript strict mode (Issue #9)
10. Add form validation (Issue #10)
11. Setup environment configuration (Issue #11)
12. Add accessibility attributes (Issue #12)

### Week 3 (Low Priority + Cleanup):
13. Break down large components (Issue #13)
14. Add TypeScript interfaces (Issue #14)
15. Standardize error handling (Issue #15)
16. Consider i18n support (Issue #16)
17. Remove unused dependencies (Issue #17)
18. Setup bundle optimization (Issue #18)
19. Add service worker (Issue #19)

---

## Success Criteria

### Completion Metrics:
- [ ] All critical issues resolved
- [ ] All high priority issues resolved
- [ ] All medium priority issues resolved
- [ ] Low priority issues addressed or documented
- [ ] Zero ESLint errors
- [ ] Zero TypeScript errors
- [ ] All tests passing
- [ ] Lighthouse score > 90

### Quality Gates:
- [ ] Code review approved
- [ ] QA testing passed
- [ ] Performance benchmarks met
- [ ] Accessibility compliance verified
- [ ] Documentation updated

---

## Next Steps

1. **Immediate (Today):**
   - Review this issues document
   - Prioritize based on team capacity
   - Setup development infrastructure (Issue #1)

2. **This Week:**
   - Resolve all critical and high priority issues
   - Setup testing infrastructure
   - Begin code quality improvements

3. **Next Week:**
   - Complete medium priority issues
   - Start comprehensive testing
   - Performance optimization

---

**Document Owner:** Development Team  
**Last Updated:** May 9, 2026  
**Next Review:** After critical issues resolved