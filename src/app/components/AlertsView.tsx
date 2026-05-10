import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';
import {
  useAlerts,
  useDismissAlert,
  useMarkAlertRead,
  useMarkAllAlertsRead,
} from '../api';
import type { Alert, AlertType } from '../api';
import { ApiState, EmptyState } from './ui';
import { TableSkeleton } from './ui/Skeleton';

type AlertFilter = 'all' | AlertType;

export function AlertsView() {
  const { showToast } = useToast();
  const alertsQuery = useAlerts();
  const markRead = useMarkAlertRead();
  const markAllRead = useMarkAllAlertsRead();
  const dismiss = useDismissAlert();

  const [filterType, setFilterType] = useState<AlertFilter>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  // Local optimistic state — updated when an action resolves.
  const [overrides, setOverrides] = useState<{
    read: Set<string>;
    dismissed: Set<string>;
    allRead: boolean;
  }>({ read: new Set(), dismissed: new Set(), allRead: false });

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ApiState query={alertsQuery} loading={<AlertsLoadingState />}>
          {(serverAlerts) => {
            const alerts = applyOverrides(serverAlerts, overrides);
            const filteredAlerts = alerts.filter((alert) => {
              const matchesType = filterType === 'all' || alert.type === filterType;
              const matchesRead = !showUnreadOnly || !alert.isRead;
              return matchesType && matchesRead;
            });
            const unreadCount = alerts.filter((a) => !a.isRead).length;
            const criticalCount = alerts.filter((a) => a.type === 'critical').length;
            const actionRequiredCount = alerts.filter((a) => a.actionRequired).length;

            const handleMarkAsRead = async (id: string) => {
              setOverrides((p) => ({
                ...p,
                read: new Set(p.read).add(id),
              }));
              try {
                await markRead.mutate(id);
                showToast('success', 'Alert Read', 'Alert has been marked as read');
              } catch {
                showToast('error', 'Could not mark as read', 'Please try again.');
              }
            };

            const handleDismiss = async (id: string) => {
              setOverrides((p) => ({
                ...p,
                dismissed: new Set(p.dismissed).add(id),
              }));
              try {
                await dismiss.mutate(id);
                showToast('success', 'Alert Dismissed', 'Alert has been dismissed');
              } catch {
                showToast('error', 'Could not dismiss', 'Please try again.');
              }
            };

            const handleMarkAllAsRead = async () => {
              setOverrides((p) => ({ ...p, allRead: true }));
              try {
                await markAllRead.mutate();
                showToast(
                  'success',
                  'All Alerts Read',
                  'All alerts have been marked as read'
                );
              } catch {
                showToast('error', 'Could not mark all read', 'Please try again.');
              }
            };

            return (
              <>
                <header className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 style={{ fontSize: '28px' }} className="sm:text-[32px]">
                        Alerts
                      </h1>
                      {unreadCount > 0 && (
                        <span
                          className="px-3 py-1 rounded-full text-white"
                          style={{
                            backgroundColor: '#FF3000',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}
                        >
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        disabled={markAllRead.isPending}
                        className="px-4 py-2 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        {markAllRead.isPending ? 'Marking...' : 'Mark All as Read'}
                      </button>
                    )}
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
                    Stay updated on certificate expirations and compliance status changes
                  </p>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <KpiCard
                    label="Total Alerts"
                    value={alerts.length}
                    icon={Bell}
                  />
                  <KpiCard
                    label="Unread"
                    value={unreadCount}
                    icon={Bell}
                    color="#FF3000"
                  />
                  <KpiCard
                    label="Critical"
                    value={criticalCount}
                    icon={AlertTriangle}
                    color="#FF3000"
                  />
                  <KpiCard
                    label="Action Required"
                    value={actionRequiredCount}
                    icon={RefreshCw}
                    color="#FF3000"
                  />
                </div>

                <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div
                      className="flex flex-wrap gap-1 p-1 bg-muted rounded-md overflow-x-auto"
                      role="group"
                      aria-label="Alert type filters"
                    >
                      {(['all', 'critical', 'warning', 'info', 'success'] as const).map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            aria-pressed={filterType === type}
                            className={`px-3 sm:px-4 py-2 min-h-[40px] rounded-md transition-colors whitespace-nowrap ${
                              filterType === type
                                ? 'bg-card shadow-sm'
                                : 'hover:bg-card/50'
                            }`}
                            style={{
                              fontSize: '14px',
                              fontWeight: filterType === type ? 500 : 400,
                            }}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                    <label
                      htmlFor="unread-only-filter"
                      className="flex items-center gap-2 cursor-pointer min-h-[40px]"
                    >
                      <input
                        id="unread-only-filter"
                        type="checkbox"
                        checked={showUnreadOnly}
                        onChange={(e) => setShowUnreadOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span style={{ fontSize: '14px' }}>Unread only</span>
                    </label>
                  </div>
                </div>

                {filteredAlerts.length === 0 ? (
                  <EmptyState
                    icon={Bell}
                    title="No Alerts Found"
                    description={
                      showUnreadOnly
                        ? 'All caught up! No unread alerts.'
                        : 'Try adjusting your filter settings.'
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredAlerts.map((alert) => (
                      <AlertRow
                        key={alert.id}
                        alert={alert}
                        onMarkRead={() => handleMarkAsRead(alert.id)}
                        onDismiss={() => handleDismiss(alert.id)}
                        onTakeAction={() =>
                          showToast(
                            'success',
                            'Action Taken',
                            alert.type === 'critical' || alert.type === 'warning'
                              ? 'Opening certificate renewal form...'
                              : 'Taking action on alert...'
                          )
                        }
                        onView={() =>
                          showToast(
                            'success',
                            'View Certificate',
                            'Opening certificate details...'
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            );
          }}
        </ApiState>
      </div>
    </div>
  );
}

function AlertsLoadingState() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-72 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-lg p-5 animate-pulse"
          >
            <div className="h-3 w-24 bg-muted rounded mb-3" />
            <div className="h-8 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}

function applyOverrides(
  alerts: Alert[],
  overrides: { read: Set<string>; dismissed: Set<string>; allRead: boolean }
): Alert[] {
  return alerts
    .filter((a) => !overrides.dismissed.has(a.id))
    .map((a) =>
      overrides.allRead || overrides.read.has(a.id) ? { ...a, isRead: true } : a
    );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Bell;
  color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
          {label}
        </span>
        <Icon
          className="w-5 h-5"
          style={{ color: color ?? 'var(--muted-foreground)' }}
          aria-hidden="true"
        />
      </div>
      <p
        style={{
          fontSize: '28px',
          fontWeight: 600,
          color: color ?? undefined,
        }}
      >
        {value}
      </p>
    </div>
  );
}

interface AlertRowProps {
  alert: Alert;
  onMarkRead: () => void;
  onDismiss: () => void;
  onTakeAction: () => void;
  onView: () => void;
}

function AlertRow({
  alert,
  onMarkRead,
  onDismiss,
  onTakeAction,
  onView,
}: AlertRowProps) {
  const config = getAlertConfig(alert.type);
  const Icon = config.icon;

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: config.color }}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 style={{ fontSize: '16px', fontWeight: 500 }}>{alert.title}</h3>
                {!alert.isRead && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                    aria-label="Unread"
                  />
                )}
                {alert.actionRequired && (
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(255, 48, 0, 0.1)',
                      color: '#FF3000',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    ACTION REQUIRED
                  </span>
                )}
              </div>
              <p
                className="text-muted-foreground mb-2"
                style={{ fontSize: '14px' }}
              >
                {alert.message}
              </p>
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span className="caption text-muted-foreground">
                  {alert.timestamp}
                </span>
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
                onClick={onDismiss}
                aria-label="Dismiss alert"
                className="w-9 h-9 rounded-md hover:bg-muted flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {alert.actionRequired && (
              <button
                onClick={onTakeAction}
                className="px-4 py-2 min-h-[40px] rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: config.color }}
              >
                {alert.type === 'critical' || alert.type === 'warning'
                  ? 'Renew Certificate'
                  : 'Take Action'}
              </button>
            )}
            {!alert.isRead && (
              <button
                onClick={onMarkRead}
                className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" aria-hidden="true" />
                Mark as Read
              </button>
            )}
            <button
              onClick={onView}
              className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
            >
              View Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAlertConfig(type: AlertType) {
  switch (type) {
    case 'critical':
      return {
        icon: XCircle,
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
      };
    case 'info':
      return {
        icon: Clock,
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
      };
    case 'success':
      return {
        icon: CheckCircle2,
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
      };
  }
}
