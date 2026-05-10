import { useEffect, useState, lazy, Suspense } from 'react';
import { FileQuestion } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { MDASidebar } from './components/MDASidebar';
import { PartnerSidebar } from './components/PartnerSidebar';
import { ToastProvider } from './components/ToastProvider';
import { AppShell } from './components/AppShell';
import { EmptyState } from './components/ui/EmptyState';
import { OfflineBanner } from './components/OfflineBanner';
import { useOnlineStatus } from './hooks/useOnlineStatus';
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

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
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

  // One-shot setup on mount.
  useEffect(() => {
    setupCoreWebVitals();
    setupMemoryMonitoring();
    setupLinkPrefetching();

    if (import.meta.env.PROD) {
      registerSW({
        onNeedRefresh() {
          // SW: a fresh build is available. Hard reload picks it up next nav.
        },
        onOfflineReady() {
          // SW: app is now usable offline.
        },
      });
    }
  }, []);

  // Re-run prefetch when the user navigates.
  useEffect(() => {
    prefetchLikelyRoutes(`/${activeSection}`);
  }, [activeSection]);

  const handlePersonaChange = (persona: Persona) => {
    setSelectedPersona(persona);
    if (persona === 'Business') setActiveSection('overview');
    else if (persona === 'MDA') setActiveSection('verify');
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
    <ErrorBoundary>
      <ToastProvider>
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
      </ToastProvider>
    </ErrorBoundary>
  );
}
