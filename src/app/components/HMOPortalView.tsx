import {
  Users,
  DollarSign,
  BarChart2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface Referral {
  id: string;
  companyName: string;
  rcNumber: string;
  employeeCount: number;
  sector: string;
  contactEmail: string;
  contactPhone: string;
  referredDate: string;
  status: 'new' | 'contacted' | 'enrolled' | 'declined';
  estimatedPremium: number;
}

interface Enrollment {
  id: string;
  companyName: string;
  rcNumber: string;
  employeeCount: number;
  enrollmentDate: string;
  nhiaCertDate?: string;
  status: 'details-received' | 'under-review' | 'certificate-issued' | 'active';
  monthlyPremium: number;
}

interface Commission {
  id: string;
  companyName: string;
  period: string;
  employees: number;
  monthlyPremium: number;
  commissionRate: number;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
}

const REFERRALS: Referral[] = [
  { id: 'r1', companyName: 'TechVentures Nigeria Ltd', rcNumber: 'RC1234567', employeeCount: 45, sector: 'ICT', contactEmail: 'amaka@techventures.ng', contactPhone: '+234 801 234 5678', referredDate: 'May 8, 2026', status: 'new', estimatedPremium: 540000 },
  { id: 'r2', companyName: 'BuildRight Construction', rcNumber: 'RC4567890', employeeCount: 120, sector: 'Construction', contactEmail: 'hr@buildright.ng', contactPhone: '+234 802 345 6789', referredDate: 'May 6, 2026', status: 'contacted', estimatedPremium: 1440000 },
  { id: 'r3', companyName: 'Lagos Pharma Ltd', rcNumber: 'RC5678901', employeeCount: 30, sector: 'Health', contactEmail: 'ceo@lagospharma.ng', contactPhone: '+234 803 456 7890', referredDate: 'May 4, 2026', status: 'enrolled', estimatedPremium: 360000 },
  { id: 'r4', companyName: 'Delta Power Solutions', rcNumber: 'RC6789012', employeeCount: 55, sector: 'Energy', contactEmail: 'admin@deltapower.ng', contactPhone: '+234 804 567 8901', referredDate: 'May 2, 2026', status: 'contacted', estimatedPremium: 660000 },
  { id: 'r5', companyName: 'FoodChain Nigeria', rcNumber: 'RC7890123', employeeCount: 22, sector: 'Agriculture', contactEmail: 'hr@foodchain.ng', contactPhone: '+234 805 678 9012', referredDate: 'Apr 28, 2026', status: 'new', estimatedPremium: 264000 },
  { id: 'r6', companyName: 'Apex Logistics', rcNumber: 'RC8901234', employeeCount: 80, sector: 'Transport', contactEmail: 'ops@apexlogistics.ng', contactPhone: '+234 806 789 0123', referredDate: 'Apr 25, 2026', status: 'declined', estimatedPremium: 960000 },
  { id: 'r7', companyName: 'Sunrise Media Group', rcNumber: 'RC9012345', employeeCount: 18, sector: 'Media', contactEmail: 'admin@sunrisemedia.ng', contactPhone: '+234 807 890 1234', referredDate: 'Apr 22, 2026', status: 'new', estimatedPremium: 216000 },
];

const ENROLLMENTS: Enrollment[] = [
  { id: 'e1', companyName: 'Lagos Pharma Ltd', rcNumber: 'RC5678901', employeeCount: 30, enrollmentDate: 'May 5, 2026', status: 'certificate-issued', nhiaCertDate: 'May 9, 2026', monthlyPremium: 360000 },
  { id: 'e2', companyName: 'Kano Textiles Co', rcNumber: 'RC2345678', employeeCount: 65, enrollmentDate: 'Apr 28, 2026', status: 'active', nhiaCertDate: 'May 3, 2026', monthlyPremium: 780000 },
  { id: 'e3', companyName: 'BuildRight Construction', rcNumber: 'RC4567890', employeeCount: 120, enrollmentDate: 'May 7, 2026', status: 'under-review', monthlyPremium: 1440000 },
  { id: 'e4', companyName: 'Zenith Agro', rcNumber: 'RC3456789', employeeCount: 40, enrollmentDate: 'May 1, 2026', status: 'details-received', monthlyPremium: 480000 },
];

const COMMISSIONS: Commission[] = [
  { id: 'c1', companyName: 'Kano Textiles Co', period: 'May 2026', employees: 65, monthlyPremium: 780000, commissionRate: 0.08, amount: 62400, status: 'paid' },
  { id: 'c2', companyName: 'Lagos Pharma Ltd', period: 'May 2026', employees: 30, monthlyPremium: 360000, commissionRate: 0.08, amount: 28800, status: 'processing' },
  { id: 'c3', companyName: 'Kano Textiles Co', period: 'Apr 2026', employees: 65, monthlyPremium: 780000, commissionRate: 0.08, amount: 62400, status: 'paid' },
  { id: 'c4', companyName: 'Sunrise Holdings', period: 'Apr 2026', employees: 90, monthlyPremium: 1080000, commissionRate: 0.08, amount: 86400, status: 'paid' },
];

const STATUS_CFG = {
  new: { label: 'New Referral', color: '#3B82F6', bg: '#eff6ff' },
  contacted: { label: 'Contacted', color: '#F59E0B', bg: '#fef3c7' },
  enrolled: { label: 'Enrolled', color: '#1FC16B', bg: '#dcfce7' },
  declined: { label: 'Declined', color: '#DC2626', bg: '#fee2e2' },
};

const ENROLL_STATUS_CFG = {
  'details-received': { label: 'Details Received', color: '#3B82F6', step: 1 },
  'under-review': { label: 'Under Review', color: '#F59E0B', step: 2 },
  'certificate-issued': { label: 'Certificate Issued', color: '#1FC16B', step: 3 },
  'active': { label: 'Active', color: '#1FC16B', step: 4 },
};

function fmt(n: number) {
  return `₦${n.toLocaleString()}`;
}

interface HMOPortalViewProps {
  section: string;
}

export function HMOPortalView({ section }: HMOPortalViewProps) {
  switch (section) {
    case 'hmo-overview':
      return <HMOOverview />;
    case 'hmo-referrals':
      return <HMOReferrals />;
    case 'hmo-enrollments':
      return <HMOEnrollments />;
    case 'hmo-commissions':
      return <HMOCommissions />;
    case 'hmo-analytics':
      return <HMOAnalytics />;
    default:
      return <HMOOverview />;
  }
}

function HMOOverview() {
  const newReferrals = REFERRALS.filter((r) => r.status === 'new').length;
  const totalEnrolled = ENROLLMENTS.filter((e) => e.status === 'active' || e.status === 'certificate-issued').length;
  const pendingCommissions = COMMISSIONS.filter((c) => c.status === 'processing').reduce((s, c) => s + c.amount, 0);
  const totalEarned = COMMISSIONS.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="mb-1" style={{ fontSize: '28px' }}>HMO Partner Dashboard</h1>
          <p className="text-muted-foreground" style={{ fontSize: '15px' }}>Axia Health Insurance · Fatima Okafor</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'New Referrals', value: newReferrals, color: '#3B82F6', icon: Users },
            { label: 'Active Enrollments', value: totalEnrolled, color: '#1FC16B', icon: CheckCircle2 },
            { label: 'Pending Commission', value: fmt(pendingCommissions), color: '#F59E0B', icon: Clock },
            { label: 'Total Earned (May)', value: fmt(totalEarned), color: '#1FC16B', icon: DollarSign },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{label}</p>
              </div>
              <p style={{ fontSize: '22px', fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <h2 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>Recent Referrals</h2>
            <div className="space-y-3">
              {REFERRALS.slice(0, 4).map((r) => {
                const cfg = STATUS_CFG[r.status];
                return (
                  <div key={r.id} className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '14px', fontWeight: 500 }} className="truncate">{r.companyName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{r.rcNumber} · {r.employeeCount} employees</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: '11px', fontWeight: 500 }}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <h2 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>Enrollment Pipeline</h2>
            <div className="space-y-3">
              {ENROLLMENTS.map((e) => {
                const cfg = ENROLL_STATUS_CFG[e.status];
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: cfg.color, fontSize: '12px', fontWeight: 700 }}
                    >
                      {cfg.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '14px', fontWeight: 500 }} className="truncate">{e.companyName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{cfg.label} · {e.employeeCount} employees</p>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{fmt(e.monthlyPremium)}/mo</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HMOReferrals() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'enrolled' | 'declined'>('all');
  const [selected, setSelected] = useState<Referral | null>(null);

  const filtered = filter === 'all' ? REFERRALS : REFERRALS.filter((r) => r.status === filter);

  const handleContact = (r: Referral) => {
    showToast('success', 'Contact Initiated', `Reaching out to ${r.companyName} at ${r.contactEmail}`);
    setSelected(null);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>Referral Pipeline</h1>
          <p className="text-muted-foreground" style={{ fontSize: '15px' }}>Companies referred from ClearPass that need NHIA enrollment</p>
        </header>

        <div className="flex gap-2 flex-wrap mb-5">
          {(['all', 'new', 'contacted', 'enrolled', 'declined'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full border text-sm capitalize transition-colors ${
                filter === f ? 'border-[#1FC16B] text-[#1FC16B] bg-[#1FC16B]/5' : 'border-border text-muted-foreground hover:border-foreground'
              }`}
              style={{ fontSize: '13px' }}
            >
              {f === 'all' ? `All (${REFERRALS.length})` : f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((r) => {
            const cfg = STATUS_CFG[r.status];
            return (
              <div key={r.id} className="bg-card border border-border rounded-lg p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{r.companyName}</h3>
                      <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: '11px', fontWeight: 500 }}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                      <span style={{ fontSize: '13px' }}>{r.rcNumber}</span>
                      <span style={{ fontSize: '13px' }}>{r.employeeCount} employees</span>
                      <span style={{ fontSize: '13px' }}>{r.sector}</span>
                      <span style={{ fontSize: '13px' }}>Est. {fmt(r.estimatedPremium)}/yr</span>
                    </div>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: '12px' }}>Referred {r.referredDate}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setSelected(selected?.id === r.id ? null : r)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border hover:bg-muted text-sm transition-colors"
                      style={{ fontSize: '13px' }}
                    >
                      Details
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selected?.id === r.id ? 'rotate-90' : ''}`} />
                    </button>
                    {r.status !== 'enrolled' && r.status !== 'declined' && (
                      <button
                        onClick={() => handleContact(r)}
                        className="px-3 py-1.5 rounded-md text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#1FC16B', fontSize: '13px' }}
                      >
                        Contact
                      </button>
                    )}
                  </div>
                </div>

                {selected?.id === r.id && (
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span style={{ fontSize: '13px' }}>{r.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span style={{ fontSize: '13px' }}>{r.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span style={{ fontSize: '13px' }}>{r.sector}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span style={{ fontSize: '13px' }}>{r.employeeCount} employees</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HMOEnrollments() {
  const { showToast } = useToast();

  const steps = ['Details Received', 'Under Review', 'Certificate Issued', 'Active'];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>Enrollment Management</h1>
          <p className="text-muted-foreground" style={{ fontSize: '15px' }}>Track enrollment progress for each company</p>
        </header>

        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          {steps.map((step, i) => (
            <div key={step} className="bg-card border border-border rounded-lg p-3">
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#1FC16B' }}>
                {ENROLLMENTS.filter((e) => ENROLL_STATUS_CFG[e.status].step >= i + 1).length}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{step}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {ENROLLMENTS.map((e) => {
            const cfg = ENROLL_STATUS_CFG[e.status];
            return (
              <div key={e.id} className="bg-card border border-border rounded-lg p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{e.companyName}</h3>
                    <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
                      {e.rcNumber} · {e.employeeCount} employees · {fmt(e.monthlyPremium)}/mo
                    </p>
                    {e.nhiaCertDate && (
                      <p className="text-muted-foreground" style={{ fontSize: '12px' }}>NHIA cert issued: {e.nhiaCertDate}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 rounded-full shrink-0" style={{ backgroundColor: `${cfg.color}20`, color: cfg.color, fontSize: '12px', fontWeight: 500 }}>
                    {cfg.label}
                  </span>
                </div>

                {/* Progress steps */}
                <div className="flex items-center gap-1">
                  {steps.map((step, i) => {
                    const done = cfg.step > i;
                    const active = cfg.step === i + 1;
                    return (
                      <div key={step} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full h-1.5 rounded-full"
                          style={{ backgroundColor: done || active ? '#1FC16B' : 'var(--border)' }}
                        />
                        <p style={{ fontSize: '10px', color: done || active ? '#1FC16B' : 'var(--muted-foreground)' }} className="text-center hidden sm:block">
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {e.status !== 'active' && e.status !== 'certificate-issued' && (
                  <button
                    onClick={() => showToast('success', 'Status Updated', `${e.companyName} moved to next enrollment stage`)}
                    className="mt-3 text-sm text-[#1FC16B] hover:underline"
                    style={{ fontSize: '13px' }}
                  >
                    Mark as {steps[cfg.step]} →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HMOCommissions() {
  const { showToast } = useToast();
  const totalPaid = COMMISSIONS.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const totalPending = COMMISSIONS.filter((c) => c.status !== 'paid').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>Commission Tracking</h1>
          <p className="text-muted-foreground" style={{ fontSize: '15px' }}>8% commission on monthly premiums for referred enrollments</p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground mb-1" style={{ fontSize: '13px' }}>Total Paid Out</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1FC16B' }}>{fmt(totalPaid)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground mb-1" style={{ fontSize: '13px' }}>Pending</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B' }}>{fmt(totalPending)}</p>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Company', 'Period', 'Employees', 'Premium', 'Rate', 'Commission', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: '12px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMMISSIONS.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3" style={{ fontSize: '14px' }}>{c.companyName}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '13px' }}>{c.period}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '13px' }}>{c.employees}</td>
                  <td className="px-4 py-3" style={{ fontSize: '13px' }}>{fmt(c.monthlyPremium)}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '13px' }}>{(c.commissionRate * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3 font-medium" style={{ fontSize: '14px', color: '#1FC16B' }}>{fmt(c.amount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full capitalize"
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: c.status === 'paid' ? '#dcfce7' : c.status === 'processing' ? '#fef3c7' : '#fee2e2',
                        color: c.status === 'paid' ? '#1FC16B' : c.status === 'processing' ? '#F59E0B' : '#DC2626',
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-3">
          {COMMISSIONS.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{c.companyName}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{c.period}</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full capitalize shrink-0"
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    backgroundColor: c.status === 'paid' ? '#dcfce7' : '#fef3c7',
                    color: c.status === 'paid' ? '#1FC16B' : '#F59E0B',
                  }}
                >
                  {c.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground" style={{ fontSize: '13px' }}>{c.employees} employees · {fmt(c.monthlyPremium)}/mo</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1FC16B' }}>{fmt(c.amount)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => showToast('info', 'Statement', 'Downloading commission statement…')}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
            style={{ fontSize: '13px' }}
          >
            Download Statement
          </button>
        </div>
      </div>
    </div>
  );
}

function HMOAnalytics() {
  const conversionRate = Math.round((REFERRALS.filter((r) => r.status === 'enrolled').length / REFERRALS.length) * 100);
  const avgPremium = Math.round(ENROLLMENTS.reduce((s, e) => s + e.monthlyPremium, 0) / ENROLLMENTS.length);
  const totalEmployees = ENROLLMENTS.reduce((s, e) => s + e.employeeCount, 0);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>Analytics</h1>
          <p className="text-muted-foreground" style={{ fontSize: '15px' }}>Performance metrics and pipeline health</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: '#1FC16B' },
            { label: 'Avg Monthly Premium', value: fmt(avgPremium), icon: DollarSign, color: '#3B82F6' },
            { label: 'Total Employees Covered', value: totalEmployees.toLocaleString(), icon: Users, color: '#F59E0B' },
            { label: 'Active Enrollments', value: ENROLLMENTS.filter((e) => e.status === 'active').length, icon: CheckCircle2, color: '#1FC16B' },
            { label: 'Pending Contact', value: REFERRALS.filter((r) => r.status === 'new').length, icon: AlertTriangle, color: '#F59E0B' },
            { label: 'This Month Revenue', value: fmt(COMMISSIONS.filter((c) => c.period === 'May 2026').reduce((s, c) => s + c.amount, 0)), icon: BarChart2, color: '#1FC16B' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{label}</p>
              </div>
              <p style={{ fontSize: '22px', fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
          <h2 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>Referral Status Breakdown</h2>
          <div className="space-y-3">
            {(['new', 'contacted', 'enrolled', 'declined'] as const).map((status) => {
              const count = REFERRALS.filter((r) => r.status === status).length;
              const pct = Math.round((count / REFERRALS.length) * 100);
              const cfg = STATUS_CFG[status];
              return (
                <div key={status}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{cfg.label}</span>
                    <span style={{ fontSize: '13px', color: cfg.color }}>{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
