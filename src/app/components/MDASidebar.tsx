import { Search, FileCheck, Activity, BarChart3, Settings, Star } from 'lucide-react';
import { useState } from 'react';
import { ProfileModal } from './ProfileModal';
import { useAuth } from '../context/AuthContext';
import '../../app/styles/mda-theme.css';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

interface MDASidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onItemSelect?: () => void;
  fluid?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: typeof Search;
}

const VERIFICATION_ITEMS: MenuItem[] = [
  { id: 'verify', label: 'Verify Vendors', icon: Search },
  { id: 'prequalification', label: 'Pre-Qualification', icon: FileCheck },
  { id: 'watchlist', label: 'Company Watchlist', icon: Star },
  { id: 'reports', label: 'Verification Reports', icon: BarChart3 },
];
const COMPLIANCE_ITEMS: MenuItem[] = [
  { id: 'audit', label: 'Audit Trail', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function MDASidebar({
  activeSection,
  onSectionChange,
  onItemSelect,
  fluid = false,
}: MDASidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleClick = (id: string) => {
    onSectionChange(id);
    onItemSelect?.();
  };

  const userProfile = {
    name: user?.name ?? 'MDA Officer',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    company: user?.mdaName ?? '',
    role: 'Procurement Officer',
  };

  return (
    <aside className={`${fluid ? 'w-full' : 'w-56 lg:w-64'} h-full bg-card flex flex-col`}>
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/clearpass-logo-mda.svg" alt="ClearPass MDA" className="h-9 w-auto" />
        </div>
      </div>

      <nav aria-label="MDA portal navigation" className="flex-1 p-3 overflow-y-auto">
        <Group
          label="Verification Tools"
          items={VERIFICATION_ITEMS}
          activeSection={activeSection}
          onSelect={handleClick}
        />
        <Group
          label="Compliance"
          items={COMPLIANCE_ITEMS}
          activeSection={activeSection}
          onSelect={handleClick}
          className="mt-4"
        />
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => setIsProfileOpen(true)}
          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md transition-colors"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: 'var(--mda-primary)' }}>
            {getInitials(userProfile.name)}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p style={{ fontSize: '12px' }} className="truncate">
              {userProfile.name}
            </p>
            <p className="text-muted-foreground truncate" style={{ fontSize: '13px' }}>
              {userProfile.role}
            </p>
          </div>
        </button>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        persona="MDA"
        userProfile={userProfile}
        onLogout={logout}
      />
    </aside>
  );
}

interface GroupProps {
  label: string;
  items: MenuItem[];
  activeSection: string;
  onSelect: (id: string) => void;
  className?: string;
}

function Group({ label, items, activeSection, onSelect, className = '' }: GroupProps) {
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        (e.target as HTMLElement).parentElement?.children[nextIndex]
          ?.querySelector('button')
          ?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        (e.target as HTMLElement).parentElement?.children[prevIndex]
          ?.querySelector('button')
          ?.focus();
        break;
      }
      case 'Home':
        e.preventDefault();
        (e.target as HTMLElement).parentElement?.children[0]?.querySelector('button')?.focus();
        break;
      case 'End':
        e.preventDefault();
        (e.target as HTMLElement).parentElement?.children[items.length - 1]
          ?.querySelector('button')
          ?.focus();
        break;
    }
  };

  return (
    <div className={className}>
      <div className="px-2 py-1.5 mb-1">
        <p
          className="uppercase tracking-wide text-muted-foreground"
          style={{ fontSize: '13px', fontWeight: 600 }}
        >
          {label}
        </p>
      </div>
      <div className="space-y-0.5" role="group" aria-label={`${label} navigation`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded-md transition-all min-h-[40px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--mda-primary)] focus-visible:ring-offset-2 ${
                isActive
                  ? 'text-[var(--mda-primary)] dark:text-[var(--mda-text-primary)]'
                  : 'hover:bg-[var(--mda-bg-light)] dark:hover:bg-[var(--mda-bg-medium)] text-foreground/80'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--mda-bg-light)' : undefined,
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
