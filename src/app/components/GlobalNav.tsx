import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GlobalNavProps {
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

export function GlobalNav({
  onNavigate,
  activeSection: _activeSection = 'overview',
}: GlobalNavProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const getInitials = () => {
    if (!user) return '?';
    const names = user.name.split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return user.name.charAt(0).toUpperCase();
  };

  const getAccountLabel = () => {
    if (!user) return '';
    const labels: Record<string, string> = {
      business: 'Business Portal',
      mda: 'NHIA Portal',
      partner: 'Partner Portal',
      hmo: 'HMO Portal',
      admin: 'Admin Portal',
    };
    return labels[user.accountType] || user.accountType;
  };

  const accentColor = user?.accountType === 'mda' ? 'var(--mda-primary)' : '#FF3000';
  const avatarGradient =
    user?.accountType === 'mda'
      ? 'var(--mda-gradient-primary)'
      : 'linear-gradient(135deg, #FF3000 0%, #ff8c00 100%)';

  return (
    /* Hidden on mobile — AppShell's own header + bottom nav handle small screens */
    <nav
      className="hidden md:flex fixed top-0 right-0 z-50 md:left-56 lg:left-64 items-center justify-between px-4 lg:px-6 h-[70px] bg-card border-b border-border"
      aria-label="Top navigation"
    >
      {/* Page context label — show NHIA emblem for MDA persona */}
      <div className="flex items-center gap-2">
        {user?.accountType === 'mda' && (
          <div className="overflow-hidden shrink-0" style={{ width: '36px', height: '36px' }}>
            <img
              src="/nhia-logo.png"
              alt="NHIA"
              style={{
                height: '36px',
                width: 'auto',
                objectFit: 'cover',
                objectPosition: 'left center',
              }}
            />
          </div>
        )}
        <p className="text-sm text-muted-foreground font-medium">{getAccountLabel()}</p>
      </div>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold shrink-0"
              style={{ background: avatarGradient }}
            >
              {getInitials()}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm font-medium leading-tight">{user?.name}</div>
              <div className="text-xs text-muted-foreground leading-tight">{getAccountLabel()}</div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 top-full mt-2 w-60 rounded-xl border border-border bg-card shadow-lg transition-all duration-150 ${
              profileOpen
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-1'
            }`}
          >
            <div className="p-4 border-b border-border">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{user?.email}</div>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  onNavigate?.('settings');
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={() => {
                  onNavigate?.('company-profile');
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
            </div>

            <div className="p-2 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
