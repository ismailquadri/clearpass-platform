import { Calendar, AlertTriangle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';

interface ExpiringCert {
  id: string;
  name: string;
  companyName?: string; // for Partner view
  daysUntilExpiry: number;
  expiryDate: string;
  status: 'active' | 'expiring_critical' | 'expiring_urgent' | 'expired' | 'renewal_in_progress';
  renewalCost: number;
}

const CERTS: ExpiringCert[] = [
  { id: '1', name: 'NSITF Certificate', daysUntilExpiry: 5, expiryDate: 'May 15, 2026', status: 'expiring_urgent', renewalCost: 12000 },
  { id: '2', name: 'Pension Clearance (PCC)', daysUntilExpiry: 12, expiryDate: 'May 22, 2026', status: 'expiring_critical', renewalCost: 0 },
  { id: '3', name: 'NHIA Certificate', daysUntilExpiry: 28, expiryDate: 'Jun 7, 2026', status: 'active', renewalCost: 85000 },
  { id: '4', name: 'FIRS Tax Clearance (TIN)', daysUntilExpiry: 65, expiryDate: 'Jul 14, 2026', status: 'active', renewalCost: 0 },
  { id: '5', name: 'BPP Certificate', daysUntilExpiry: 112, expiryDate: 'Aug 30, 2026', status: 'active', renewalCost: 25000 },
  { id: '6', name: 'ITF Certificate', daysUntilExpiry: -3, expiryDate: 'May 7, 2026', status: 'expired', renewalCost: 15000 },
  { id: '7', name: 'NSITF Certificate', companyName: 'Delta Contractors', daysUntilExpiry: 8, expiryDate: 'May 18, 2026', status: 'expiring_critical', renewalCost: 12000 },
  { id: '8', name: 'Pension Clearance (PCC)', companyName: 'Lagos Builders Ltd', daysUntilExpiry: 35, expiryDate: 'Jun 14, 2026', status: 'active', renewalCost: 0 },
  { id: '9', name: 'BPP Certificate', companyName: 'Niger Works Ltd', daysUntilExpiry: 91, expiryDate: 'Aug 9, 2026', status: 'renewal_in_progress', renewalCost: 25000 },
];

function urgencyConfig(status: ExpiringCert['status']) {
  switch (status) {
    case 'expired':
      return { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', icon: AlertTriangle, label: 'Expired', band: 0 };
    case 'expiring_urgent':
      return { color: '#FF3000', bg: 'rgba(255,48,0,0.08)', icon: AlertTriangle, label: '1–7 days', band: 1 };
    case 'expiring_critical':
      return { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: Clock, label: '8–30 days', band: 2 };
    case 'renewal_in_progress':
      return { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', icon: RefreshCw, label: 'Renewal In Progress', band: 3 };
    case 'active':
      return { color: '#1FC16B', bg: 'rgba(31,193,107,0.08)', icon: CheckCircle2, label: 'Active', band: 4 };
  }
}

interface ExpiryTimelineViewProps {
  isPartner?: boolean;
}

export function ExpiryTimelineView({ isPartner = false }: ExpiryTimelineViewProps) {
  const sorted = useMemo(
    () => [...CERTS].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry),
    []
  );

  const totalRenewalCost = sorted.reduce(
    (s, c) => (c.daysUntilExpiry <= 90 && c.status !== 'expired' ? s + c.renewalCost : s),
    0
  );

  const urgent = sorted.filter((c) => c.status === 'expired' || c.daysUntilExpiry <= 7);
  const critical = sorted.filter((c) => c.daysUntilExpiry > 7 && c.daysUntilExpiry <= 30);
  const upcoming = sorted.filter((c) => c.daysUntilExpiry > 30 && c.daysUntilExpiry <= 180);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="cp-page-title mb-2">Expiry Timeline</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Chronological view of all certificate expirations in the next 180 days
          </p>
        </header>

        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <SummaryTile label="Expired" count={urgent.filter((c) => c.status === 'expired').length} color="#DC2626" />
          <SummaryTile label="Urgent (≤7 days)" count={urgent.filter((c) => c.status !== 'expired').length} color="#FF3000" />
          <SummaryTile label="Critical (8–30 days)" count={critical.length} color="#F59E0B" />
          <SummaryTile label="90-day renewal cost" count={null} value={fmt(totalRenewalCost)} color="#1FC16B" />
        </div>

        {/* Timeline bands */}
        {urgent.length > 0 && (
          <TimelineBand title="Needs Immediate Action" certs={urgent} isPartner={isPartner} />
        )}
        {critical.length > 0 && (
          <TimelineBand title="Action Needed This Month" certs={critical} isPartner={isPartner} />
        )}
        {upcoming.length > 0 && (
          <TimelineBand title="Upcoming — Next 6 Months" certs={upcoming} isPartner={isPartner} />
        )}

        {/* Visual timeline strip */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mt-6">
          <h2 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
            180-Day Overview
          </h2>
          <div className="relative h-2 rounded-full bg-muted mb-6">
            {sorted
              .filter((c) => c.daysUntilExpiry >= 0 && c.daysUntilExpiry <= 180)
              .map((c) => {
                const cfg = urgencyConfig(c.status);
                const left = (c.daysUntilExpiry / 180) * 100;
                return (
                  <div
                    key={c.id}
                    title={`${c.name}${c.companyName ? ` (${c.companyName})` : ''} — ${c.daysUntilExpiry}d`}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white cursor-pointer"
                    style={{ left: `${left}%`, backgroundColor: cfg.color }}
                  />
                );
              })}
          </div>
          <div className="flex justify-between text-muted-foreground" style={{ fontSize: '12px' }}>
            <span>Today</span>
            <span>30 days</span>
            <span>90 days</span>
            <span>180 days</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {(['expired', 'expiring_urgent', 'expiring_critical', 'renewal_in_progress', 'active'] as const).map((s) => {
              const cfg = urgencyConfig(s);
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: cfg.color }} />
                  <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({
  label, count, value, color,
}: {
  label: string;
  count: number | null;
  value?: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
      <p className="text-muted-foreground mb-1" style={{ fontSize: '12px' }}>{label}</p>
      <p style={{ fontSize: '22px', fontWeight: 700, color }}>
        {count !== null ? count : value}
      </p>
    </div>
  );
}

function TimelineBand({
  title, certs, isPartner,
}: {
  title: string;
  certs: ExpiringCert[];
  isPartner: boolean;
}) {
  return (
    <div className="mb-5">
      <h2 className="mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>{title}</h2>
      <div className="space-y-2">
        {certs.map((cert) => {
          const cfg = urgencyConfig(cert.status);
          const Icon = cfg.icon;
          return (
            <div
              key={cert.id}
              className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border"
              style={{ backgroundColor: cfg.bg, borderColor: cfg.color + '33' }}
            >
              <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: cfg.color }} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between flex-wrap gap-1">
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{cert.name}</p>
                    {isPartner && cert.companyName && (
                      <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{cert.companyName}</p>
                    )}
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: cfg.color + '20', color: cfg.color, fontSize: '11px', fontWeight: 500 }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
                    <Calendar className="w-3 h-3 inline mr-1" aria-hidden="true" />
                    {cert.expiryDate}
                    {cert.daysUntilExpiry >= 0
                      ? ` (${cert.daysUntilExpiry} days)`
                      : ` (${Math.abs(cert.daysUntilExpiry)} days ago)`}
                  </span>
                  {cert.renewalCost > 0 && (
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
                      Est. ₦{cert.renewalCost.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="shrink-0 px-3 py-1 min-h-[32px] rounded-md border border-border hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: '12px' }}
                onClick={() => {}}
              >
                {cert.status === 'renewal_in_progress' ? 'Track' : 'Renew'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
