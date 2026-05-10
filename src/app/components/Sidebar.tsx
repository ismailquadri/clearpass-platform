import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Settings,
  Bell,
  Activity,
  Download,
  CreditCard,
  FolderOpen,
  BookOpen,
  CalendarClock,
} from 'lucide-react';
import { useState } from 'react';
import { ProfileModal } from './ProfileModal';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  /** Called after the user picks an item — used by the mobile drawer to close itself. */
  onItemSelect?: () => void;
  /** When true, the sidebar fills its container (used inside the mobile drawer). */
  fluid?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

const MAIN_ITEMS: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'certificates', label: 'My Certificates', icon: FileText },
];
const TOOL_ITEMS: MenuItem[] = [
  { id: 'verify', label: 'Verify Company', icon: CheckCircle2 },
  { id: 'expiry-timeline', label: 'Expiry Timeline', icon: CalendarClock },
  { id: 'document-vault', label: 'Document Vault', icon: FolderOpen },
  { id: 'certificate-guides', label: 'Certificate Guides', icon: BookOpen },
  { id: 'reports', label: 'Reports', icon: Download },
  { id: 'activity', label: 'Activity Log', icon: Activity },
];
const ACCOUNT_ITEMS: MenuItem[] = [
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: '2' },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({
  activeSection,
  onSectionChange,
  onItemSelect,
  fluid = false,
}: SidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleClick = (id: string) => {
    onSectionChange(id);
    onItemSelect?.();
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  const userProfile = {
    name: 'Amaka Okoro',
    email: 'amaka@company.ng',
    phone: '+234 801 234 5678',
    company: 'TechVentures Nigeria Ltd',
    role: 'Compliance Officer',
  };

  return (
    <aside className={`${fluid ? 'w-full' : 'w-56 lg:w-64'} h-full bg-card flex flex-col`}>
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/clearpass-logo.svg" alt="ClearPass" className="h-9 w-auto" />
        </div>
      </div>

      <nav aria-label="Business portal navigation" className="flex-1 p-3 overflow-y-auto">
        <SidebarGroup
          label="Main"
          items={MAIN_ITEMS}
          activeSection={activeSection}
          onSelect={handleClick}
        />
        <SidebarGroup
          label="Tools"
          items={TOOL_ITEMS}
          activeSection={activeSection}
          onSelect={handleClick}
          className="mt-4"
        />
        <SidebarGroup
          label="Account"
          items={ACCOUNT_ITEMS}
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
          <div className="w-7 h-7 rounded-full bg-[#FF3000] flex items-center justify-center text-white text-xs font-bold">
            AO
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p style={{ fontSize: '12px' }} className="truncate">
              Amaka Okoro
            </p>
            <p className="text-muted-foreground truncate" style={{ fontSize: '13px' }}>
              amaka@company.ng
            </p>
          </div>
        </button>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        persona="Business"
        userProfile={userProfile}
        onLogout={handleLogout}
      />
    </aside>
  );
}

interface SidebarGroupProps {
  label: string;
  items: MenuItem[];
  activeSection: string;
  onSelect: (id: string) => void;
  className?: string;
}

function SidebarGroup({
  label,
  items,
  activeSection,
  onSelect,
  className = '',
}: SidebarGroupProps) {
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        (e.target as HTMLElement).parentElement?.children[nextIndex]?.querySelector('button')?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        (e.target as HTMLElement).parentElement?.children[prevIndex]?.querySelector('button')?.focus();
        break;
      case 'Home':
        e.preventDefault();
        (e.target as HTMLElement).parentElement?.children[0]?.querySelector('button')?.focus();
        break;
      case 'End':
        e.preventDefault();
        (e.target as HTMLElement).parentElement?.children[items.length - 1]?.querySelector('button')?.focus();
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
              className={`w-full flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded-md transition-all min-h-[40px] outline-none focus-visible:ring-2 focus-visible:ring-[#FF3000] focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-[#ffe6e6] text-[#FF3000] dark:bg-[#3a1010] dark:text-[#ff6b6b]'
                  : 'hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] text-foreground/80'
              }`}
              style={{
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className="text-white px-1.5 py-0.5 rounded-full"
                  style={{
                    fontSize: '11px',
                    backgroundColor: '#FF3000',
                    fontWeight: 600,
                  }}
                  aria-label={`${item.badge} unread`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
