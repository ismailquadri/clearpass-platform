import { Bell, X, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getRecentActivities } from '../api/mocks';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [activities] = useState(() => getRecentActivities(10));
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'critical':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      
      {/* Notification Panel */}
      <div
        ref={containerRef}
        className="absolute right-4 top-4 w-full max-w-md bg-card border border-border rounded-lg shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#FF3000]" />
            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Notifications</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#FF3000] text-white text-xs font-medium">
              {activities.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="w-12 h-12 mb-3 opacity-50" />
              <p style={{ fontSize: '14px' }}>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 border-l-4 ${getSeverityColor(activity.severity)} hover:bg-muted/50 transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getSeverityIcon(activity.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '14px', fontWeight: 500 }} className="mb-1">
                        {activity.title}
                      </p>
                      <p className="text-muted-foreground text-sm mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{activity.daysAgo === 0 ? 'Today' : `${activity.daysAgo}d ago`}</span>
                        <span>•</span>
                        <span className="truncate">{activity.clientName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/30">
          <button
            className="w-full px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm"
            onClick={onClose}
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}

interface NotificationBellProps {
  onClick: () => void;
  unreadCount?: number;
}

export function NotificationBell({ onClick, unreadCount = 0 }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
      aria-label="Open notifications"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF3000] text-white text-xs font-medium flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}