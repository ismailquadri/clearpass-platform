import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Settings,
  Bell,
  Activity,
  Download,
} from 'lucide-react';
import { MobileLogoPlaceholder } from './MobileLogoPlaceholder';

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
  { id: 'reports', label: 'Reports', icon: Download },
  { id: 'activity', label: 'Activity Log', icon: Activity },
];
const ACCOUNT_ITEMS: MenuItem[] = [
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: '2' },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({
  activeSection,
  onSectionChange,
  onItemSelect,
  fluid = false,
}: SidebarProps) {
  const handleClick = (id: string) => {
    onSectionChange(id);
    onItemSelect?.();
  };

  return (
    <aside className={`${fluid ? 'w-full' : 'w-56 lg:w-64'} h-full bg-card flex flex-col`}>
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MobileLogoPlaceholder />
          <img src="/clearpass-logo.svg" alt="ClearPass" className="h-9 w-auto hidden sm:block" />
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
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
            <span style={{ fontSize: '12px' }}>AO</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p style={{ fontSize: '12px' }} className="truncate">
              Amaka Okoro
            </p>
            <p className="text-muted-foreground truncate" style={{ fontSize: '13px' }}>
              amaka@company.ng
            </p>
          </div>
        </div>
      </div>
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
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded-md transition-all min-h-[40px] ${
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
