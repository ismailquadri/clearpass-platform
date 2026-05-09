# ClearPass Frontend - Quick Start Action Plan

**Created:** May 9, 2026  
**Purpose:** Immediate actionable steps to validate frontend quality  
**Time to Complete:** 2-3 days

---

## 🚀 Phase 1: Setup Development Infrastructure (Day 1)

### Step 1: Install Essential Development Tools

**Time:** 30 minutes  
**Priority:** CRITICAL

Run these commands in your project directory:

```bash
# Install ESLint and TypeScript linting rules
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh

# Install Prettier for code formatting
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Install Git hooks for automated checks
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Step 2: Create Configuration Files

**Time:** 45 minutes  
**Priority:** CRITICAL

Create `.eslintrc.json`:
```json
{
  "root": true,
  "env": { "browser": true, "es2020": true },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "prettier"
  ],
  "ignorePatterns": ["dist", ".eslintrc.json"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react-refresh", "@typescript-eslint"],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn"
  },
  "settings": {
    "react": { "version": "18.3.1" }
  }
}
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

Create `.prettierignore`:
```
node_modules
dist
build
coverage
.next
.out
pnpm-lock.yaml
package-lock.json
```

Create `lint-staged.config.js`:
```javascript
module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
};
```

### Step 3: Update package.json Scripts

**Time:** 15 minutes  
**Priority:** HIGH

Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\"",
    "type-check": "tsc --noEmit"
  }
}
```

### Step 4: Run Initial Linting

**Time:** 30 minutes  
**Priority:** HIGH

```bash
# Check for linting errors
npm run lint

# Auto-fix what can be fixed
npm run lint:fix

# Format all code
npm run format
```

**Success Criteria:** Zero linting errors after auto-fix

---

## 🔧 Phase 2: Fix Critical Code Issues (Day 1-2)

### Step 5: Create Constants File

**Time:** 30 minutes  
**Priority:** HIGH

Create `src/constants/routes.ts`:
```typescript
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

export type Route = typeof ROUTES[keyof typeof ROUTES];
export type DashboardState = typeof DASHBOARD_STATES[keyof typeof DASHBOARD_STATES];
export type Portal = typeof PORTALS[keyof typeof PORTALS];
```

### Step 6: Fix Inline Styles in App.tsx

**Time:** 15 minutes  
**Priority:** HIGH

Replace inline styles with Tailwind classes in `src/app/App.tsx`:
```typescript
// BEFORE
<h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
</h2>

// AFTER
<h2 className="text-2xl mb-2">
  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
</h2>
```

### Step 7: Add Default Cases to Switch Statements

**Time:** 1 hour  
**Priority:** HIGH

Update `src/app/App.tsx` renderMainContent function:
```typescript
const renderMainContent = () => {
  // Business Portal Routes
  if (selectedPersona === 'Business') {
    switch (activeSection) {
      case 'overview':
        return <StateAwareDashboard state={selectedState} onNavigate={setActiveSection} />;
      case 'certificates':
        return <CertificatesView />;
      case 'verify':
        return <BusinessVerifyView />;
      case 'activity':
        return <ActivityLogView />;
      case 'reports':
        return <ReportsView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <SettingsView />;
      default:
        console.warn(`Unknown Business section: ${activeSection}`);
        return (
          <div className="flex-1 h-screen overflow-y-auto bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl mb-2">Section Not Found</h2>
              <p className="text-muted-foreground">
                The section "{activeSection}" is not available.
              </p>
            </div>
          </div>
        );
    }
  }

  // MDA Portal Routes
  if (selectedPersona === 'MDA') {
    switch (activeSection) {
      case 'verify':
        return <MDAVerifyView />;
      case 'prequalification':
        return <MDAPrequalificationView />;
      case 'settings':
        return <SettingsView />;
      default:
        console.warn(`Unknown MDA section: ${activeSection}`);
        return <div>MDA section not found</div>;
    }
  }

  // Partner Portal Routes
  if (selectedPersona === 'Partner') {
    switch (activeSection) {
      case 'clients':
        return <PartnerClientsView />;
      case 'analytics':
        return <PartnerAnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        console.warn(`Unknown Partner section: ${activeSection}`);
        return <div>Partner section not found</div>;
    }
  }

  // Fallback for unknown persona
  console.warn(`Unknown persona: ${selectedPersona}`);
  return <div>Portal not found</div>;
};
```

### Step 8: Create Error Boundary Component

**Time:** 45 minutes  
**Priority:** HIGH

Create `src/app/components/ErrorBoundary.tsx`:
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    // TODO: Log to error reporting service when available
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              An error occurred while rendering this page. Please try refreshing.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
              >
                Try Again
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

Update `src/app/App.tsx` to use ErrorBoundary:
```typescript
import ErrorBoundary from './components/ErrorBoundary';

// In the return statement:
return (
  <ErrorBoundary>
    <ToastProvider>
      <div className="size-full flex">
        {renderSidebar()}
        {renderMainContent()}
        {/* Tweaks Panel */}
        <TweaksButton onClick={() => setIsTweaksPanelOpen(true)} />
        <TweaksPanel
          isOpen={isTweaksPanelOpen}
          onClose={() => setIsTweaksPanelOpen(false)}
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
          selectedState={selectedState}
          onStateChange={setSelectedState}
        />
        {/* Onboarding Flow */}
        {showOnboarding && <OnboardingFlow onComplete={() => setShowOnboarding(false)} />}
      </div>
    </ToastProvider>
  </ErrorBoundary>
);
```

---

## 📋 Phase 3: Create TypeScript Configuration (Day 2)

### Step 9: Setup Strict TypeScript Configuration

**Time:** 30 minutes  
**Priority:** HIGH

Create `tsconfig.json`:
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
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### Step 10: Run Type Check

**Time:** 15 minutes  
**Priority:** HIGH

```bash
npm run type-check
```

Fix any TypeScript errors that appear. This may require:
- Adding proper type annotations
- Fixing implicit any types
- Adding missing type imports

---

## 🧪 Phase 4: Basic Testing Setup (Day 2)

### Step 11: Install Testing Dependencies

**Time:** 30 minutes  
**Priority:** HIGH

```bash
# Install Vitest for unit testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Install Playwright for E2E testing
npm install --save-dev @playwright/test
```

### Step 12: Configure Vitest

**Time:** 20 minutes  
**Priority:** HIGH

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
```

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

### Step 13: Update package.json with Test Scripts

**Time:** 10 minutes  
**Priority:** HIGH

Add to `package.json` scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## ✅ Phase 5: Validation & Verification (Day 2-3)

### Step 14: Run Complete Validation

**Time:** 1 hour  
**Priority:** CRITICAL

```bash
# 1. Type checking
npm run type-check

# 2. Linting
npm run lint

# 3. Code formatting
npm run format:check

# 4. Build test
npm run build

# 5. Development server test
npm run dev
```

### Step 15: Manual Testing Checklist

**Time:** 2-3 hours  
**Priority:** HIGH

Test all three portals:
- [ ] Business Portal - All navigation works
- [ ] MDA Portal - All navigation works
- [ ] Partner Portal - All navigation works

Test all dashboard states:
- [ ] Healthy state displays correctly
- [ ] Attention Required state displays correctly
- [ ] Critical state displays correctly
- [ ] Non-Compliant state displays correctly
- [ ] New Registration state displays correctly
- [ ] Pending Verification state displays correctly

Test certificate upload:
- [ ] File upload works
- [ ] Manual entry works
- [ ] API connect simulation works

Test modals:
- [ ] All modals open correctly
- [ ] All modals close correctly
- [ ] Backdrop click closes modals

Test error handling:
- [ ] Error boundary catches errors
- [ ] Toast notifications appear correctly
- [ ] Form validation shows errors

---

## 📊 Phase 6: Performance Quick Check (Day 3)

### Step 16: Install Lighthouse CI

**Time:** 20 minutes  
**Priority:** MEDIUM

```bash
npm install --save-dev @lhci/cli
```

Create `lighthouserc.json`:
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Step 17: Build and Analyze

**Time:** 30 minutes  
**Priority:** MEDIUM

```bash
# Build the project
npm run build

# Run Lighthouse CI
npx lhci autorun
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 80

---

## 🎯 Success Criteria

Before moving to backend development, ensure:

### Code Quality ✅
- [ ] Zero ESLint errors
- [ ] Zero TypeScript errors
- [ ] All code formatted with Prettier
- [ ] Pre-commit hooks working

### Functionality ✅
- [ ] All three portals work correctly
- [ ] All navigation works
- [ ] All modals function properly
- [ ] Error handling works
- [ ] Form validation works

### Performance ✅
- [ ] Build completes without errors
- [ ] Lighthouse score > 90
- [ ] No console errors in browser
- [ ] Fast page load (< 3s)

### Testing ✅
- [ ] Testing infrastructure setup
- [ ] Can run tests successfully
- [ ] At least basic component tests written

---

## 📝 Summary Timeline

| Phase | Duration | Priority | Status |
|-------|----------|----------|--------|
| Phase 1: Setup Infrastructure | Day 1 (2 hours) | CRITICAL | ⏳ Ready |
| Phase 2: Fix Critical Issues | Day 1-2 (3 hours) | HIGH | ⏳ Ready |
| Phase 3: TypeScript Config | Day 2 (1 hour) | HIGH | ⏳ Ready |
| Phase 4: Testing Setup | Day 2 (1 hour) | HIGH | ⏳ Ready |
| Phase 5: Validation | Day 2-3 (4 hours) | CRITICAL | ⏳ Ready |
| Phase 6: Performance Check | Day 3 (1 hour) | MEDIUM | ⏳ Ready |

**Total Time:** 2-3 days  
**Effort:** Medium  
**Impact:** High

---

## 🚀 Next Steps After Completion

1. **Run Full Test Suite:** Execute all tests to ensure nothing broke
2. **Commit Changes:** Commit all improvements with descriptive message
3. **Create Branch:** Create new branch for backend development
4. **Begin Backend Setup:** Start Node.js/Express backend development

---

## 📞 Support

If you encounter issues:
1. Check the detailed `FRONTEND_VALIDATION_PLAN.md`
2. Review `CODEBASE_ISSUES.md` for detailed explanations
3. Run `npm run lint` to see specific errors
4. Check browser console for runtime errors

---

**Document Owner:** Development Team  
**Last Updated:** May 9, 2026  
**Status:** Ready for Execution