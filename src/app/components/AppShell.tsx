import {
  CheckCircle2, Menu, Shield, Briefcase, X, HeartPulse, Building,
  LayoutDashboard, FileText, Bell, Settings, Search,
  BarChart3, Users, ClipboardList, CheckSquare,
  TrendingUp, QrCode, Home,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Persona } from '../api/types';
import '../styles/mda-theme.css';

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const BOTTOM_NAV_ITEMS: Record<Persona, NavItem[]> = {
  Business: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'certificates', label: 'Certificates', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  MDA: [
    { id: 'nhia-overview', label: 'Home', icon: Home },
    { id: 'verify', label: 'Verify', icon: Search },
    { id: 'scan', label: 'Scan QR', icon: QrCode },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ],
  Partner: [
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  HMO: [
    { id: 'hmo-overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'hmo-referrals', label: 'Referrals', icon: Users },
    { id: 'hmo-enrollments', label: 'Enroll', icon: ClipboardList },
    { id: 'hmo-settings', label: 'Settings', icon: Settings },
  ],
  Admin: [
    { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-review', label: 'Review', icon: CheckSquare },
    { id: 'admin-accounts', label: 'Accounts', icon: Users },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ],
};

interface AppShellProps {
  persona: Persona;
  /** Desktop sidebar (rendered hidden on small screens). */
  sidebar: ReactNode;
  /** Same component instance is also rendered inside the mobile drawer. */
  drawerSidebar: (closeDrawer: () => void) => ReactNode;
  /** Main content area. */
  children: ReactNode;
  /** Current active section for bottom nav highlighting */
  activeSection: string;
  /** Called when a bottom nav item is selected */
  onSectionChange: (section: string) => void;
}

const PERSONA_ICON: Record<Persona, typeof CheckCircle2> = {
  Business: CheckCircle2,
  MDA: Shield,
  Partner: Briefcase,
  HMO: HeartPulse,
  Admin: Building,
};

const PERSONA_LABEL: Record<Persona, string> = {
  Business: 'Business Portal',
  MDA: 'NHIA Portal',
  Partner: 'Partner Portal',
  HMO: 'HMO Portal',
  Admin: 'Admin Portal',
};

const PERSONA_COLOR: Record<Persona, string> = {
  Business: '#FF3000',
  MDA: 'var(--mda-primary)',
  Partner: '#FF3000',
  HMO: '#FF3000',
  Admin: '#FF3000',
};

/**
 * Two-column layout that collapses to a mobile drawer below md.
 *
 * - Desktop: persistent sidebar on the left, main content on the right.
 * - Mobile: top bar with a hamburger that opens a slide-in drawer
 *   plus a bottom navigation tab bar.
 */
export function AppShell({ persona, sidebar, drawerSidebar, children, activeSection, onSectionChange }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const Icon = PERSONA_ICON[persona];

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  // Close the drawer when the viewport grows past md.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setDrawerOpen(false);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Close on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className="size-full flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <header
        className="md:hidden flex items-center justify-between px-4 h-14 bg-card border-b border-border shrink-0"
        role="banner"
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          className="-ml-2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          {persona === 'MDA' ? (
            <img
              src="/nhia-logo.png"
              alt="National Health Insurance Authority"
              style={{ height: '40px', width: 'auto', maxWidth: '180px', objectFit: 'contain' }}
            />
          ) : (
            <>
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{ backgroundColor: PERSONA_COLOR[persona] }}
              >
                <Icon className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="leading-tight">
                <span className="text-muted-foreground text-[11px]">
                  {PERSONA_LABEL[persona]}
                </span>
              </div>
            </>
          )}
        </div>
        <div aria-hidden="true" className="w-9" />
      </header>

      {/* Desktop sidebar — sticky so it stays put while content scrolls */}
      <div className="hidden md:flex md:shrink-0 sticky top-0 h-screen self-start">{sidebar}</div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
          />
          <div
            id="mobile-nav-drawer"
            className="relative h-full w-72 max-w-[85vw] bg-card shadow-xl animate-in slide-in-from-left duration-200 flex flex-col"
          >
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            {drawerSidebar(() => setDrawerOpen(false))}
          </div>
        </div>
      )}

      {/* Bottom navigation — mobile only */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center justify-around px-2 pb-2"
        role="tablist"
        aria-label="Main navigation"
      >
        {BOTTOM_NAV_ITEMS[persona].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[56px] min-h-[44px] rounded-md transition-colors ${
                isActive
                  ? persona === 'MDA'
                    ? 'text-[var(--mda-primary)]'
                    : 'text-[#FF3000]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main content — on desktop pt-[70px] clears the fixed GlobalNav; pb-16 on mobile clears the bottom nav */}
      <main
        id="main-content"
        role="main"
        className="flex-1 min-w-0 overflow-hidden pb-16 md:pb-0 md:pt-[70px]"
        {...(persona === 'MDA' ? { 'data-mda-portal': '' } : {})}
      >
        {children}
      </main>
    </div>
  );
}
