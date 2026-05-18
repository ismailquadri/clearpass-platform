import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Star,
  TrendingUp,
  Activity,
  ArrowRight,
  QrCode,
  FileCheck,
  BarChart3,
  Clock,
} from 'lucide-react';
import '../../app/styles/mda-theme.css';
import { useCountUp } from '../hooks/useCountUp';

interface NHIADashboardViewProps {
  onNavigate: (section: string) => void;
}

const STATS = [
  {
    label: 'Verifications This Month',
    value: 1247,
    delta: '+18% vs last month',
    up: true,
    icon: CheckCircle2,
    color: 'var(--mda-success)',
    bg: 'var(--mda-success-light)',
  },
  {
    label: 'Vendors Eligible to Bid',
    value: 891,
    delta: '71.5% eligibility rate',
    up: true,
    icon: TrendingUp,
    color: 'var(--mda-primary)',
    bg: 'var(--mda-bg-light)',
  },
  {
    label: 'Flagged Ineligible',
    value: 143,
    delta: '11.5% of verifications',
    up: false,
    icon: XCircle,
    color: 'var(--mda-error)',
    bg: 'var(--mda-error-light)',
  },
  {
    label: 'Needs Attention',
    value: 213,
    delta: '17% — expiring certs',
    up: false,
    icon: AlertTriangle,
    color: 'var(--mda-warning)',
    bg: 'var(--mda-warning-light)',
  },
];

const RECENT = [
  {
    rc: 'RC1234567',
    company: 'TechVentures Nigeria Ltd',
    score: 92,
    status: 'procurement-ready' as const,
    time: '10 min ago',
  },
  {
    rc: 'RC7654321',
    company: 'BuildCo Construction Ltd',
    score: 74,
    status: 'attention-required' as const,
    time: '28 min ago',
  },
  {
    rc: 'RC9876543',
    company: 'Alpha Services Ltd',
    score: 28,
    status: 'ineligible' as const,
    time: '1 hr ago',
  },
  {
    rc: 'RC1122334',
    company: 'ProServe Engineering',
    score: 88,
    status: 'procurement-ready' as const,
    time: '2 hrs ago',
  },
  {
    rc: 'RC5566778',
    company: 'Delta Logistics Ltd',
    score: 65,
    status: 'attention-required' as const,
    time: '3 hrs ago',
  },
];

const QUICK_ACTIONS = [
  {
    id: 'verify',
    label: 'Verify a Vendor',
    desc: 'Enter RC number for instant check',
    icon: Search,
  },
  { id: 'scan', label: 'Scan QR Document', desc: 'Use camera to scan compliance QR', icon: QrCode },
  {
    id: 'prequalification',
    label: 'Pre-Qualification',
    desc: 'Manage tender bid lists',
    icon: FileCheck,
  },
  {
    id: 'reports',
    label: 'Verification Reports',
    desc: 'View and download past reports',
    icon: BarChart3,
  },
];

function statusCfg(s: 'procurement-ready' | 'attention-required' | 'ineligible') {
  switch (s) {
    case 'procurement-ready':
      return { color: 'var(--mda-success)', bg: 'var(--mda-success-light)', label: 'Eligible' };
    case 'attention-required':
      return { color: 'var(--mda-warning)', bg: 'var(--mda-warning-light)', label: 'Review' };
    case 'ineligible':
      return { color: 'var(--mda-error)', bg: 'var(--mda-error-light)', label: 'Ineligible' };
  }
}

interface StatCardProps {
  stat: (typeof STATS)[number];
  delay: number;
}

function StatCard({ stat, delay }: StatCardProps) {
  const Icon = stat.icon;
  const count = useCountUp(stat.value, 1100, delay);
  const formatted = count.toLocaleString();

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 500 }}>
          {stat.label}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: stat.bg }}
        >
          <Icon className="w-4 h-4" style={{ color: stat.color }} />
        </div>
      </div>
      <p
        className="tabnum cp-stat-num"
        style={{ fontSize: '28px', fontWeight: 700, color: stat.color, lineHeight: 1 }}
      >
        {formatted}
      </p>
      <p className="text-muted-foreground mt-1.5" style={{ fontSize: '11px' }}>
        {stat.delta}
      </p>
    </div>
  );
}

export function NHIADashboardView({ onNavigate }: NHIADashboardViewProps) {
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-muted-foreground mb-1" style={{ fontSize: '13px' }}>
              {today}
            </p>
            <h1 className="cp-page-title">NHIA Verification Dashboard</h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '14px' }}>
              Real-time compliance intelligence for procurement officers
            </p>
          </div>
          <button
            onClick={() => onNavigate('verify')}
            className="cp-shimmer flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium self-start sm:self-auto shrink-0"
            style={{ backgroundColor: 'var(--mda-primary)', fontSize: '14px' }}
          >
            <Search className="w-4 h-4" />
            Verify a Vendor
          </button>
        </div>

        {/* KPI stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} delay={i * 120} />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent verifications */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: 'var(--mda-primary)' }} />
                <h2 className="cp-section-title">Recent Verifications</h2>
              </div>
              <button
                onClick={() => onNavigate('verify')}
                className="text-sm flex items-center gap-1 hover:underline"
                style={{ color: 'var(--mda-primary)', fontSize: '13px' }}
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-border">
              {RECENT.map((v) => {
                const cfg = statusCfg(v.status);
                return (
                  <div
                    key={v.rc}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ fontSize: '14px' }}>
                        {v.company}
                      </p>
                      <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                        {v.rc}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <span
                        style={{
                          fontSize: '22px',
                          fontWeight: 700,
                          color: cfg.color,
                          minWidth: '40px',
                          textAlign: 'right',
                        }}
                      >
                        {v.score}
                      </span>
                      <span
                        className="text-muted-foreground hidden sm:block"
                        style={{ fontSize: '11px', minWidth: '60px', textAlign: 'right' }}
                      >
                        {v.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions + watchlist summary */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Star className="w-4 h-4" style={{ color: '#F59E0B' }} />
                <h2 className="cp-section-title">Quick Actions</h2>
              </div>
              <div className="divide-y divide-border">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => onNavigate(action.id)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--mda-bg-light)] transition-colors text-left group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'var(--mda-bg-light)' }}
                      >
                        <Icon className="w-4 h-4" style={{ color: 'var(--mda-primary)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium" style={{ fontSize: '13px' }}>
                          {action.label}
                        </p>
                        <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                          {action.desc}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System status */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="cp-section-title mb-4">API Status</h2>
              <div className="space-y-3">
                {[
                  { name: 'NHIA Enrollment API', ok: true },
                  { name: 'CAC Registry', ok: true },
                  { name: 'PenCom PCC API', ok: true },
                  { name: 'FIRS TIN API', ok: true },
                  { name: 'NSITF API', ok: false },
                ].map((api) => (
                  <div key={api.name} className="flex items-center justify-between">
                    <span style={{ fontSize: '12px' }}>{api.name}</span>
                    <span
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: api.ok ? 'var(--mda-success)' : 'var(--mda-warning)' }}
                    >
                      <span
                        className={
                          api.ok
                            ? 'cp-live-dot w-1.5 h-1.5 rounded-full'
                            : 'w-1.5 h-1.5 rounded-full'
                        }
                        style={{
                          backgroundColor: api.ok ? 'var(--mda-success)' : 'var(--mda-warning)',
                          color: api.ok ? 'var(--mda-success)' : undefined,
                        }}
                      />
                      {api.ok ? 'Live' : 'Degraded'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span style={{ fontSize: '11px' }}>Last checked: just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
