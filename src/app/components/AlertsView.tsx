import { Bell, AlertTriangle, CheckCircle2, Clock, XCircle, X, RefreshCw, Eye } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  certificateName?: string;
  daysToExpiry?: number;
  actionRequired: boolean;
  isRead: boolean;
  canDismiss: boolean;
}

export function AlertsView() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'NSITF Certificate Expiring in 6 Days',
      message:
        'Your NSITF certificate will expire on 15 May 2026. Renew immediately to avoid compliance gaps and score drop from 73 to 41.',
      timestamp: '9 May 2026, 8:00 AM',
      certificateName: 'NSITF',
      daysToExpiry: 6,
      actionRequired: true,
      isRead: false,
      canDismiss: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'PCC Certificate Renewal Reminder',
      message:
        'Your Pension Clearance Certificate expires in 28 days. Start the renewal process now to ensure continuity.',
      timestamp: '9 May 2026, 8:00 AM',
      certificateName: 'PCC',
      daysToExpiry: 28,
      actionRequired: true,
      isRead: false,
      canDismiss: true,
    },
    {
      id: '3',
      type: 'info',
      title: 'ITF Certificate Pending Verification',
      message:
        'Your ITF certificate upload is pending admin review. Expected completion within 1-2 business days.',
      timestamp: '8 May 2026, 3:15 PM',
      certificateName: 'ITF',
      actionRequired: false,
      isRead: true,
      canDismiss: true,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Compliance Score At Risk',
      message:
        'Your compliance score may drop to 41/100 if NSITF certificate is not renewed by 15 May 2026. This will remove your Procurement Ready status.',
      timestamp: '7 May 2026, 7:30 AM',
      actionRequired: true,
      isRead: true,
      canDismiss: false,
    },
    {
      id: '5',
      type: 'success',
      title: 'NHIA Certificate Verified Successfully',
      message:
        'Your NHIA certificate has been verified via government API and is active until 15 Jan 2027.',
      timestamp: '6 May 2026, 10:23 AM',
      certificateName: 'NHIA',
      actionRequired: false,
      isRead: true,
      canDismiss: true,
    },
    {
      id: '6',
      type: 'info',
      title: 'Monthly Compliance Report Available',
      message: 'Your April 2026 compliance summary report is ready for download.',
      timestamp: '1 May 2026, 12:00 PM',
      actionRequired: false,
      isRead: true,
      canDismiss: true,
    },
  ]);

  const [filterType, setFilterType] = useState<'all' | Alert['type']>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const getAlertConfig = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          icon: XCircle,
          color: 'rgb(251, 55, 72)',
          bgColor: 'rgb(251, 55, 72, 0.1)',
          borderColor: 'rgb(251, 55, 72)',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          borderColor: 'rgb(250, 115, 25)',
        };
      case 'info':
        return {
          icon: Clock,
          color: 'rgb(71, 194, 255)',
          bgColor: 'rgb(71, 194, 255, 0.1)',
          borderColor: 'rgb(71, 194, 255)',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          color: 'rgb(31, 193, 107)',
          bgColor: 'rgb(31, 193, 107, 0.1)',
          borderColor: 'rgb(31, 193, 107)',
        };
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesRead = !showUnreadOnly || !alert.isRead;
    return matchesType && matchesRead;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const criticalCount = alerts.filter((a) => a.type === 'critical').length;
  const actionRequiredCount = alerts.filter((a) => a.actionRequired).length;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, isRead: true })));
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 style={{ fontSize: '32px' }}>Alerts</h1>
              {unreadCount > 0 && (
                <span
                  className="px-3 py-1 rounded-full text-white"
                  style={{
                    backgroundColor: 'rgb(251, 115, 25)',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
              >
                Mark All as Read
              </button>
            )}
          </div>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Stay updated on certificate expirations and compliance status changes
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Total Alerts
              </span>
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>{alerts.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Unread
              </span>
              <Bell className="w-5 h-5" style={{ color: 'rgb(71, 194, 255)' }} />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(71, 194, 255)' }}>
              {unreadCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Critical
              </span>
              <AlertTriangle className="w-5 h-5" style={{ color: 'rgb(251, 55, 72)' }} />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(251, 55, 72)' }}>
              {criticalCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Action Required
              </span>
              <RefreshCw className="w-5 h-5" style={{ color: 'rgb(250, 115, 25)' }} />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(250, 115, 25)' }}>
              {actionRequiredCount}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 p-1 bg-muted rounded-md">
              {(['all', 'critical', 'warning', 'info', 'success'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filterType === type ? 'bg-card shadow-sm' : 'hover:bg-card/50'
                  }`}
                  style={{
                    fontSize: '14px',
                    fontWeight: filterType === type ? '500' : '400',
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span style={{ fontSize: '14px' }}>Unread only</span>
            </label>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const config = getAlertConfig(alert.type);
            const Icon = config.icon;

            return (
              <div key={alert.id} className="bg-card border border-[#e5e5e5] rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: config.bgColor }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 style={{ fontSize: '16px', fontWeight: '500' }}>{alert.title}</h4>
                          {!alert.isRead && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: config.color }}
                            />
                          )}
                          {alert.actionRequired && (
                            <span
                              className="px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: 'rgb(250, 115, 25, 0.1)',
                                color: 'rgb(250, 115, 25)',
                                fontSize: '13px',
                                fontWeight: '500',
                              }}
                            >
                              ACTION REQUIRED
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2" style={{ fontSize: '14px' }}>
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="caption text-muted-foreground">{alert.timestamp}</span>
                          {alert.certificateName && (
                            <>
                              <span className="caption">•</span>
                              <span className="caption" style={{ color: config.color }}>
                                {alert.certificateName}
                              </span>
                            </>
                          )}
                          {alert.daysToExpiry !== undefined && (
                            <>
                              <span className="caption">•</span>
                              <span className="caption" style={{ color: config.color }}>
                                {alert.daysToExpiry} days remaining
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {alert.canDismiss && (
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      {alert.actionRequired && (
                        <button
                          className="px-4 py-2 rounded-md text-white"
                          style={{ backgroundColor: config.color }}
                        >
                          {alert.type === 'critical' || alert.type === 'warning'
                            ? 'Renew Certificate'
                            : 'Take Action'}
                        </button>
                      )}
                      {!alert.isRead && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Mark as Read
                        </button>
                      )}
                      <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                        View Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2" style={{ fontSize: '18px', fontWeight: '500' }}>
              No Alerts Found
            </h3>
            <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
              {showUnreadOnly
                ? 'All caught up! No unread alerts.'
                : 'Try adjusting your filter settings.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
