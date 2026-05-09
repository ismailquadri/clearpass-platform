import { Users, FileText, TrendingUp, DollarSign, Settings, Briefcase } from 'lucide-react';

interface PartnerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function PartnerSidebar({ activeSection, onSectionChange }: PartnerSidebarProps) {
  const menuItems = [
    { id: 'clients', label: 'My Clients', icon: Users },
    { id: 'portfolio', label: 'Portfolio Overview', icon: Briefcase },
    { id: 'reports', label: 'Client Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-56 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo/Header */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: 'rgb(251, 115, 25)' }}
          >
            <Briefcase className="w-4 h-4 text-white" />
          </div>
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

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-0.5">
          <div className="px-2 py-1.5 mb-1">
            <p
              className="uppercase tracking-wide"
              style={{ fontSize: '13px', color: '#a0a0a0', fontWeight: '600' }}
            >
              Client Management
            </p>
          </div>
          {menuItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all ${
                  isActive ? '' : 'hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a]'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: '#ffeee6',
                        fontSize: '13px',
                        fontWeight: '500',
                      }
                    : {
                        fontSize: '13px',
                        fontWeight: '400',
                      }
                }
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? '#fb7319' : '#404040' }} />
                <span style={{ color: isActive ? '#fb7319' : '#404040' }}>{item.label}</span>
              </button>
            );
          })}

          <div className="px-2 py-1.5 mt-4 mb-1">
            <p
              className="uppercase tracking-wide"
              style={{ fontSize: '13px', color: '#a0a0a0', fontWeight: '600' }}
            >
              Business
            </p>
          </div>
          {menuItems.slice(3).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all ${
                  isActive ? '' : 'hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a]'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: '#ffeee6',
                        fontSize: '13px',
                        fontWeight: '500',
                      }
                    : {
                        fontSize: '13px',
                        fontWeight: '400',
                      }
                }
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? '#fb7319' : '#404040' }} />
                <span style={{ color: isActive ? '#fb7319' : '#404040' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
            <span style={{ fontSize: '12px' }}>CO</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p style={{ fontSize: '12px' }} className="truncate">
              Chisom Okafor
            </p>
            <p className="text-muted-foreground truncate" style={{ fontSize: '13px' }}>
              Compliance Consultant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
