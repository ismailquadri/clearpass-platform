import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowUpCircle,
  Zap,
  Users,
  FileText,
  Globe,
  PauseCircle,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

type BillingCycle = 'monthly' | 'annual';
type PlanTier = 'starter' | 'professional' | 'enterprise';

interface Plan {
  id: PlanTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  profiles: string;
  reports: string;
  teamMembers: string;
  apiAccess: string;
  whiteLabel: string;
  support: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 5000,
    annualPrice: 50000,
    profiles: '1 profile',
    reports: '1 report/month',
    teamMembers: '1 member',
    apiAccess: 'None',
    whiteLabel: 'Not included',
    support: 'Email (24h)',
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 25000,
    annualPrice: 250000,
    profiles: '50 profiles',
    reports: 'Unlimited',
    teamMembers: '3 members',
    apiAccess: 'Read-only',
    whiteLabel: '₦10K/month add-on',
    support: 'Priority (4h)',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 100000,
    annualPrice: 0,
    profiles: 'Unlimited',
    reports: 'Unlimited',
    teamMembers: 'Unlimited',
    apiAccess: 'Full read + write',
    whiteLabel: 'Included',
    support: 'Dedicated manager + 99.9% SLA',
  },
];

const INVOICES = [
  { id: 'INV-2026-05', date: 'May 1, 2026', amount: 25000, status: 'paid', period: 'May 2026' },
  { id: 'INV-2026-04', date: 'Apr 1, 2026', amount: 25000, status: 'paid', period: 'Apr 2026' },
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: 25000, status: 'paid', period: 'Mar 2026' },
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: 25000, status: 'paid', period: 'Feb 2026' },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: 25000, status: 'paid', period: 'Jan 2026' },
];

export function BillingView() {
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currentPlan] = useState<PlanTier>('professional');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  const handleUpgrade = (plan: Plan) => {
    if (plan.id === 'enterprise') {
      showToast('info', 'Contact Sales', 'Our team will reach out to discuss Enterprise pricing.');
      return;
    }
    showToast('info', 'Redirecting to Paystack', `Upgrading to ${plan.name}…`);
  };

  const handlePause = () => {
    setShowPauseConfirm(false);
    showToast(
      'success',
      'Subscription Paused',
      'Your subscription is paused for up to 3 months. No charges during this period.'
    );
  };

  const handleCancel = () => {
    setShowCancelConfirm(false);
    showToast(
      'info',
      'Cancellation Requested',
      'Your subscription will end at the next billing date. You retain access until then.'
    );
  };

  const displayPrice = (plan: Plan) => {
    if (plan.id === 'enterprise') return 'Custom';
    return billingCycle === 'monthly'
      ? `${fmt(plan.monthlyPrice)}/mo`
      : `${fmt(plan.annualPrice)}/yr`;
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>
            Billing &amp; Subscription
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Manage your plan, payments, and invoices
          </p>
        </header>

        {/* Current Plan Card */}
        <CurrentPlanCard plan={currentPlan} fmt={fmt} />

        {/* Usage Meters */}
        <UsageSection />

        {/* Billing Cycle Toggle + Plan Cards */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Change Plan</h2>
            <BillingToggle value={billingCycle} onChange={setBillingCycle} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan;

              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={isCurrent}
                  price={displayPrice(plan)}
                  onUpgrade={() => handleUpgrade(plan)}
                />
              );
            })}
          </div>
        </div>

        {/* Invoice History */}
        <InvoiceHistory invoices={INVOICES} fmt={fmt} onDownload={(id) =>
          showToast('success', 'Downloading', `Invoice ${id} PDF is downloading…`)
        } />

        {/* Subscription Management */}
        <div className="mt-6 bg-card border border-border rounded-lg p-4 sm:p-6">
          <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
            Subscription Management
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPauseConfirm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors w-full sm:w-auto"
            >
              <PauseCircle className="w-4 h-4" aria-hidden="true" />
              Pause Subscription
            </button>
            <button
              onClick={() => showToast('info', 'Payment Method', 'Redirecting to Paystack to update your card…')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors w-full sm:w-auto"
            >
              <CreditCard className="w-4 h-4" aria-hidden="true" />
              Update Payment Method
            </button>
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors w-full sm:w-auto"
            >
              <XCircle className="w-4 h-4" aria-hidden="true" />
              Cancel Subscription
            </button>
          </div>
          <p className="text-muted-foreground mt-3" style={{ fontSize: '13px' }}>
            Pausing keeps your data safe for up to 3 months with no charges. Cancelling ends access
            at the next billing date.
          </p>
        </div>
      </div>

      {/* Pause Confirm Modal */}
      {showPauseConfirm && (
        <ConfirmModal
          title="Pause Subscription?"
          body="Your account stays intact for up to 3 months. No charges during the pause. You can reactivate anytime."
          confirmLabel="Yes, Pause"
          confirmStyle="border border-border hover:bg-muted"
          onConfirm={handlePause}
          onCancel={() => setShowPauseConfirm(false)}
        />
      )}

      {/* Cancel Confirm Modal */}
      {showCancelConfirm && (
        <ConfirmModal
          title="Cancel Subscription?"
          body="You'll retain access until the current billing period ends. After that, your data is kept for 90 days before deletion."
          confirmLabel="Yes, Cancel"
          confirmStyle="bg-red-600 text-white hover:bg-red-700"
          onConfirm={handleCancel}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
    </div>
  );
}

function CurrentPlanCard({
  plan,
  fmt,
}: {
  plan: PlanTier;
  fmt: (n: number) => string;
}) {
  const names: Record<PlanTier, string> = {
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  };
  const amounts: Record<PlanTier, number> = {
    starter: 5000,
    professional: 25000,
    enterprise: 100000,
  };

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
              Current Plan
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '12px' }}
            >
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              Active
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>{names[plan]}</h2>
          <p className="text-muted-foreground mt-1" style={{ fontSize: '14px' }}>
            Renews June 1, 2026 &bull; Monthly billing
          </p>
        </div>
        <div className="sm:text-right">
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#FF3000' }}>
            {fmt(amounts[plan])}
            <span style={{ fontSize: '16px', fontWeight: 400, color: 'inherit' }}>/mo</span>
          </p>
          <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
            Save 17% with annual billing
          </p>
        </div>
      </div>
    </div>
  );
}

function UsageSection() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
      <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
        Usage This Month
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UsageMeter label="Profiles" used={3} total={50} icon={Users} />
        <UsageMeter label="Reports" used={12} total={-1} icon={FileText} unlimitedLabel="Unlimited" />
        <UsageMeter label="Team Members" used={2} total={3} icon={Users} />
      </div>
    </div>
  );
}

function UsageMeter({
  label,
  used,
  total,
  icon: Icon,
  unlimitedLabel,
}: {
  label: string;
  used: number;
  total: number;
  icon: typeof Users;
  unlimitedLabel?: string;
}) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 100;
  const isNearLimit = total > 0 && pct >= 80;
  const barColor = isNearLimit ? '#FF3000' : '#1FC16B';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: '13px', color: isNearLimit ? '#FF3000' : undefined }}>
          {used} / {unlimitedLabel ?? total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

function BillingToggle({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (v: BillingCycle) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        style={{
          fontSize: '13px',
          fontWeight: value === 'monthly' ? 600 : 400,
        }}
      >
        Monthly
      </span>
      <button
        role="switch"
        aria-checked={value === 'annual'}
        onClick={() => onChange(value === 'monthly' ? 'annual' : 'monthly')}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          value === 'annual' ? 'bg-[#FF3000]' : 'bg-muted'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value === 'annual' ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
        <span className="sr-only">Toggle annual billing</span>
      </button>
      <span
        style={{
          fontSize: '13px',
          fontWeight: value === 'annual' ? 600 : 400,
        }}
      >
        Annual
      </span>
      {value === 'annual' && (
        <span
          className="px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: '#1FC16B', fontSize: '11px', fontWeight: 600 }}
        >
          Save 17%
        </span>
      )}
    </div>
  );
}

function PlanCard({
  plan,
  isCurrent,
  price,
  onUpgrade,
}: {
  plan: Plan;
  isCurrent: boolean;
  price: string;
  onUpgrade: () => void;
}) {
  const features = [
    { icon: Users, text: plan.profiles },
    { icon: FileText, text: plan.reports },
    { icon: Users, text: plan.teamMembers },
    { icon: Zap, text: `API: ${plan.apiAccess}` },
    { icon: Globe, text: `White-label: ${plan.whiteLabel}` },
  ];

  return (
    <div
      className={`rounded-lg p-4 border flex flex-col ${
        isCurrent
          ? 'border-[#FF3000] bg-[#FF3000]/5'
          : plan.highlight
            ? 'border-border bg-card'
            : 'border-border bg-card'
      }`}
    >
      {isCurrent && (
        <span
          className="self-start mb-2 px-2.5 py-0.5 rounded-full text-white"
          style={{ backgroundColor: '#FF3000', fontSize: '11px', fontWeight: 600 }}
        >
          Current
        </span>
      )}
      <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{plan.name}</h3>
      <p style={{ fontSize: '22px', fontWeight: 700, color: '#FF3000' }} className="mt-1 mb-3">
        {price}
      </p>

      <ul className="space-y-2 flex-1 mb-4">
        {features.map(({ icon: Icon, text }, i) => (
          <li key={i} className="flex items-start gap-2">
            <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <span style={{ fontSize: '13px' }}>{text}</span>
          </li>
        ))}
      </ul>

      <p className="text-muted-foreground mb-3" style={{ fontSize: '12px' }}>
        {plan.support}
      </p>

      {isCurrent ? (
        <button
          disabled
          className="w-full py-2.5 min-h-[40px] rounded-md border border-border text-muted-foreground cursor-not-allowed"
          style={{ fontSize: '13px' }}
        >
          Current Plan
        </button>
      ) : (
        <button
          onClick={onUpgrade}
          className="w-full py-2.5 min-h-[40px] rounded-md text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#FF3000', fontSize: '13px' }}
        >
          <ArrowUpCircle className="w-4 h-4" aria-hidden="true" />
          {plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
        </button>
      )}
    </div>
  );
}

function InvoiceHistory({
  invoices,
  fmt,
  onDownload,
}: {
  invoices: typeof INVOICES;
  fmt: (n: number) => string;
  onDownload: (id: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Invoice History</h2>
        <button
          onClick={() => {}}
          className="flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors w-full sm:w-auto"
          style={{ fontSize: '13px' }}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download All
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Invoice', 'Period', 'Date', 'Amount', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className="text-left pb-2 text-muted-foreground"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0">
                <td className="py-3" style={{ fontSize: '13px' }}>
                  {inv.id}
                </td>
                <td className="py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                  {inv.period}
                </td>
                <td className="py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                  {inv.date}
                </td>
                <td className="py-3" style={{ fontSize: '13px', fontWeight: 500 }}>
                  {fmt(inv.amount)}
                </td>
                <td className="py-3">
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px' }}
                  >
                    Paid
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => onDownload(inv.id)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontSize: '12px' }}
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden space-y-3">
        {invoices.map((inv) => (
          <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500 }}>{inv.id}</p>
              <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                {inv.period} &bull; {inv.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{fmt(inv.amount)}</span>
              <button
                onClick={() => onDownload(inv.id)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label={`Download ${inv.id}`}
              >
                <Download className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  body,
  confirmLabel,
  confirmStyle,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  confirmStyle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
      <div className="bg-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-6 border border-border">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-[#FF3000] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{title}</h3>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '14px' }}>
              {body}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors"
            style={{ fontSize: '14px' }}
          >
            Keep Subscription
          </button>
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-md transition-colors ${confirmStyle}`}
            style={{ fontSize: '14px' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
