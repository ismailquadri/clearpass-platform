import { useEffect, useState, lazy, Suspense, useTransition, useCallback } from 'react';
import { FileQuestion } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { GlobalNav } from './components/GlobalNav';
import { Sidebar } from './components/Sidebar';
import { MDASidebar } from './components/MDASidebar';
import { PartnerSidebar } from './components/PartnerSidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { HMOSidebar } from './components/HMOSidebar';
import { ToastProvider } from './components/ToastProvider';
import { AppShell } from './components/AppShell';
import { EmptyState } from './components/ui/EmptyState';
import { OfflineBanner } from './components/OfflineBanner';
import { AuthProvider, useAuth, type AccountType } from './context/AuthContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useCertificateNotifications } from './hooks/useCertificateNotifications';
import type { Persona } from './api/types';

const AuthView = lazy(() => import('./components/AuthView').then((m) => ({ default: m.AuthView })));

import {
  PageHeaderSkeleton,
  StatCardGridSkeleton,
  CertificateGridSkeleton,
  TableSkeleton,
  ChartSkeleton,
} from './components/ui/Skeleton';
import './sentry';
import { setupCoreWebVitals, setupMemoryMonitoring } from './utils/performance';
import { registerSW } from 'virtual:pwa-register';
import { prefetchLikelyRoutes, setupLinkPrefetching } from './utils/prefetch';

// Lazy-loaded views — each becomes its own JS chunk.
const StateAwareDashboard = lazy(() =>
  import('./components/StateAwareDashboard').then((m) => ({
    default: m.StateAwareDashboard,
  }))
);
const MDAVerifyView = lazy(() =>
  import('./components/MDAVerifyView').then((m) => ({ default: m.MDAVerifyView }))
);
const MDAPrequalificationView = lazy(() =>
  import('./components/MDAPrequalificationView').then((m) => ({
    default: m.MDAPrequalificationView,
  }))
);
const MDAReportsView = lazy(() =>
  import('./components/MDAReportsView').then((m) => ({ default: m.MDAReportsView }))
);
const MDAAuditTrailView = lazy(() =>
  import('./components/MDAAuditTrailView').then((m) => ({ default: m.MDAAuditTrailView }))
);
const PartnerClientsView = lazy(() =>
  import('./components/PartnerClientsView').then((m) => ({
    default: m.PartnerClientsView,
  }))
);
const PartnerActivityDigestView = lazy(() =>
  import('./components/PartnerActivityDigestView').then((m) => ({
    default: m.PartnerActivityDigestView,
  }))
);
const PartnerPortfolioView = lazy(() =>
  import('./components/PartnerPortfolioView').then((m) => ({
    default: m.PartnerPortfolioView,
  }))
);
const PartnerReportsView = lazy(() =>
  import('./components/PartnerReportsView').then((m) => ({
    default: m.PartnerReportsView,
  }))
);
const PartnerSettingsView = lazy(() =>
  import('./components/PartnerSettingsView').then((m) => ({
    default: m.PartnerSettingsView,
  }))
);
const PartnerAnalyticsView = lazy(() =>
  import('./components/PartnerAnalyticsView').then((m) => ({
    default: m.PartnerAnalyticsView,
  }))
);
const CertificatesView = lazy(() =>
  import('./components/CertificatesView').then((m) => ({
    default: m.CertificatesView,
  }))
);
const ActivityLogView = lazy(() =>
  import('./components/ActivityLogView').then((m) => ({
    default: m.ActivityLogView,
  }))
);
const BusinessVerifyView = lazy(() =>
  import('./components/BusinessVerifyView').then((m) => ({
    default: m.BusinessVerifyView,
  }))
);
const ReportsView = lazy(() =>
  import('./components/ReportsView').then((m) => ({ default: m.ReportsView }))
);
const AlertsView = lazy(() =>
  import('./components/AlertsView').then((m) => ({ default: m.AlertsView }))
);
const SettingsView = lazy(() =>
  import('./components/SettingsView').then((m) => ({ default: m.SettingsView }))
);
const OnboardingFlow = lazy(() =>
  import('./components/OnboardingFlow').then((m) => ({
    default: m.OnboardingFlow,
  }))
);
const BillingView = lazy(() =>
  import('./components/BillingView').then((m) => ({ default: m.BillingView }))
);
const PartnerBillingView = lazy(() =>
  import('./components/PartnerBillingView').then((m) => ({
    default: m.PartnerBillingView,
  }))
);
const ExpiryTimelineView = lazy(() =>
  import('./components/ExpiryTimelineView').then((m) => ({
    default: m.ExpiryTimelineView,
  }))
);
const DocumentVaultView = lazy(() =>
  import('./components/DocumentVaultView').then((m) => ({
    default: m.DocumentVaultView,
  }))
);
const CertificateGuidesView = lazy(() =>
  import('./components/CertificateGuidesView').then((m) => ({
    default: m.CertificateGuidesView,
  }))
);
const MDAWatchlistView = lazy(() =>
  import('./components/MDAWatchlistView').then((m) => ({
    default: m.MDAWatchlistView,
  }))
);
const QRScannerView = lazy(() =>
  import('./components/QRScannerView').then((m) => ({
    default: m.QRScannerView,
  }))
);
const MDASettingsView = lazy(() =>
  import('./components/MDASettingsView').then((m) => ({
    default: m.MDASettingsView,
  }))
);
const NHIADashboardView = lazy(() =>
  import('./components/NHIADashboardView').then((m) => ({
    default: m.NHIADashboardView,
  }))
);
const AdminPortalView = lazy(() =>
  import('./components/AdminPortalView').then((m) => ({
    default: m.AdminPortalView,
  }))
);
const HMOPortalView = lazy(() =>
  import('./components/HMOPortalView').then((m) => ({
    default: m.HMOPortalView,
  }))
);
const CompanyProfile = lazy(() =>
  import('./components/CompanyProfile').then((m) => ({
    default: m.CompanyProfile,
  }))
);
const WorkersView = lazy(() =>
  import('./components/WorkersView').then((m) => ({
    default: m.WorkersView,
  }))
);
const ComplianceView = lazy(() =>
  import('./components/ComplianceView').then((m) => ({
    default: m.ComplianceView,
  }))
);

// ─── Per-route skeleton fallbacks ───────────────────────────────────────────
// Pick a fallback that mirrors the destination view so the layout doesn't
// jump when the chunk arrives.

function ViewShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <ViewShell>
      <PageHeaderSkeleton />
      <div className="space-y-6">
        <StatCardGridSkeleton />
        <CertificateGridSkeleton count={6} />
      </div>
    </ViewShell>
  );
}

function CertificatesSkeleton() {
  return (
    <ViewShell>
      <PageHeaderSkeleton />
      <div className="space-y-6">
        <StatCardGridSkeleton />
        <CertificateGridSkeleton count={6} />
      </div>
    </ViewShell>
  );
}

function ActivitySkeleton() {
  return (
    <ViewShell>
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} />
    </ViewShell>
  );
}

function AnalyticsSkeleton() {
  return (
    <ViewShell>
      <PageHeaderSkeleton />
      <div className="space-y-6">
        <StatCardGridSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    </ViewShell>
  );
}

function GenericSkeleton() {
  return (
    <ViewShell>
      <PageHeaderSkeleton />
      <TableSkeleton rows={5} />
    </ViewShell>
  );
}

// ─── Section-not-found fallback ─────────────────────────────────────────────

function SectionNotFound({
  persona,
  section,
  onHome,
}: {
  persona: Persona;
  section: string;
  onHome: () => void;
}) {
  return (
    <ViewShell>
      <EmptyState
        icon={FileQuestion}
        title="Section Not Available"
        description={`"${section}" isn't part of the ${persona} portal yet. We'll let you know when it ships.`}
        action={{ label: 'Back to home', onClick: onHome }}
      />
    </ViewShell>
  );
}

// ─── Persona mapping ────────────────────────────────────────────────────────

const ACCOUNT_TYPE_TO_PERSONA: Record<AccountType, 'Business' | 'MDA' | 'Partner' | 'HMO' | 'Admin'> = {
  business: 'Business',
  mda: 'MDA',
  partner: 'Partner',
  hmo: 'HMO',
  admin: 'Admin',
};

// ─── Auth-gated app shell ────────────────────────────────────────────────────

function AppInner() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('clearpass_onboarded')
  );
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedPersona, setSelectedPersona] = useState<'Business' | 'MDA' | 'Partner' | 'HMO' | 'Admin'>('Business');
  const [isPending, startTransition] = useTransition();
  const isOnline = useOnlineStatus();
  useCertificateNotifications();

  // Stable navigate — wraps section-only changes in startTransition.
  // Memoised so child components don't re-render unnecessarily.
  const navigate = useCallback(
    (section: string) => startTransition(() => setActiveSection(section)),
    [startTransition]
  );

  // Allow deep navigation from within portal components without introducing
  // a full router. Components can dispatch `clearpass:navigate` with a target
  // persona + section.
  useEffect(() => {
    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { persona?: Persona | 'Business' | 'MDA' | 'Partner' | 'HMO' | 'Admin'; section?: string }
        | undefined;
      if (!detail?.section) return;
      // Batch persona + section in ONE transition so they always apply together.
      startTransition(() => {
        if (detail.persona) setSelectedPersona(detail.persona as any);
        setActiveSection(detail.section!);
      });
    };
    window.addEventListener('clearpass:navigate', onNavigate as EventListener);
    return () => window.removeEventListener('clearpass:navigate', onNavigate as EventListener);
  }, []);

  // When a user logs in, sync the persona from their account type.
  useEffect(() => {
    if (user) {
      const persona = ACCOUNT_TYPE_TO_PERSONA[user.accountType];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPersona(persona);

      setActiveSection(() => {
        if (persona === 'Business') return 'overview';
        if (persona === 'MDA') return 'nhia-overview';
        if (persona === 'HMO') return 'hmo-overview';
        if (persona === 'Admin') return 'admin-overview';
        return 'clients';
      });

      setShowOnboarding(false);
    }
  }, [user]);

  // One-shot setup on mount — must be above early returns (Rules of Hooks).
  useEffect(() => {
    setupCoreWebVitals();
    setupMemoryMonitoring();
    setupLinkPrefetching();

    if (import.meta.env.PROD) {
      registerSW({
        onNeedRefresh() {},
        onOfflineReady() {},
      });
    }
  }, []);

  // Re-run prefetch when the user navigates.
  useEffect(() => {
    prefetchLikelyRoutes(`/${activeSection}`);
  }, [activeSection]);

  // Loading state — brief spinner while localStorage is read.
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <img src="/clearpass-logo.svg" alt="ClearPass" className="h-10 w-auto animate-pulse" />
          <p className="text-muted-foreground text-sm">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  // Auth gate — show auth view directly.
  if (!isAuthenticated) {
    return (
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-background">
            <img src="/clearpass-logo.svg" alt="ClearPass" className="h-10 w-auto animate-pulse" />
          </div>
        }
      >
        <AuthView onAuthenticated={() => {}} />
      </Suspense>
    );
  }

  const handlePersonaChange = (persona: Persona) => {
    // Both persona AND section must change atomically in one transition —
    // splitting them creates an intermediate render where persona is new
    // but section is still from the old persona, hitting SectionNotFound.
    startTransition(() => {
      setSelectedPersona(persona);
      if (persona === 'Business') setActiveSection('overview');
      else if (persona === 'MDA') setActiveSection('nhia-overview');
      else if (persona === 'HMO') setActiveSection('hmo-overview');
      else if (persona === 'Admin') setActiveSection('admin-overview');
      else setActiveSection('clients');
    });
  };

  const handleOnboardingComplete = (persona: Persona) => {
    localStorage.setItem('clearpass_onboarded', '1');
    handlePersonaChange(persona);
    setShowOnboarding(false);
  };

  const goHome = () => {
    if (selectedPersona === 'Business') navigate('overview');
    else if (selectedPersona === 'MDA') navigate('nhia-overview');
    else if (selectedPersona === 'HMO') navigate('hmo-overview');
    else if (selectedPersona === 'Admin') navigate('admin-overview');
    else navigate('clients');
  };

  // Sidebar factory (one for desktop, one for the drawer that closes itself).
  const renderSidebar = (onItemSelect?: () => void) => {
    const props = {
      activeSection,
      onSectionChange: navigate,
      onItemSelect,
    };
    switch (selectedPersona) {
      case 'Business':
        return <Sidebar {...props} fluid={!!onItemSelect} />;
      case 'MDA':
        return <MDASidebar {...props} fluid={!!onItemSelect} />;
      case 'Partner':
        return <PartnerSidebar {...props} fluid={!!onItemSelect} />;
      case 'HMO':
        return <HMOSidebar {...props} fluid={!!onItemSelect} />;
      case 'Admin':
        return <AdminSidebar {...props} fluid={!!onItemSelect} />;
    }
  };

  const renderMainContent = () => {
    if (selectedPersona === 'Business') {
      switch (activeSection) {
        case 'overview':
          return (
            <Suspense fallback={<DashboardSkeleton />}>
              <StateAwareDashboard onNavigate={navigate} />
            </Suspense>
          );
        case 'certificates':
          return (
            <Suspense fallback={<CertificatesSkeleton />}>
              <CertificatesView />
            </Suspense>
          );
        case 'verify':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <BusinessVerifyView />
            </Suspense>
          );
        case 'expiry-timeline':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <ExpiryTimelineView />
            </Suspense>
          );
        case 'document-vault':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <DocumentVaultView />
            </Suspense>
          );
        case 'certificate-guides':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <CertificateGuidesView />
            </Suspense>
          );
        case 'activity':
          return (
            <Suspense fallback={<ActivitySkeleton />}>
              <ActivityLogView />
            </Suspense>
          );
        case 'reports':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <ReportsView />
            </Suspense>
          );
        case 'alerts':
          return (
            <Suspense fallback={<ActivitySkeleton />}>
              <AlertsView />
            </Suspense>
          );
        case 'billing':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <BillingView />
            </Suspense>
          );
        case 'settings':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <SettingsView />
            </Suspense>
          );
        case 'company-profile':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <CompanyProfile />
            </Suspense>
          );
        case 'workers':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <WorkersView />
            </Suspense>
          );
        case 'compliance':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <ComplianceView />
            </Suspense>
          );
        default:
          return <SectionNotFound persona="Business" section={activeSection} onHome={goHome} />;
      }
    }

    if (selectedPersona === 'MDA') {
      switch (activeSection) {
        case 'nhia-overview':
          return (
            <Suspense fallback={<DashboardSkeleton />}>
              <NHIADashboardView onNavigate={navigate} />
            </Suspense>
          );
        case 'verify':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <MDAVerifyView />
            </Suspense>
          );
        case 'scan':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <QRScannerView />
            </Suspense>
          );
        case 'prequalification':
          return (
            <Suspense fallback={<ActivitySkeleton />}>
              <MDAPrequalificationView />
            </Suspense>
          );
        case 'reports':
          return (
            <Suspense fallback={<ActivitySkeleton />}>
              <MDAReportsView />
            </Suspense>
          );
        case 'watchlist':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <MDAWatchlistView />
            </Suspense>
          );
        case 'audit':
          return (
            <Suspense fallback={<ActivitySkeleton />}>
              <MDAAuditTrailView />
            </Suspense>
          );
        case 'settings':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <MDASettingsView />
            </Suspense>
          );
        default:
          return <SectionNotFound persona="MDA" section={activeSection} onHome={goHome} />;
      }
    }

    if (selectedPersona === 'HMO') {
      return (
        <Suspense fallback={<GenericSkeleton />}>
          <HMOPortalView section={activeSection} />
        </Suspense>
      );
    }

    if (selectedPersona === 'Admin') {
      return (
        <Suspense fallback={<GenericSkeleton />}>
          <AdminPortalView section={activeSection} />
        </Suspense>
      );
    }

    // Partner
    switch (activeSection) {
      case 'clients':
        return (
          <Suspense fallback={<ActivitySkeleton />}>
            <PartnerClientsView />
          </Suspense>
        );
      case 'portfolio':
        return (
          <Suspense fallback={<AnalyticsSkeleton />}>
            <PartnerPortfolioView />
          </Suspense>
        );
      case 'reports':
        return (
          <Suspense fallback={<ActivitySkeleton />}>
            <PartnerReportsView />
          </Suspense>
        );
      case 'activity-digest':
        return (
          <Suspense fallback={<ActivitySkeleton />}>
            <PartnerActivityDigestView />
          </Suspense>
        );
      case 'analytics':
        return (
          <Suspense fallback={<AnalyticsSkeleton />}>
            <PartnerAnalyticsView />
          </Suspense>
        );
      case 'billing':
        return (
          <Suspense fallback={<GenericSkeleton />}>
            <PartnerBillingView />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<GenericSkeleton />}>
            <PartnerSettingsView />
          </Suspense>
        );
      default:
        return <SectionNotFound persona="Partner" section={activeSection} onHome={goHome} />;
    }
};

  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <OfflineBanner isOnline={isOnline} />

      <GlobalNav
        activeSection={activeSection}
        onNavigate={navigate}
      />

      <div className="h-full box-border">
        <AppShell
          persona={selectedPersona}
          sidebar={renderSidebar()}
          drawerSidebar={(close) => renderSidebar(close)}
          activeSection={activeSection}
          onSectionChange={navigate}
        >
          {/* Navigation progress bar — shown during lazy chunk loads */}
          {isPending && (
            <div
              aria-hidden="true"
              className="fixed top-0 left-0 right-0 z-[100] h-[3px] overflow-hidden"
            >
              <div
                className="h-full animate-[progress_600ms_ease-in-out_infinite]"
                style={{ background: 'var(--mda-primary, #057a46)', width: '100%' }}
              />
            </div>
          )}
          {/* key re-mounts on each nav → triggers cp-view-enter fade-in */}
          <div key={activeSection} className="cp-view-enter h-full">
            {renderMainContent()}
          </div>
        </AppShell>
      </div>

      {showOnboarding && (
        <Suspense fallback={null}>
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </Suspense>
      )}
    </>
  );
}

// ─── Root — providers only ───────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppInner />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
