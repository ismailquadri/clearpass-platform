import {
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  AlertTriangle,
  Search,
  Eye,
  Ban,
  RefreshCw,
  FileText,
  Activity,
  Globe,
  Zap,
  Send,
  Settings,
  Mail,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';
import { DetailedAuditTrailView } from './DetailedAuditTrailView';
import { RateLimitMonitor } from './RateLimitMonitor';
import { NotificationDeliveryMonitor } from './NotificationDeliveryMonitor';

// ─── OVERVIEW ───────────────────────────────────────────────────────────────

function AdminOverview() {
  const kpis = [
    {
      label: 'Total Companies',
      value: '4,218',
      delta: '+124 this week',
      icon: Building2,
      color: '#FF3000',
    },
    {
      label: 'Active Subscriptions',
      value: '3,891',
      delta: '92% of registered',
      icon: TrendingUp,
      color: '#1FC16B',
    },
    {
      label: 'MRR',
      value: '₦97.3M',
      delta: '+8% vs last month',
      icon: DollarSign,
      color: '#FF3000',
    },
    {
      label: 'Pending Reviews',
      value: '8',
      delta: '2 breaching SLA',
      icon: Clock,
      color: '#F59E0B',
    },
    {
      label: 'API Queries Today',
      value: '1,247',
      delta: '3 MDAs active',
      icon: Activity,
      color: '#6366F1',
    },
    {
      label: 'NHIA Enrollments',
      value: '412',
      delta: '+38 this week',
      icon: CheckCircle2,
      color: '#1FC16B',
    },
  ];

  const apiStatus = [
    { name: 'PenCom PCC API', status: 'online', latency: '142ms', uptime: '99.8%' },
    { name: 'FIRS TIN API', status: 'online', latency: '89ms', uptime: '99.9%' },
    { name: 'CAC RC Validation', status: 'degraded', latency: '1,240ms', uptime: '97.2%' },
    { name: 'NHIA Enrollment API', status: 'online', latency: '203ms', uptime: '99.5%' },
    { name: 'BPP Database Feed', status: 'offline', latency: '—', uptime: '94.1%' },
    { name: 'NSITF API', status: 'manual', latency: '—', uptime: '—' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                  {k.label}
                </span>
                <Icon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <p style={{ fontSize: '24px', fontWeight: 700, color: k.color }}>{k.value}</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>
                {k.delta}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h2 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
          Government API Integration Health
        </h2>
        <div className="space-y-2">
          {apiStatus.map((api) => (
            <div
              key={api.name}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    api.status === 'online'
                      ? '#1FC16B'
                      : api.status === 'degraded'
                        ? '#F59E0B'
                        : api.status === 'offline'
                          ? '#DC2626'
                          : '#9CA3AF',
                }}
              />
              <span className="flex-1" style={{ fontSize: '13px', fontWeight: 500 }}>
                {api.name}
              </span>
              <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                {api.latency}
              </span>
              <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                {api.uptime}
              </span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  fontSize: '11px',
                  backgroundColor:
                    api.status === 'online'
                      ? '#dcfce7'
                      : api.status === 'degraded'
                        ? '#fef3c7'
                        : api.status === 'offline'
                          ? '#fee2e2'
                          : '#f3f4f6',
                  color:
                    api.status === 'online'
                      ? '#16a34a'
                      : api.status === 'degraded'
                        ? '#d97706'
                        : api.status === 'offline'
                          ? '#dc2626'
                          : '#6b7280',
                }}
              >
                {api.status === 'manual'
                  ? 'Manual Review'
                  : api.status.charAt(0).toUpperCase() + api.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CERTIFICATE REVIEW QUEUE ────────────────────────────────────────────────

interface ReviewItem {
  id: string;
  companyName: string;
  rcNumber: string;
  certType: string;
  submittedAt: string;
  hoursInQueue: number;
  fileName: string;
}

const QUEUE_ITEMS: ReviewItem[] = [
  {
    id: 'r1',
    companyName: 'TechVentures Nigeria Ltd',
    rcNumber: 'RC1234567',
    certType: 'NSITF Certificate',
    submittedAt: 'May 10, 2026 08:14',
    hoursInQueue: 4,
    fileName: 'NSITF_2026.pdf',
  },
  {
    id: 'r2',
    companyName: 'Lagos Builders Ltd',
    rcNumber: 'RC7654321',
    certType: 'ITF Certificate',
    submittedAt: 'May 9, 2026 17:22',
    hoursInQueue: 19,
    fileName: 'ITF_Certificate.pdf',
  },
  {
    id: 'r3',
    companyName: 'Kano Civil Works',
    rcNumber: 'RC4567890',
    certType: 'NHIA Certificate',
    submittedAt: 'May 9, 2026 14:05',
    hoursInQueue: 22,
    fileName: 'NHIA_Cert_KCW.pdf',
  },
  {
    id: 'r4',
    companyName: 'Abuja Logistics Ltd',
    rcNumber: 'RC5678901',
    certType: 'BPP Certificate',
    submittedAt: 'May 10, 2026 10:33',
    hoursInQueue: 2,
    fileName: 'BPP_IRR.pdf',
  },
  {
    id: 'r5',
    companyName: 'Niger Works Ltd',
    rcNumber: 'RC3456789',
    certType: 'Tax Clearance',
    submittedAt: 'May 10, 2026 09:45',
    hoursInQueue: 3,
    fileName: 'FIRS_TaxClear.pdf',
  },
];

function CertificateReviewQueue() {
  const { showToast } = useToast();
  const [items, setItems] = useState<ReviewItem[]>(QUEUE_ITEMS);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [rejecting, setRejecting] = useState<string | null>(null);

  const approve = (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast(
      'success',
      'Approved',
      `${item?.certType} for ${item?.companyName} approved. Status updated to Active.`
    );
  };

  const reject = (id: string) => {
    const reason = rejectReason[id];
    if (!reason?.trim()) {
      showToast('error', 'Reason Required', 'You must enter a rejection reason before rejecting');
      return;
    }
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setRejecting(null);
    showToast(
      'info',
      'Rejected',
      `${item?.certType} rejected. ${item?.companyName} has been notified.`
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Certificate Review Queue</h2>
          <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
            {items.length} pending · 24h SLA
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-white"
          style={{
            backgroundColor: items.some((i) => i.hoursInQueue >= 20) ? '#DC2626' : '#F59E0B',
            fontSize: '12px',
          }}
        >
          {items.filter((i) => i.hoursInQueue >= 20).length} near SLA breach
        </span>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#1FC16B' }} />
            <p style={{ fontSize: '15px', fontWeight: 500 }}>Queue is clear</p>
            <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
              All submissions have been reviewed
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-card border rounded-lg p-4 sm:p-5"
              style={{ borderColor: item.hoursInQueue >= 20 ? '#FCA5A5' : 'var(--border)' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>{item.companyName}</p>
                    {item.hoursInQueue >= 20 && (
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '11px' }}
                      >
                        <AlertTriangle className="w-3 h-3" /> SLA Risk
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
                    {item.rcNumber} · {item.certType} · {item.hoursInQueue}h in queue
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                    Submitted: {item.submittedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('info', 'Opening', `${item.fileName} preview opened`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-md border border-border hover:bg-muted"
                    style={{ fontSize: '12px' }}
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                </div>
              </div>

              {rejecting === item.id ? (
                <div className="mt-3">
                  <label
                    className="block mb-1.5 text-muted-foreground"
                    style={{ fontSize: '12px' }}
                  >
                    Rejection reason (required):
                  </label>
                  <textarea
                    value={rejectReason[item.id] ?? ''}
                    onChange={(e) => setRejectReason((r) => ({ ...r, [item.id]: e.target.value }))}
                    placeholder="e.g. Certificate appears expired. Issue date does not match expiry date on file."
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input-background mb-2"
                    style={{ fontSize: '13px' }}
                  />
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <button
                      onClick={() => setRejecting(null)}
                      className="w-full sm:w-auto px-4 py-2 rounded-md border border-border"
                      style={{ fontSize: '13px' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => reject(item.id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                      style={{ fontSize: '13px' }}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => setRejecting(item.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md border border-border text-red-600 hover:bg-red-50"
                    style={{ fontSize: '13px' }}
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => approve(item.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md text-white"
                    style={{ backgroundColor: '#1FC16B', fontSize: '13px' }}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── ACCOUNT OVERSIGHT ───────────────────────────────────────────────────────

function AccountOversight() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [suspending, setSuspending] = useState<string | null>(null);

  const accounts = [
    {
      id: 'a1',
      name: 'TechVentures Nigeria Ltd',
      rc: 'RC1234567',
      type: 'Business',
      plan: 'Professional',
      score: 92,
      status: 'active',
      email: 'amaka@techventures.ng',
    },
    {
      id: 'a2',
      name: 'Lagos Builders Ltd',
      rc: 'RC7654321',
      type: 'Business',
      plan: 'Starter',
      score: 74,
      status: 'active',
      email: 'ops@lagosbuilders.ng',
    },
    {
      id: 'a3',
      name: 'Kano Civil Works',
      rc: 'RC4567890',
      type: 'Business',
      plan: 'Professional',
      score: 41,
      status: 'active',
      email: 'admin@kanocivil.ng',
    },
    {
      id: 'a4',
      name: 'CompliancePro Advisory',
      rc: '—',
      type: 'Partner',
      plan: 'Distributor',
      score: null,
      status: 'active',
      email: 'chisom@compliancepro.ng',
    },
    {
      id: 'a5',
      name: 'Federal Ministry of Works',
      rc: '—',
      type: 'MDA',
      plan: 'API Access',
      score: null,
      status: 'active',
      email: 'bello.adamu@procurement.gov.ng',
    },
    {
      id: 'a6',
      name: 'Abandoned Ventures Ltd',
      rc: 'RC9900112',
      type: 'Business',
      plan: 'Starter',
      score: 0,
      status: 'suspended',
      email: 'unknown@abandoned.ng',
    },
  ];

  const filtered = accounts.filter(
    (a) =>
      search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.rc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
        Account Oversight
      </h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or RC number…"
          className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-input-background"
          style={{ fontSize: '14px' }}
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Company / User', 'Type', 'Plan', 'Score', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-muted-foreground"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc) => (
                <tr key={acc.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{acc.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                      {acc.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                    {acc.type}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                    {acc.plan}
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: '13px', fontWeight: 600 }}>
                    {acc.score !== null ? acc.score : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: acc.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: acc.status === 'active' ? '#16a34a' : '#dc2626',
                        fontSize: '11px',
                      }}
                    >
                      {acc.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          showToast('info', 'View As', `Viewing ${acc.name} dashboard`)
                        }
                        className="flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-muted"
                        style={{ fontSize: '11px' }}
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      {acc.status === 'active' ? (
                        suspending === acc.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                showToast('info', 'Suspended', `${acc.name} account suspended`);
                                setSuspending(null);
                              }}
                              className="px-2 py-1 rounded text-white bg-red-600 text-xs"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setSuspending(null)}
                              className="px-2 py-1 rounded border text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSuspending(acc.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                            style={{ fontSize: '11px' }}
                          >
                            <Ban className="w-3 h-3" /> Suspend
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() =>
                            showToast('success', 'Reactivated', `${acc.name} account reactivated`)
                          }
                          className="flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-muted"
                          style={{ fontSize: '11px' }}
                        >
                          <RefreshCw className="w-3 h-3" /> Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-border">
          {filtered.map((acc) => (
            <div key={acc.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{acc.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                    {acc.type} · {acc.plan}
                  </p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: acc.status === 'active' ? '#dcfce7' : '#fee2e2',
                    color: acc.status === 'active' ? '#16a34a' : '#dc2626',
                    fontSize: '11px',
                  }}
                >
                  {acc.status}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => showToast('info', 'View As', `Viewing ${acc.name}`)}
                  className="flex-1 py-1.5 rounded border border-border text-center"
                  style={{ fontSize: '12px' }}
                >
                  View Dashboard
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FRAUD DETECTION ─────────────────────────────────────────────────────────

function FraudDetection() {
  const { showToast } = useToast();
  const flags = [
    {
      id: 'f1',
      company: 'Ghost Ventures Ltd',
      rc: 'RC9988776',
      type: 'Duplicate RC registration attempt',
      severity: 'high',
      time: '2h ago',
    },
    {
      id: 'f2',
      company: 'Mirror Corp Ltd',
      rc: 'RC1122334',
      type: 'Identical certificate image uploaded by 3 companies',
      severity: 'high',
      time: '5h ago',
    },
    {
      id: 'f3',
      company: 'Unknown Bidders Ltd',
      rc: 'RC5544332',
      type: 'Unusual verification query pattern — 142 queries in 10 minutes',
      severity: 'medium',
      time: '1d ago',
    },
  ];

  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
        Fraud Detection Flags
      </h2>
      <div className="space-y-3">
        {flags.map((flag) => (
          <div key={flag.id} className="bg-card border border-red-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <ShieldAlert
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: flag.severity === 'high' ? '#DC2626' : '#F59E0B' }}
                />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{flag.type}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
                    {flag.company} · {flag.rc} · {flag.time}
                  </p>
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded-full shrink-0"
                style={{
                  backgroundColor: flag.severity === 'high' ? '#fee2e2' : '#fef3c7',
                  color: flag.severity === 'high' ? '#dc2626' : '#d97706',
                  fontSize: '11px',
                }}
              >
                {flag.severity}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => showToast('info', 'Investigating', 'Opening investigation workflow')}
                className="px-3 py-1.5 rounded border border-border hover:bg-muted"
                style={{ fontSize: '12px' }}
              >
                Investigate
              </button>
              <button
                onClick={() => showToast('success', 'Resolved', 'Flag marked as resolved')}
                className="px-3 py-1.5 rounded border border-border hover:bg-muted"
                style={{ fontSize: '12px' }}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SLA MONITORING ──────────────────────────────────────────────────────────

function SLAMonitoring() {
  const slaData = [
    { cert: 'NSITF Certificate', count: 3, oldest: 22, avgHours: 14 },
    { cert: 'ITF Certificate', count: 2, oldest: 19, avgHours: 11 },
    { cert: 'NHIA Certificate', count: 1, oldest: 22, avgHours: 22 },
    { cert: 'BPP Certificate', count: 2, oldest: 3, avgHours: 2 },
  ];

  return (
    <div>
      <h2 className="mb-2" style={{ fontSize: '20px', fontWeight: 600 }}>
        SLA Monitoring
      </h2>
      <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
        Target: all certificate reviews completed within 24 business hours
      </p>
      <div className="space-y-3">
        {slaData.map((row) => {
          const pct = (row.oldest / 24) * 100;
          const color = pct >= 90 ? '#DC2626' : pct >= 70 ? '#F59E0B' : '#1FC16B';
          return (
            <div key={row.cert} className="bg-card border border-border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{row.cert}</span>
                <span style={{ fontSize: '13px', color }}>
                  {row.count} pending · Oldest: {row.oldest}h
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
                />
              </div>
              <p className="text-muted-foreground mt-1" style={{ fontSize: '12px' }}>
                Avg review time: {row.avgHours}h of 24h SLA
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PARTNER MANAGEMENT ──────────────────────────────────────────────────────

function PartnerManagement() {
  const { showToast } = useToast();
  const partners = [
    {
      id: 'p1',
      name: 'Axia Health Insurance',
      type: 'HMO',
      clients: 38,
      revenue: '₦2.4M',
      commission: '12%',
      status: 'active',
    },
    {
      id: 'p2',
      name: 'National HMO Plus',
      type: 'HMO',
      clients: 61,
      revenue: '₦3.9M',
      commission: '10%',
      status: 'active',
    },
    {
      id: 'p3',
      name: 'CompliancePro Advisory',
      type: 'Distributor',
      clients: 24,
      revenue: '₦1.2M',
      commission: '30%',
      status: 'active',
    },
    {
      id: 'p4',
      name: 'Ayo Compliance Ltd',
      type: 'Reseller',
      clients: 42,
      revenue: '₦2.1M',
      commission: '25%',
      status: 'active',
    },
    {
      id: 'p5',
      name: 'Federal Ministry of Works',
      type: 'MDA',
      clients: 0,
      revenue: '₦48K',
      commission: 'Per API call',
      status: 'active',
    },
  ];

  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
        Partner Management
      </h2>
      <div className="space-y-3">
        {partners.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>{p.name}</p>
                  <span className="px-2 py-0.5 rounded-full bg-muted" style={{ fontSize: '11px' }}>
                    {p.type}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1" style={{ fontSize: '13px' }}>
                  {p.clients} clients · Revenue: {p.revenue} · ClearPass share: {p.commission}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    showToast('info', 'Editing', `Editing ${p.name} partner configuration`)
                  }
                  className="px-3 py-1.5 rounded border border-border hover:bg-muted"
                  style={{ fontSize: '12px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    showToast('info', 'Report', `Generating partner statement for ${p.name}`)
                  }
                  className="px-3 py-1.5 rounded border border-border hover:bg-muted"
                  style={{ fontSize: '12px' }}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1" /> Statement
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PLATFORM ANALYTICS ──────────────────────────────────────────────────────

function PlatformAnalytics() {
  const certCoverage = [
    { cert: 'PCC', pct: 89 },
    { cert: 'NSITF', pct: 82 },
    { cert: 'FIRS TIN', pct: 91 },
    { cert: 'NHIA', pct: 64 },
    { cert: 'BPP', pct: 71 },
    { cert: 'ITF', pct: 58 },
  ];

  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
        Platform Analytics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Registered Companies', value: '4,218', sub: '+124 this week' },
          { label: 'Active Subscriptions', value: '3,891', sub: 'MRR: ₦97.3M' },
          { label: 'NHIA Enrollments', value: '412', sub: '+38 this week' },
          { label: 'API Queries (May)', value: '38,241', sub: '12 MDA consumers' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: '22px', fontWeight: 700 }}>{kpi.value}</p>
            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-4">
        <h3 className="mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
          Certificate Coverage Rate by Type
        </h3>
        <div className="space-y-3">
          {certCoverage.map((c) => (
            <div key={c.cert}>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{c.cert}</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: c.pct >= 80 ? '#1FC16B' : c.pct >= 60 ? '#F59E0B' : '#FF3000',
                  }}
                >
                  {c.pct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${c.pct}%`,
                    backgroundColor: c.pct >= 80 ? '#1FC16B' : c.pct >= 60 ? '#F59E0B' : '#FF3000',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SYSTEM SETTINGS ─────────────────────────────────────────────────────────

type SettingsTab = 'apis' | 'sla' | 'flags' | 'announcements' | 'rateLimits' | 'notifications';

interface ApiService {
  id: string;
  name: string;
  endpoint: string;
  status: 'online' | 'degraded' | 'offline' | 'manual';
  rateLimit: number;
}

function SystemSettings() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('apis');

  const [apis, setApis] = useState<ApiService[]>([
    {
      id: 'cac',
      name: 'CAC RC Validation',
      endpoint: 'https://api.cac.gov.ng/v1',
      status: 'degraded',
      rateLimit: 500,
    },
    {
      id: 'nhia',
      name: 'NHIA Enrollment API',
      endpoint: 'https://api.nhia.gov.ng/v1',
      status: 'online',
      rateLimit: 1000,
    },
    {
      id: 'firs',
      name: 'FIRS TIN API',
      endpoint: 'https://api.firs.gov.ng/v1',
      status: 'online',
      rateLimit: 2000,
    },
    {
      id: 'pencom',
      name: 'PenCom PCC API',
      endpoint: 'https://api.pencom.gov.ng/v1',
      status: 'online',
      rateLimit: 800,
    },
    {
      id: 'bpp',
      name: 'BPP Database Feed',
      endpoint: 'https://api.bpp.gov.ng/v1',
      status: 'offline',
      rateLimit: 300,
    },
    { id: 'nsitf', name: 'NSITF API', endpoint: '', status: 'manual', rateLimit: 0 },
    { id: 'itf', name: 'ITF API', endpoint: '', status: 'manual', rateLimit: 0 },
  ]);

  const [sla, setSla] = useState<Record<string, number>>({
    NSITF: 24,
    ITF: 24,
    NHIA: 24,
    BPP: 48,
    PCC: 12,
    FIRS: 12,
  });

  const [flags, setFlags] = useState<Record<string, boolean>>({
    'Bulk Upload (Business Portal)': true,
    'Partner Portal': true,
    'HMO Integration': true,
    'MDA API Access': true,
    'AI Score Explanation': false,
    'Dark Mode': true,
    'Maintenance Mode': false,
    'New Onboarding Flow': true,
  });

  const [announcement, setAnnouncement] = useState('');
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning'>('info');

  const STATUS_COLOR: Record<string, string> = {
    online: '#1FC16B',
    degraded: '#F59E0B',
    offline: '#DC2626',
    manual: '#9CA3AF',
  };

  const tabs: { id: SettingsTab; label: string; icon: typeof Settings }[] = [
    { id: 'apis', label: 'API Integrations', icon: Globe },
    { id: 'sla', label: 'SLA Thresholds', icon: Clock },
    { id: 'flags', label: 'Feature Flags', icon: Zap },
    { id: 'announcements', label: 'Announcements', icon: Send },
    { id: 'rateLimits', label: 'Rate Limits', icon: Activity },
    { id: 'notifications', label: 'Notifications', icon: Mail },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? 'bg-[#FF3000] text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* API Integrations */}
      {activeTab === 'apis' && (
        <div className="space-y-3">
          {apis.map((api) => (
            <div key={api.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:w-48 shrink-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_COLOR[api.status] }}
                  />
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{api.name}</p>
                </div>
                <input
                  type="text"
                  value={api.endpoint}
                  onChange={(e) =>
                    setApis((prev) =>
                      prev.map((a) => (a.id === api.id ? { ...a, endpoint: e.target.value } : a))
                    )
                  }
                  placeholder="https://api.example.gov.ng/v1"
                  className="flex-1 px-3 py-1.5 border border-border rounded-md bg-input-background"
                  style={{ fontSize: '13px' }}
                />
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    value={api.rateLimit}
                    onChange={(e) =>
                      setApis((prev) =>
                        prev.map((a) =>
                          a.id === api.id ? { ...a, rateLimit: Number(e.target.value) } : a
                        )
                      )
                    }
                    className="w-20 px-2 py-1.5 border border-border rounded-md bg-input-background text-center"
                    style={{ fontSize: '13px' }}
                  />
                  <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                    req/hr
                  </span>
                </div>
                <select
                  value={api.status}
                  onChange={(e) =>
                    setApis((prev) =>
                      prev.map((a) =>
                        a.id === api.id
                          ? { ...a, status: e.target.value as ApiService['status'] }
                          : a
                      )
                    )
                  }
                  className="px-2 py-1.5 border border-border rounded-md bg-input-background"
                  style={{ fontSize: '12px' }}
                >
                  <option value="online">Online</option>
                  <option value="degraded">Degraded</option>
                  <option value="offline">Offline</option>
                  <option value="manual">Manual Review</option>
                </select>
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => showToast('success', 'Saved', 'API integration settings updated')}
              className="px-5 py-2.5 rounded-lg text-white"
              style={{ backgroundColor: '#FF3000', fontSize: '14px' }}
            >
              Save API Settings
            </button>
          </div>
        </div>
      )}

      {/* SLA Thresholds */}
      {activeTab === 'sla' && (
        <div>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
            Set the maximum hours allowed for certificate review per type. Queued items exceeding
            this will be flagged as SLA breaches.
          </p>
          <div className="space-y-4 bg-card border border-border rounded-lg p-4 sm:p-6">
            {Object.entries(sla).map(([cert, hours]) => (
              <div key={cert} className="flex items-center gap-4">
                <label className="w-24 shrink-0" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {cert}
                </label>
                <input
                  type="range"
                  min={4}
                  max={72}
                  step={4}
                  value={hours}
                  onChange={(e) => setSla((s) => ({ ...s, [cert]: Number(e.target.value) }))}
                  className="flex-1"
                />
                <span
                  className="w-16 text-right shrink-0"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: hours > 24 ? '#F59E0B' : '#1FC16B',
                  }}
                >
                  {hours}h
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                showToast('success', 'Saved', 'SLA thresholds updated for all certificate types')
              }
              className="px-5 py-2.5 rounded-lg text-white"
              style={{ backgroundColor: '#FF3000', fontSize: '14px' }}
            >
              Save SLA Settings
            </button>
          </div>
        </div>
      )}

      {/* Feature Flags */}
      {activeTab === 'flags' && (
        <div>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
            Toggle platform features on or off. Changes take effect immediately for all users.
          </p>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {Object.entries(flags).map(([name, enabled]) => (
              <div key={name} className="flex items-center justify-between px-4 sm:px-6 py-4">
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{name}</p>
                  {name === 'Maintenance Mode' && (
                    <p className="text-red-500" style={{ fontSize: '12px' }}>
                      Enabling this blocks all user logins except admin
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setFlags((f) => ({ ...f, [name]: !f[name] }));
                    showToast(
                      'info',
                      'Feature toggled',
                      `${name} is now ${enabled ? 'disabled' : 'enabled'}`
                    );
                  }}
                  aria-pressed={enabled}
                  className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-[#1FC16B]' : 'bg-muted'}`}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm"
                    style={{ transform: enabled ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                  <span className="sr-only">
                    {enabled ? 'Disable' : 'Enable'} {name}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements */}
      {activeTab === 'announcements' && (
        <div>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
            Broadcast a system-wide banner to all logged-in users. It appears at the top of their
            dashboard until dismissed.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <div className="mb-4">
              <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500 }}>
                Banner type
              </label>
              <div className="flex gap-3">
                {(['info', 'warning'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAnnouncementType(type)}
                    className={`px-4 py-1.5 rounded-md border transition-colors capitalize`}
                    style={{
                      fontSize: '13px',
                      borderColor: announcementType === type ? '#FF3000' : 'var(--border)',
                      backgroundColor: announcementType === type ? '#fff5f3' : 'transparent',
                      color: announcementType === type ? '#FF3000' : 'var(--muted-foreground)',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="announcement-text"
                className="block mb-1.5"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                Message
              </label>
              <textarea
                id="announcement-text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. Scheduled maintenance on Saturday 17 May 02:00–04:00 WAT. Certificate uploads will be temporarily unavailable."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-input-background"
                style={{ fontSize: '14px' }}
              />
              <p className="text-muted-foreground mt-1" style={{ fontSize: '12px' }}>
                {announcement.length}/280 characters
              </p>
            </div>

            {announcement.trim() && (
              <div
                className="mb-4 p-3 rounded-lg border"
                style={{
                  backgroundColor: announcementType === 'warning' ? '#fef3c7' : '#eff6ff',
                  borderColor: announcementType === 'warning' ? '#fcd34d' : '#bfdbfe',
                  color: announcementType === 'warning' ? '#92400e' : '#1e40af',
                  fontSize: '13px',
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {announcementType === 'warning' ? 'Notice: ' : 'Info: '}
                </span>
                {announcement}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
              {announcement.trim() && (
                <button
                  onClick={() => {
                    setAnnouncement('');
                    showToast('info', 'Cleared', 'Active announcement removed');
                  }}
                  className="px-4 py-2 rounded-lg border border-border"
                  style={{ fontSize: '13px' }}
                >
                  Clear Active Announcement
                </button>
              )}
              <button
                onClick={() => {
                  if (!announcement.trim()) {
                    showToast('error', 'Empty', 'Enter a message before broadcasting');
                    return;
                  }
                  showToast('success', 'Broadcasted', 'Announcement is now live for all users');
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white"
                style={{ backgroundColor: '#FF3000', fontSize: '14px' }}
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Broadcast Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Limits */}
      {activeTab === 'rateLimits' && <RateLimitMonitor />}

      {/* Notifications */}
      {activeTab === 'notifications' && <NotificationDeliveryMonitor />}
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

interface AdminPortalViewProps {
  section: string;
}

export function AdminPortalView({ section }: AdminPortalViewProps) {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="cp-page-title">
              {section === 'admin-overview' && 'Admin Overview'}
              {section === 'admin-review' && 'Certificate Review Queue'}
              {section === 'admin-accounts' && 'Account Oversight'}
              {section === 'admin-partners' && 'Partner Management'}
              {section === 'admin-analytics' && 'Platform Analytics'}
              {section === 'admin-fraud' && 'Fraud Detection'}
              {section === 'admin-sla' && 'SLA Monitoring'}
              {section === 'admin-audit' && 'Audit Trail'}
              {section === 'admin-settings' && 'System Settings'}
            </h1>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            ClearPass Super Admin Portal
          </p>
        </header>

        {section === 'admin-overview' && <AdminOverview />}
        {section === 'admin-review' && <CertificateReviewQueue />}
        {section === 'admin-accounts' && <AccountOversight />}
        {section === 'admin-partners' && <PartnerManagement />}
        {section === 'admin-analytics' && <PlatformAnalytics />}
        {section === 'admin-fraud' && <FraudDetection />}
        {section === 'admin-sla' && <SLAMonitoring />}
        {section === 'admin-audit' && <DetailedAuditTrailView />}
        {section === 'admin-settings' && <SystemSettings />}
      </div>
    </div>
  );
}
