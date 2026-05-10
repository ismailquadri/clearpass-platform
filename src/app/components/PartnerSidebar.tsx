import { Users, FileText, TrendingUp, DollarSign, Settings, Briefcase } from 'lucide-react';

interface PartnerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onItemSelect?: () => void;
  fluid?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: typeof Users;
}

const CLIENT_ITEMS: MenuItem[] = [
  { id: 'clients', label: 'My Clients', icon: Users },
  { id: 'portfolio', label: 'Portfolio Overview', icon: Briefcase },
  { id: 'reports', label: 'Client Reports', icon: FileText },
];
const BUSINESS_ITEMS: MenuItem[] = [
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'billing', label: 'Billing', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function PartnerSidebar({
  activeSection,
  onSectionChange,
  onItemSelect,
  fluid = false,
}: PartnerSidebarProps) {
  const handleClick = (id: string) => {
    onSectionChange(id);
    onItemSelect?.();
  };

  return (
    <aside
      className={`${fluid ? 'w-full' : 'w-56 lg:w-64'} h-full bg-card flex flex-col`}
    >
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img
            src="/clearpass-logo.svg"
            alt="ClearPass"
            className="h-9 w-auto"
          />
          <div>
            <span className="font-medium block" style={{ fontSize: '15px' }}>
              ClearPass
            </span>
            <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
              Partner Portal
            </span>
          </div>
        </div>
      </div>

      <nav
        aria-label="Partner portal navigation"
        className="flex-1 p-3 overflow-y-auto"
      >
        <Group
          label="Client Management"
          items={CLIENT_ITEMS}
          activeSection={activeSection}
          onSelect={handleClick}
        />
        <Group
          label="Business"
          items={BUSINESS_ITEMS}
          activeSection={activeSection}
          onSelect={handleClick}
          className="mt-4"
        />
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
            <span style={{ fontSize: '12px' }}>CO</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p style={{ fontSize: '12px' }} className="truncate">
              Chisom Okafor
            </p>
            <p
              className="text-muted-foreground truncate"
              style={{ fontSize: '13px' }}
            >
              Compliance Consultant
            </p>
          </div>
        </div>
      </div>
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
