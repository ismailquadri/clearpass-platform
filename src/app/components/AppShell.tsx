import { CheckCircle2, Menu, Shield, Briefcase, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Persona } from './TweaksPanel';

interface AppShellProps {
  persona: Persona;
  /** Desktop sidebar (rendered hidden on small screens). */
  sidebar: ReactNode;
  /** Same component instance is also rendered inside the mobile drawer. */
  drawerSidebar: (closeDrawer: () => void) => ReactNode;
  /** Main content area. */
  children: ReactNode;
}

const PERSONA_ICON: Record<Persona, typeof CheckCircle2> = {
  Business: CheckCircle2,
  MDA: Shield,
  Partner: Briefcase,
};

const PERSONA_LABEL: Record<Persona, string> = {
  Business: 'Business Portal',
  MDA: 'MDA Portal',
  Partner: 'Partner Portal',
};

/**
 * Two-column layout that collapses to a mobile drawer below md.
 *
 * - Desktop: persistent sidebar on the left, main content on the right.
 * - Mobile: top bar with a hamburger that opens a slide-in drawer.
 */
export function AppShell({ persona, sidebar, drawerSidebar, children }: AppShellProps) {
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
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center"
            style={{ backgroundColor: '#FF3000' }}
          >
            <Icon className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <span className="font-medium block" style={{ fontSize: '15px' }}>
              ClearPass
            </span>
            <span className="text-muted-foreground" style={{ fontSize: '11px' }}>
              {PERSONA_LABEL[persona]}
            </span>
          </div>
        </div>
        <div aria-hidden="true" className="w-9" />
      </header>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:shrink-0">{sidebar}</div>

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

      {/* Main content */}
      <main id="main-content" role="main" className="flex-1 min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
