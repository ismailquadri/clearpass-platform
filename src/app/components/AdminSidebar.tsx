import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Building2,
  BarChart2,
  ShieldAlert,
  Clock,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onItemSelect?: () => void;
  fluid?: boolean;
}

const NAV_ITEMS = [
  { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard, group: 'Main' },
  { id: 'admin-review', label: 'Certificate Review Queue', icon: CheckSquare, group: 'Main', badge: '8' },
  { id: 'admin-accounts', label: 'Account Oversight', icon: Users, group: 'Main' },
  { id: 'admin-partners', label: 'Partner Management', icon: Building2, group: 'Platform' },
  { id: 'admin-analytics', label: 'Platform Analytics', icon: BarChart2, group: 'Platform' },
  { id: 'admin-fraud', label: 'Fraud Detection', icon: ShieldAlert, group: 'Platform', badge: '3' },
  { id: 'admin-sla', label: 'SLA Monitoring', icon: Clock, group: 'Platform' },
  { id: 'admin-settings', label: 'System Settings', icon: Settings, group: 'System' },
];

const GROUPS = ['Main', 'Platform', 'System'];

export function AdminSidebar({
  activeSection,
  onSectionChange,
  onItemSelect,
  fluid = false,
}: AdminSidebarProps) {
  const { logout } = useAuth();

  const handleClick = (id: string) => {
    onSectionChange(id);
    onItemSelect?.();
  };

  return (
    <aside className={`${fluid ? 'w-full' : 'w-56 lg:w-64'} h-full bg-card flex flex-col`}>
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/clearpass-logo.svg" alt="ClearPass" className="h-9 w-auto" />
          <span
            className="px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: '#FF3000', fontSize: '10px', fontWeight: 700 }}
          >
            ADMIN
          </span>
        </div>
      </div>

      <nav aria-label="Admin portal navigation" className="flex-1 p-3 overflow-y-auto">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group);
          return (
            <div key={group} className="mt-4 first:mt-0">
              <div className="px-2 py-1.5 mb-1">
                <p className="uppercase tracking-wide text-muted-foreground" style={{ fontSize: '13px', fontWeight: 600 }}>
                  {group}
                </p>
              </div>
              <div className="space-y-0.5" role="group" aria-label={`${group} navigation`}>
                {items.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      onKeyDown={(e) => {
                        switch (e.key) {
                          case 'ArrowDown': {
                            e.preventDefault();
                            const nextIndex = (index + 1) % items.length;
                            (e.target as HTMLElement).parentElement?.children[nextIndex]?.querySelector('button')?.focus();
                            break;
                          }
                          case 'ArrowUp': {
                            e.preventDefault();
                            const prevIndex = (index - 1 + items.length) % items.length;
                            (e.target as HTMLElement).parentElement?.children[prevIndex]?.querySelector('button')?.focus();
                            break;
                          }
                          case 'Home':
                            e.preventDefault();
                            (e.target as HTMLElement).parentElement?.children[0]?.querySelector('button')?.focus();
                            break;
                          case 'End':
                            e.preventDefault();
                            (e.target as HTMLElement).parentElement?.children[items.length - 1]?.querySelector('button')?.focus();
                            break;
                        }
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded-md transition-all min-h-[40px] outline-none focus-visible:ring-2 focus-visible:ring-[#FF3000] focus-visible:ring-offset-2 ${
                        isActive
                          ? 'bg-[#ffe6e6] text-[#FF3000]'
                          : 'hover:bg-muted text-foreground/80'
                      }`}
                      style={{ fontSize: '13px', fontWeight: isActive ? 500 : 400 }}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-white px-1.5 py-0.5 rounded-full"
                          style={{ fontSize: '11px', backgroundColor: '#FF3000', fontWeight: 600 }}
                          aria-label={`${item.badge} pending items`}
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
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-[#FF3000] flex items-center justify-center text-white" style={{ fontSize: '11px', fontWeight: 700 }}>
            CA
          </div>
          <div className="flex-1 overflow-hidden">
            <p style={{ fontSize: '12px', fontWeight: 500 }} className="truncate">ClearPass Admin</p>
            <p className="text-muted-foreground truncate" style={{ fontSize: '11px' }}>Super Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          style={{ fontSize: '13px' }}
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
