import {
  CheckCircle2,
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  Mail,
  FileText,
  Clock,
  Activity,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useToast } from './ToastProvider';
import { useActivity } from '../api';
import type { ActivityItem, ActivityType } from '../api';
import { ApiState, EmptyState } from './ui';
import { TableSkeleton } from './ui/Skeleton';

type TypeFilter = 'all' | ActivityType;
type PeriodFilter = '7d' | '30d' | '90d' | 'all';

export function ActivityLogView() {
  const { showToast } = useToast();
  const activityQuery = useActivity();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>
            Activity Log
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Track all compliance activities and system events
          </p>
        </header>

        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <label htmlFor="activity-type-filter" className="sr-only">
                Filter by activity type
              </label>
              <select
                id="activity-type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              >
                <option value="all">All Activities</option>
                <option value="verification">Verifications</option>
                <option value="upload">Uploads</option>
                <option value="download">Downloads</option>
                <option value="renewal">Renewals</option>
                <option value="alert">Alerts</option>
                <option value="email">Emails</option>
                <option value="report">Reports</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="time-period-filter" className="sr-only">
                Filter by time period
              </label>
              <select
                id="time-period-filter"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value as PeriodFilter)}
                className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <button
              onClick={() =>
                showToast(
                  'success',
                  'Export Log',
                  'Downloading activity log as CSV...'
                )
              }
              className="px-4 py-2 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Export Log</span>
            </button>
          </div>
        </div>

        <ApiState query={activityQuery} loading={<TableSkeleton rows={8} />}>
          {(activities) => (
            <ActivityTimeline
              activities={activities.filter(
                (a) => typeFilter === 'all' || a.type === typeFilter
              )}
              onLoadMore={() =>
                showToast('success', 'Load More', 'Loading more activities...')
              }
            />
          )}
        </ApiState>
      </div>
    </div>
  );
}

function ActivityTimeline({
  activities,
  onLoadMore,
}: {
  activities: ActivityItem[];
  onLoadMore: () => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, ActivityItem[]>();
    for (const a of activities) {
      const date = a.timestamp.split(',')[0];
      const list = map.get(date) ?? [];
      list.push(a);
      map.set(date, list);
    }
    return Array.from(map.entries());
  }, [activities]);

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No Activity Yet"
        description="Once you upload certificates or take compliance actions, they'll show up here."
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {grouped.map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-4">
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>{date}</h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-3">
              {items.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const statusConfig = getStatusConfig(activity.status);
                return (
                  <div
                    key={activity.id}
                    className="bg-card border border-border rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: statusConfig.bgColor }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: statusConfig.color }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                          <h4 style={{ fontSize: '16px', fontWeight: 500 }}>
                            {activity.title}
                          </h4>
                          <span className="caption text-muted-foreground whitespace-nowrap sm:ml-4">
                            {activity.timestamp.split(',')[1]?.trim()}
                          </span>
                        </div>
                        <p
                          className="text-muted-foreground"
                          style={{ fontSize: '14px' }}
                        >
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onLoadMore}
          className="px-6 py-3 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors"
        >
          Load More Activities
        </button>
      </div>
    </>
  );
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case 'verification':
      return CheckCircle2;
    case 'upload':
      return Upload;
    case 'download':
      return Download;
    case 'renewal':
      return RefreshCw;
    case 'alert':
      return AlertTriangle;
    case 'email':
      return Mail;
    case 'report':
      return FileText;
    default:
      return Clock;
  }
}

function getStatusConfig(status?: ActivityItem['status']) {
  switch (status) {
    case 'success':
      return {
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
      };
    case 'warning':
      return {
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
      };
    case 'info':
    default:
      return {
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
      };
  }
}
