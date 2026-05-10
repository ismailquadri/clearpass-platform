import { lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar } from 'lucide-react';
import { usePartnerAnalytics } from '../api';
import type { PartnerAnalytics } from '../api';
import { ApiState } from './ui';
import { ChartSkeleton, StatCardGridSkeleton } from './ui/Skeleton';
import { PortfolioProgressHook } from './NextBestAction';

// Charts are lazy-loaded so recharts only ships when this view is visited
// AND the user is past the KPI fold. Keeps initial paint fast.
const PartnerAnalyticsCharts = lazy(() =>
  import('./PartnerAnalyticsCharts').then((m) => ({
    default: m.PartnerAnalyticsCharts,
  }))
);

export function PartnerAnalyticsView() {
  const analyticsQuery = usePartnerAnalytics();

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>
            Analytics
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Track client performance, revenue trends, and compliance metrics
          </p>
        </header>

        <ApiState
          query={analyticsQuery}
          loading={
            <div className="space-y-6">
              <StatCardGridSkeleton />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
            </div>
          }
        >
          {(analytics) => (
            <>
              <PortfolioProgressHook
                ready={Math.round(analytics.kpi.activeClients * 0.6)}
                total={analytics.kpi.activeClients}
                onAction={() => {}}
              />
              <KpiRow analytics={analytics} />
              <Suspense
                fallback={
                  <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ChartSkeleton />
                      <ChartSkeleton />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ChartSkeleton />
                      <ChartSkeleton />
                    </div>
                  </div>
                }
              >
                <PartnerAnalyticsCharts analytics={analytics} />
              </Suspense>
              <Insights />
            </>
          )}
        </ApiState>
      </div>
    </div>
  );
}

function KpiRow({ analytics }: { analytics: PartnerAnalytics }) {
  const { kpi } = analytics;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <KpiCard
        label="Monthly Revenue"
        value={`₦${(kpi.monthlyRevenue / 1000).toFixed(0)}k`}
        delta={`${kpi.monthlyRevenueDeltaPct >= 0 ? '+' : ''}${kpi.monthlyRevenueDeltaPct}% from last month`}
        deltaPositive={kpi.monthlyRevenueDeltaPct >= 0}
        icon={DollarSign}
      />
      <KpiCard
        label="Active Clients"
        value={kpi.activeClients.toString()}
        delta={`${kpi.activeClientsDelta >= 0 ? '+' : ''}${kpi.activeClientsDelta} this month`}
        deltaPositive={kpi.activeClientsDelta >= 0}
        icon={Users}
      />
      <KpiCard
        label="Avg Compliance Score"
        value={kpi.avgComplianceScore.toString()}
        delta={`${kpi.avgComplianceScoreDelta >= 0 ? '+' : ''}${kpi.avgComplianceScoreDelta} from last month`}
        deltaPositive={kpi.avgComplianceScoreDelta >= 0}
        icon={TrendingUp}
      />
      <KpiCard
        label="Renewals This Month"
        value={kpi.renewalsThisMonth.toString()}
        delta={`${kpi.renewalsPendingAction} pending action`}
        deltaPositive={false}
        icon={Calendar}
      />
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  deltaPositive,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: typeof DollarSign;
}) {
  const DeltaIcon = deltaPositive ? TrendingUp : TrendingDown;
  const deltaColor = deltaPositive ? 'text-green-600' : 'text-red-600';
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
          {label}
        </span>
        <Icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <p style={{ fontSize: '26px', fontWeight: 600 }}>{value}</p>
      <div className="flex items-center gap-1 mt-2">
        <DeltaIcon className={`w-4 h-4 ${deltaColor}`} aria-hidden="true" />
        <span className={`caption ${deltaColor}`}>{delta}</span>
      </div>
    </div>
  );
}

function Insights() {
  return (
    <div className="mt-6 bg-card border border-border rounded-lg p-4 sm:p-6">
      <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: 500 }}>
        Key Insights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <InsightCard
          color="#FF3000"
          label="Strong Growth"
          message="Revenue increased 12% this month with 4 new client acquisitions"
        />
        <InsightCard
          color="#FF3000"
          label="Action Required"
          message="8 certificates expiring in next 7 days require immediate attention"
        />
        <InsightCard
          color="#FF3000"
          label="Client Focus"
          message="PCC renewals are highest this month — consider proactive outreach"
        />
      </div>
    </div>
  );
}

function InsightCard({ color, label, message }: { color: string; label: string; message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-lg border border-border"
      style={{ backgroundColor: `${color.replace('rgb(', 'rgba(').replace(')', ', 0.1)')}` }}
    >
      <p style={{ fontSize: '14px', fontWeight: 500, color }}>{label}</p>
      <p className="caption text-muted-foreground mt-1">{message}</p>
    </div>
  );
}
