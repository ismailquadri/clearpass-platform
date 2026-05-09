import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Settings,
  Bell,
  Activity,
  Download,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'certificates', label: 'My Certificates', icon: FileText },
    { id: 'verify', label: 'Verify Company', icon: CheckCircle2 },
    { id: 'reports', label: 'Reports', icon: Download },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: Bell },
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
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium" style={{ fontSize: '15px' }}>
            ClearPass
          </span>
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
              Main
            </p>
          </div>
          {menuItems.slice(0, 2).map((item) => {
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
              Tools
            </p>
          </div>
          {menuItems.slice(2, 5).map((item) => {
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
              Account
            </p>
          </div>
          {menuItems.slice(5).map((item) => {
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
                {item.id === 'alerts' && (
                  <span
                    className="ml-auto text-white px-1.5 py-0.5 rounded-full"
                    style={{ fontSize: '13px', backgroundColor: '#fb7319', fontWeight: '600' }}
                  >
                    2
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
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
    </div>
  );
}
