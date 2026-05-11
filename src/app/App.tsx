import { useEffect, useState, lazy, Suspense } from 'react';
import { FileQuestion } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { MDASidebar } from './components/MDASidebar';
import { PartnerSidebar } from './components/PartnerSidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { HMOSidebar } from './components/HMOSidebar';
import { ToastProvider } from './components/ToastProvider';
import { AppShell } from './components/AppShell';
import { EmptyState } from './components/ui/EmptyState';
import { OfflineBanner } from './components/OfflineBanner';
import { AchievementNotification } from './components/AchievementNotification';
import { GamificationProvider, useGamification } from './contexts/GamificationContext';
import { AuthProvider, useAuth, type AccountType } from './context/AuthContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const AuthView = lazy(() =>
  import('./components/AuthView').then((m) => ({ default: m.AuthView }))
);

// Inner component that uses the gamification context
function AppContent() {
  const { newlyUnlocked, clearNewlyUnlocked } = useGamification();
  const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);

  // Update unlocked achievements when context changes
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
      clearNewlyUnlocked();
    }
  }, [newlyUnlocked, clearNewlyUnlocked]);

  return (
    <>
      {unlockedAchievements.length > 0 && (
        <AchievementNotification
          achievements={unlockedAchievements}
          onClose={() => setUnlockedAchievements([])}
        />
      )}
    </>
  );
}
import {
  PageHeaderSkeleton,
  StatCardGridSkeleton,
  CertificateGridSkeleton,
  TableSkeleton,
  ChartSkeleton,
} from './components/ui/Skeleton';
import {
  TweaksPanel,
  TweaksButton,
  DASHBOARD_STATES,
  type Persona,
  type DashboardState,
} from './components/TweaksPanel';
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

const ACCOUNT_TYPE_TO_PERSONA: Record<AccountType, Persona> = {
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
  const [isTweaksPanelOpen, setIsTweaksPanelOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona>('Business');
  const [selectedState, setSelectedState] = useState<DashboardState>(
    DASHBOARD_STATES[1] // Attention Required
  );
  const isOnline = useOnlineStatus();

  // When a user logs in, sync the persona from their account type.
  useEffect(() => {
    if (user) {
      const persona = ACCOUNT_TYPE_TO_PERSONA[user.accountType];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPersona(persona);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection(() => {
        if (persona === 'Business') return 'overview';
        if (persona === 'MDA') return 'verify';
        if (persona === 'HMO') return 'hmo-overview';
        if (persona === 'Admin') return 'admin-overview';
        return 'clients';
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
          <p className="text-muted-foreground" style={{ fontSize: '14px' }}>Loading…</p>
        </div>
      </div>
    );
  }

  // Auth gate — show login screen when no session exists.
  if (!isAuthenticated) {
    return (
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-background">
          <img src="/clearpass-logo.svg" alt="ClearPass" className="h-10 w-auto animate-pulse" />
        </div>
      }>
        <AuthView onAuthenticated={() => {}} />
      </Suspense>
    );
  }

  const handlePersonaChange = (persona: Persona) => {
    setSelectedPersona(persona);
    if (persona === 'Business') setActiveSection('overview');
    else if (persona === 'MDA') setActiveSection('verify');
    else if (persona === 'HMO') setActiveSection('hmo-overview');
    else if (persona === 'Admin') setActiveSection('admin-overview');
    else setActiveSection('clients');
  };

  const handleOnboardingComplete = (persona: Persona) => {
    localStorage.setItem('clearpass_onboarded', '1');
    handlePersonaChange(persona);
    setShowOnboarding(false);
  };

  const goHome = () => {
    if (selectedPersona === 'Business') setActiveSection('overview');
    else if (selectedPersona === 'MDA') setActiveSection('verify');
    else if (selectedPersona === 'HMO') setActiveSection('hmo-overview');
    else if (selectedPersona === 'Admin') setActiveSection('admin-overview');
    else setActiveSection('clients');
  };

  // Sidebar factory (one for desktop, one for the drawer that closes itself).
  const renderSidebar = (onItemSelect?: () => void) => {
    const props = {
      activeSection,
      onSectionChange: setActiveSection,
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
              <StateAwareDashboard state={selectedState} onNavigate={setActiveSection} />
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
        default:
          return <SectionNotFound persona="Business" section={activeSection} onHome={goHome} />;
      }
    }

    if (selectedPersona === 'MDA') {
      switch (activeSection) {
        case 'verify':
          return (
            <Suspense fallback={<GenericSkeleton />}>
              <MDAVerifyView />
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
              <SettingsView />
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

      <AppShell
        persona={selectedPersona}
        sidebar={renderSidebar()}
        drawerSidebar={(close) => renderSidebar(close)}
      >
        {renderMainContent()}
      </AppShell>

      <TweaksButton onClick={() => setIsTweaksPanelOpen(true)} />
      <TweaksPanel
        isOpen={isTweaksPanelOpen}
        onClose={() => setIsTweaksPanelOpen(false)}
        selectedPersona={selectedPersona}
        onPersonaChange={handlePersonaChange}
        selectedState={selectedState}
        onStateChange={setSelectedState}
      />

      {showOnboarding && (
        <Suspense fallback={null}>
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </Suspense>
      )}

      <AppContent />
    </>
  );
}

// ─── Root — providers only ───────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GamificationProvider>
          <ToastProvider>
            <AppInner />
          </ToastProvider>
        </GamificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
