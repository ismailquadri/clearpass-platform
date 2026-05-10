import { ArrowRight, AlertTriangle, Zap, Info, CheckCircle2, Trophy } from 'lucide-react';
import type { DashboardState } from './TweaksPanel';

interface NextBestActionProps {
  state: DashboardState;
  onAction: (section: string) => void;
}

type Urgency = 'critical' | 'high' | 'info' | 'success';

interface ActionConfig {
  urgency: Urgency;
  icon: typeof AlertTriangle;
  headline: string;
  body: string;
  cta: string;
  section: string;
}

const ACTION_MAP: Record<string, ActionConfig> = {
  Healthy: {
    urgency: 'success',
    icon: Trophy,
    headline: 'Full compliance maintained',
    body: 'All 6 certificates are active. Generate an official procurement report to share with MDAs when bidding.',
    cta: 'Generate Report',
    section: 'reports',
  },
  'Attention Required': {
    urgency: 'high',
    icon: Zap,
    headline: 'Renew NSITF before it expires in 6 days',
    body: 'Missing this renewal will drop your score from 73 to 41 and suspend your procurement eligibility.',
    cta: 'Renew NSITF Now',
    section: 'certificates',
  },
  Critical: {
    urgency: 'critical',
    icon: AlertTriangle,
    headline: '3 certificates need immediate action',
    body: 'Your PCC has expired. NHIA expires in 12 days. Each day without action costs compliance points.',
    cta: 'Fix Certificates',
    section: 'certificates',
  },
  'Non-Compliant': {
    urgency: 'critical',
    icon: AlertTriangle,
    headline: 'You are ineligible to bid — restore compliance now',
    body: 'Upload your NHIA certificate to re-activate procurement eligibility. This is your most urgent action.',
    cta: 'Upload NHIA',
    section: 'certificates',
  },
  'New Registration': {
    urgency: 'info',
    icon: Info,
    headline: 'Start with your NHIA certificate',
    body: 'Add your first certificate to begin building your compliance profile. It takes under 2 minutes.',
    cta: 'Add Certificate',
    section: 'certificates',
  },
};

const URGENCY_CONFIG: Record<
  Urgency,
  { bg: string; borderColor: string; iconBg: string; iconColor: string; ctaBg: string }
> = {
  critical: {
    bg: 'rgba(255, 48, 0, 0.05)',
    borderColor: '#FF3000',
    iconBg: 'rgba(255, 48, 0, 0.12)',
    iconColor: '#FF3000',
    ctaBg: '#FF3000',
  },
  high: {
    bg: 'rgba(245, 158, 11, 0.05)',
    borderColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    iconColor: '#F59E0B',
    ctaBg: '#F59E0B',
  },
  info: {
    bg: 'rgba(255, 48, 0, 0.03)',
    borderColor: 'var(--border)',
    iconBg: 'rgba(255, 48, 0, 0.08)',
    iconColor: '#FF3000',
    ctaBg: '#FF3000',
  },
  success: {
    bg: 'rgba(31, 193, 107, 0.05)',
    borderColor: '#1FC16B',
    iconBg: 'rgba(31, 193, 107, 0.12)',
    iconColor: '#1FC16B',
    ctaBg: '#FF3000',
  },
};

export function NextBestAction({ state, onAction }: NextBestActionProps) {
  const config = ACTION_MAP[state.label] ?? ACTION_MAP.Healthy;
  const style = URGENCY_CONFIG[config.urgency];
  const Icon = config.icon;

  return (
    <div
      className="rounded-lg p-4 border mb-5 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{
        backgroundColor: style.bg,
        borderColor: 'var(--border)',
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: style.iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: style.iconColor }} aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="mb-0.5" style={{ fontSize: '14px', fontWeight: 600 }}>
          {config.headline}
        </p>
        <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
          {config.body}
        </p>
      </div>

      <button
        onClick={() => onAction(config.section)}
        className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-white w-full sm:w-auto"
        style={{ backgroundColor: style.ctaBg, fontSize: '13px', fontWeight: 500 }}
      >
        {config.cta}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// For Partner: shows portfolio progress toward all clients being Procurement Ready
interface PortfolioProgressHookProps {
  ready: number;
  total: number;
  onAction: () => void;
}

export function PortfolioProgressHook({ ready, total, onAction }: PortfolioProgressHookProps) {
  const pct = total > 0 ? Math.round((ready / total) * 100) : 0;
  const remaining = total - ready;

  return (
    <div
      className="rounded-lg p-4 border mb-5"
      style={{ backgroundColor: 'rgba(255, 48, 0, 0.03)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600 }} className="mb-0.5">
            Portfolio Compliance
          </p>
          <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
            {ready}/{total} clients are Procurement Ready
            {remaining > 0 && ` — ${remaining} need attention`}
          </p>
        </div>
        <span
          className="px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: pct >= 80 ? 'rgba(31,193,107,0.12)' : 'rgba(255,48,0,0.1)',
            color: pct >= 80 ? '#1FC16B' : '#FF3000',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {pct}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct >= 80 ? '#1FC16B' : '#FF3000',
          }}
        />
      </div>

      {remaining > 0 && (
        <button
          onClick={onAction}
          className="text-sm flex items-center gap-1"
          style={{ color: '#FF3000', fontSize: '13px' }}
        >
          View clients needing action
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// For MDA: shows today's verification activity
interface MDAActivityHookProps {
  sessionCount: number;
  readyCount: number;
  flaggedCount: number;
}

export function MDAActivityHook({ sessionCount, readyCount, flaggedCount }: MDAActivityHookProps) {
  if (sessionCount === 0) return null;

  return (
    <div
      className="rounded-lg px-4 py-3 border mb-5 flex flex-wrap items-center gap-4"
      style={{ backgroundColor: 'rgba(255, 48, 0, 0.03)' }}
    >
      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#FF3000' }} aria-hidden="true" />
      <p style={{ fontSize: '13px', fontWeight: 500 }}>
        Session summary: {sessionCount} verified — {readyCount} procurement ready, {flaggedCount}{' '}
        flagged
      </p>
    </div>
  );
}
