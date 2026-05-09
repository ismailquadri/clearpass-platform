import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MDASidebar } from './components/MDASidebar';
import { PartnerSidebar } from './components/PartnerSidebar';
import { StateAwareDashboard } from './components/StateAwareDashboard';
import { MDAVerifyView } from './components/MDAVerifyView';
import { MDAPrequalificationView } from './components/MDAPrequalificationView';
import { PartnerClientsView } from './components/PartnerClientsView';
import { PartnerAnalyticsView } from './components/PartnerAnalyticsView';
import { CertificatesView } from './components/CertificatesView';
import { ActivityLogView } from './components/ActivityLogView';
import { BusinessVerifyView } from './components/BusinessVerifyView';
import { ReportsView } from './components/ReportsView';
import { AlertsView } from './components/AlertsView';
import { SettingsView } from './components/SettingsView';
import { ToastProvider } from './components/ToastProvider';
import { OnboardingFlow } from './components/OnboardingFlow';
import {
  TweaksPanel,
  TweaksButton,
  DASHBOARD_STATES,
  type Persona,
  type DashboardState,
} from './components/TweaksPanel';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isTweaksPanelOpen, setIsTweaksPanelOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona>('Business');
  const [selectedState, setSelectedState] = useState<DashboardState>(DASHBOARD_STATES[1]); // Attention Required

  // Reset active section when persona changes
  const handlePersonaChange = (persona: Persona) => {
    setSelectedPersona(persona);
    if (persona === 'Business') {
      setActiveSection('overview');
    } else if (persona === 'MDA') {
      setActiveSection('verify');
    } else {
      setActiveSection('clients');
    }
  };

  // Render appropriate sidebar based on persona
  const renderSidebar = () => {
    switch (selectedPersona) {
      case 'Business':
        return <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />;
      case 'MDA':
        return <MDASidebar activeSection={activeSection} onSectionChange={setActiveSection} />;
      case 'Partner':
        return <PartnerSidebar activeSection={activeSection} onSectionChange={setActiveSection} />;
    }
  };

  // Render main content based on persona and active section
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
      }
    }

    // For other sections, show placeholder
    return (
      <div className="flex-1 h-screen overflow-y-auto bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          <p className="text-muted-foreground">
            {selectedPersona} Portal - {activeSection} section coming soon
          </p>
        </div>
      </div>
    );
  };

  return (
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
  );
}