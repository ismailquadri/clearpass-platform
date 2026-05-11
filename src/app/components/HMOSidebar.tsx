import {
  LayoutDashboard,
  Users,
  ClipboardList,
  DollarSign,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

interface HMOSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onItemSelect?: () => void;
  fluid?: boolean;
}

const NAV_ITEMS = [
  { id: 'hmo-overview', label: 'Overview', icon: LayoutDashboard, group: 'Main' },
  { id: 'hmo-referrals', label: 'Referral Pipeline', icon: Users, group: 'Main', badge: '7' },
  { id: 'hmo-enrollments', label: 'Enrollment Management', icon: ClipboardList, group: 'Main' },
  { id: 'hmo-commissions', label: 'Commission Tracking', icon: DollarSign, group: 'Finance' },
  { id: 'hmo-analytics', label: 'Analytics', icon: BarChart2, group: 'Finance' },
  { id: 'hmo-settings', label: 'Settings', icon: Settings, group: 'System' },
];

const GROUPS = ['Main', 'Finance', 'System'];

export function HMOSidebar({
  activeSection,
  onSectionChange,
  onItemSelect,
  fluid = false,
}: HMOSidebarProps) {
  const { user, logout } = useAuth();

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
            style={{ backgroundColor: '#1FC16B', fontSize: '10px', fontWeight: 700 }}
          >
            HMO
          </span>
        </div>
      </div>

      <nav aria-label="HMO portal navigation" className="flex-1 p-3 overflow-y-auto">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group);
          return (
            <div key={group} className="mt-4 first:mt-0">
              <div className="px-2 py-1.5 mb-1">
                <p className="uppercase tracking-wide text-muted-foreground" style={{ fontSize: '13px', fontWeight: 600 }}>
                  {group}
                </p>
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded-md transition-all min-h-[40px] ${
                        isActive
                          ? 'bg-[#dcfce7] text-[#1FC16B]'
                          : 'hover:bg-muted text-foreground/80'
                      }`}
                      style={{ fontSize: '13px', fontWeight: isActive ? 500 : 400 }}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-white px-1.5 py-0.5 rounded-full"
                          style={{ fontSize: '11px', backgroundColor: '#1FC16B', fontWeight: 600 }}
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
          <div className="w-7 h-7 rounded-full bg-[#1FC16B] flex items-center justify-center text-white" style={{ fontSize: '11px', fontWeight: 700 }}>
            {getInitials(user?.name ?? 'HO')}
          </div>
          <div className="flex-1 overflow-hidden">
            <p style={{ fontSize: '12px', fontWeight: 500 }} className="truncate">{user?.name ?? 'HMO User'}</p>
            <p className="text-muted-foreground truncate" style={{ fontSize: '11px' }}>{user?.companyName ?? 'Health Insurance'}</p>
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
