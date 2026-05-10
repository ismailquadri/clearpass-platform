import {
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  CreditCard,
  FileText,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

type PartnerModel = 'distributor' | 'reseller' | 'direct';

interface ClientFee {
  clientName: string;
  rcNumber: string;
  monthlyFee: number;
  partnerShare: number;
  clearpassShare: number;
  status: 'paid' | 'pending';
}

interface PayoutRecord {
  id: string;
  period: string;
  totalFees: number;
  partnerEarnings: number;
  clearpassCut: number;
  status: 'paid' | 'processing' | 'pending';
  paidDate?: string;
}

const MODEL_CONFIG: Record<
  PartnerModel,
  {
    name: string;
    partnerPct: number;
    clearpassPct: number;
    minCommitment: number;
    term: string;
    description: string;
    color: string;
  }
> = {
  distributor: {
    name: 'Distributor',
    partnerPct: 70,
    clearpassPct: 30,
    minCommitment: 100000,
    term: '12 months',
    description: 'You set client pricing (₦30–60K/month). White-label included.',
    color: '#FF3000',
  },
  reseller: {
    name: 'Reseller',
    partnerPct: 75,
    clearpassPct: 25,
    minCommitment: 500000,
    term: '24 months',
    description: 'Exclusive territory. Best split. Highest volume commitment.',
    color: '#FF3000',
  },
  direct: {
    name: 'Direct Purchase',
    partnerPct: 100,
    clearpassPct: 0,
    minCommitment: 25000,
    term: 'Monthly',
    description: 'Flat ₦25K/month. You own client billing entirely.',
    color: '#FF3000',
  },
};

const CLIENT_FEES: ClientFee[] = [
  {
    clientName: 'Lagos Builders Ltd',
    rcNumber: 'RC1234567',
    monthlyFee: 45000,
    partnerShare: 31500,
    clearpassShare: 13500,
    status: 'paid',
  },
  {
    clientName: 'Delta Contractors',
    rcNumber: 'RC7654321',
    monthlyFee: 40000,
    partnerShare: 28000,
    clearpassShare: 12000,
    status: 'paid',
  },
  {
    clientName: 'Abuja Roads Co.',
    rcNumber: 'RC9876543',
    monthlyFee: 50000,
    partnerShare: 35000,
    clearpassShare: 15000,
    status: 'pending',
  },
  {
    clientName: 'Niger Works Ltd',
    rcNumber: 'RC2345678',
    monthlyFee: 35000,
    partnerShare: 24500,
    clearpassShare: 10500,
    status: 'paid',
  },
];

const PAYOUT_HISTORY: PayoutRecord[] = [
  {
    id: 'PAY-2026-04',
    period: 'April 2026',
    totalFees: 170000,
    partnerEarnings: 119000,
    clearpassCut: 51000,
    status: 'paid',
    paidDate: 'May 2, 2026',
  },
  {
    id: 'PAY-2026-03',
    period: 'March 2026',
    totalFees: 160000,
    partnerEarnings: 112000,
    clearpassCut: 48000,
    status: 'paid',
    paidDate: 'Apr 2, 2026',
  },
  {
    id: 'PAY-2026-02',
    period: 'February 2026',
    totalFees: 145000,
    partnerEarnings: 101500,
    clearpassCut: 43500,
    status: 'paid',
    paidDate: 'Mar 2, 2026',
  },
];

export function PartnerBillingView() {
  const { showToast } = useToast();
  const [partnerModel] = useState<PartnerModel>('distributor');
  const config = MODEL_CONFIG[partnerModel];
  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  const totalFeesThisMonth = CLIENT_FEES.reduce((s, c) => s + c.monthlyFee, 0);
  const partnerEarningsThisMonth = CLIENT_FEES.reduce((s, c) => s + c.partnerShare, 0);
  const clearpassCutThisMonth = CLIENT_FEES.reduce((s, c) => s + c.clearpassShare, 0);
  const pendingAmount = CLIENT_FEES.filter((c) => c.status === 'pending').reduce(
    (s, c) => s + c.partnerShare,
    0
  );

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>
            Billing &amp; Revenue
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Track your earnings, client fees, and payout history
          </p>
        </header>

        {/* Partner Model Card */}
        <PartnerModelCard config={config} fmt={fmt} />

        {/* This Month Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <SummaryTile
            label="Total Client Fees"
            value={fmt(totalFeesThisMonth)}
            icon={DollarSign}
            sublabel="May 2026"
          />
          <SummaryTile
            label="Your Earnings"
            value={fmt(partnerEarningsThisMonth)}
            icon={TrendingUp}
            sublabel={`${config.partnerPct}% share`}
            highlight
          />
          <SummaryTile
            label="ClearPass Cut"
            value={fmt(clearpassCutThisMonth)}
            icon={ArrowUpRight}
            sublabel={`${config.clearpassPct}% share`}
          />
          <SummaryTile
            label="Pending Payout"
            value={fmt(pendingAmount)}
            icon={Clock}
            sublabel="Clears Jun 2"
          />
        </div>

        {/* Revenue Share Visualizer */}
        <RevenueShareBar partnerPct={config.partnerPct} clearpassPct={config.clearpassPct} />

        {/* Client Fee Breakdown */}
        <ClientFeeBreakdown fees={CLIENT_FEES} fmt={fmt} onDownload={() =>
          showToast('success', 'Downloading', 'Client fee breakdown PDF downloading…')
        } />

        {/* Payout History */}
        <PayoutHistory records={PAYOUT_HISTORY} fmt={fmt} onDownload={(id) =>
          showToast('success', 'Downloading', `Payout statement ${id} PDF downloading…`)
        } />

        {/* Subscription / Platform Fee */}
        <PlatformFeeCard
          model={partnerModel}
          fmt={fmt}
          onUpdate={() => showToast('info', 'Payment Method', 'Redirecting to Paystack to update your card…')}
        />
      </div>
    </div>
  );
}

function PartnerModelCard({
  config,
  fmt,
}: {
  config: (typeof MODEL_CONFIG)[PartnerModel];
  fmt: (n: number) => string;
}) {
  return (
    <div
      className="rounded-lg p-4 sm:p-6 mb-6 border"
      style={{ backgroundColor: 'rgba(255, 48, 0, 0.05)', borderColor: '#FF3000' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: '#FF3000', fontSize: '12px', fontWeight: 600 }}
            >
              {config.name} Partner
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '12px' }}
            >
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              Active
            </span>
          </div>
          <p className="text-muted-foreground mt-2" style={{ fontSize: '14px' }}>
            {config.description}
          </p>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
            Revenue split
          </p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#FF3000' }}>
            {config.partnerPct}
            <span style={{ fontSize: '14px', fontWeight: 400 }}>% yours</span>
          </p>
          <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
            Min. {fmt(config.minCommitment)}/mo &bull; {config.term}
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  icon: Icon,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  sublabel: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
          {label}
        </p>
        <Icon
          className="w-4 h-4"
          style={{ color: highlight ? '#FF3000' : 'var(--muted-foreground)' }}
          aria-hidden="true"
        />
      </div>
      <p style={{ fontSize: '20px', fontWeight: 700, color: highlight ? '#FF3000' : undefined }}>
        {value}
      </p>
      <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>
        {sublabel}
      </p>
    </div>
  );
}

function RevenueShareBar({
  partnerPct,
  clearpassPct,
}: {
  partnerPct: number;
  clearpassPct: number;
}) {
  if (clearpassPct === 0) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
      <h2 className="mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
        Revenue Split
      </h2>
      <div className="flex h-6 rounded-full overflow-hidden mb-3">
        <div
          className="flex items-center justify-center"
          style={{ width: `${partnerPct}%`, backgroundColor: '#FF3000' }}
        >
          <span className="text-white" style={{ fontSize: '11px', fontWeight: 600 }}>
            {partnerPct}% You
          </span>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ width: `${clearpassPct}%`, backgroundColor: '#d1d5db' }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>
            {clearpassPct}%
          </span>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#FF3000' }} />
          <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
            Your earnings ({partnerPct}%)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-gray-300" />
          <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
            ClearPass platform fee ({clearpassPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}

function ClientFeeBreakdown({
  fees,
  fmt,
  onDownload,
}: {
  fees: ClientFee[];
  fmt: (n: number) => string;
  onDownload: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Client Fee Breakdown — May 2026</h2>
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors w-full sm:w-auto"
          style={{ fontSize: '13px' }}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Client', 'RC Number', 'Monthly Fee', 'Your Share', 'ClearPass', 'Status'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left pb-2 text-muted-foreground"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.rcNumber} className="border-b border-border last:border-0">
                <td className="py-3" style={{ fontSize: '13px', fontWeight: 500 }}>
                  {fee.clientName}
                </td>
                <td className="py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                  {fee.rcNumber}
                </td>
                <td className="py-3" style={{ fontSize: '13px' }}>
                  {fmt(fee.monthlyFee)}
                </td>
                <td className="py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#FF3000' }}>
                  {fmt(fee.partnerShare)}
                </td>
                <td className="py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                  {fmt(fee.clearpassShare)}
                </td>
                <td className="py-3">
                  <StatusBadge status={fee.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {fees.map((fee) => (
          <div
            key={fee.rcNumber}
            className="p-3 rounded-lg border border-border bg-background"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{fee.clientName}</p>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                  {fee.rcNumber}
                </p>
              </div>
              <StatusBadge status={fee.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                  Total Fee
                </p>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>{fmt(fee.monthlyFee)}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                  Your Share
                </p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#FF3000' }}>
                  {fmt(fee.partnerShare)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                  ClearPass
                </p>
                <p style={{ fontSize: '13px' }}>{fmt(fee.clearpassShare)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayoutHistory({
  records,
  fmt,
  onDownload,
}: {
  records: PayoutRecord[];
  fmt: (n: number) => string;
  onDownload: (id: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
      <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
        Payout History
      </h2>

      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Period', 'Total Fees', 'Your Earnings', 'ClearPass', 'Status', 'Paid Date', ''].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left pb-2 text-muted-foreground"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} className="border-b border-border last:border-0">
                <td className="py-3" style={{ fontSize: '13px', fontWeight: 500 }}>
                  {rec.period}
                </td>
                <td className="py-3" style={{ fontSize: '13px' }}>
                  {fmt(rec.totalFees)}
                </td>
                <td className="py-3" style={{ fontSize: '13px', fontWeight: 600, color: '#FF3000' }}>
                  {fmt(rec.partnerEarnings)}
                </td>
                <td className="py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                  {fmt(rec.clearpassCut)}
                </td>
                <td className="py-3">
                  <PayoutStatusBadge status={rec.status} />
                </td>
                <td className="py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                  {rec.paidDate ?? '—'}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => onDownload(rec.id)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontSize: '12px' }}
                  >
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                    Statement
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {records.map((rec) => (
          <div key={rec.id} className="p-3 rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: '14px', fontWeight: 600 }}>{rec.period}</p>
              <PayoutStatusBadge status={rec.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                  Your Earnings
                </p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#FF3000' }}>
                  {fmt(rec.partnerEarnings)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                  Total Fees
                </p>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{fmt(rec.totalFees)}</p>
              </div>
            </div>
            {rec.paidDate && (
              <p className="text-muted-foreground mt-2" style={{ fontSize: '12px' }}>
                Paid {rec.paidDate}
              </p>
            )}
            <button
              onClick={() => onDownload(rec.id)}
              className="flex items-center gap-1.5 mt-2 text-muted-foreground hover:text-foreground"
              style={{ fontSize: '12px' }}
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Download Statement
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlatformFeeCard({
  model,
  fmt,
  onUpdate,
}: {
  model: PartnerModel;
  fmt: (n: number) => string;
  onUpdate: () => void;
}) {
  if (model !== 'direct') return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
        Platform Subscription
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>ClearPass Professional — Direct</p>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: '13px' }}>
            Flat fee · Renews June 1, 2026
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <span style={{ fontSize: '20px', fontWeight: 700 }}>{fmt(25000)}<span style={{ fontSize: '13px', fontWeight: 400 }}>/mo</span></span>
          <button
            onClick={onUpdate}
            className="flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors w-full sm:w-auto"
            style={{ fontSize: '13px' }}
          >
            <CreditCard className="w-4 h-4" aria-hidden="true" />
            Update Card
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'paid' | 'pending' }) {
  if (status === 'paid') {
    return (
      <span
        className="px-2 py-0.5 rounded-full inline-flex items-center gap-1"
        style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px' }}
      >
        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
        Paid
      </span>
    );
  }
  return (
    <span
      className="px-2 py-0.5 rounded-full inline-flex items-center gap-1"
      style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '11px' }}
    >
      <Clock className="w-3 h-3" aria-hidden="true" />
      Pending
    </span>
  );
}

function PayoutStatusBadge({ status }: { status: PayoutRecord['status'] }) {
  if (status === 'paid') {
    return (
      <span
        className="px-2 py-0.5 rounded-full"
        style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px' }}
      >
        Paid
      </span>
    );
  }
  if (status === 'processing') {
    return (
      <span
        className="px-2 py-0.5 rounded-full"
        style={{ backgroundColor: '#dbeafe', color: '#2563eb', fontSize: '11px' }}
      >
        Processing
      </span>
    );
  }
  return (
    <span
      className="px-2 py-0.5 rounded-full"
      style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '11px' }}
    >
      Pending
    </span>
  );
}
