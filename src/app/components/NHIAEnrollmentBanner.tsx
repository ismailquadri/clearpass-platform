import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface HMO {
  id: string;
  name: string;
  logo: string;
  states: string[];
  employeeRange: string;
  monthlyPremium: string;
  processingTime: string;
  rating: number;
}

const HMOS: HMO[] = [
  { id: 'axia', name: 'Axia Health Insurance', logo: 'AH', states: ['Lagos', 'Abuja', 'Rivers'], employeeRange: '10–500', monthlyPremium: '₦8,000–₦15,000/employee', processingTime: '5–7 business days', rating: 4.8 },
  { id: 'nhia-hmo', name: 'National HMO Plus', logo: 'NH', states: ['Nationwide'], employeeRange: '1–1000', monthlyPremium: '₦6,500–₦12,000/employee', processingTime: '7–14 business days', rating: 4.5 },
  { id: 'primus', name: 'Primus Healthcare', logo: 'PH', states: ['Lagos', 'Ogun', 'Oyo'], employeeRange: '20–200', monthlyPremium: '₦9,000–₦18,000/employee', processingTime: '3–5 business days', rating: 4.9 },
  { id: 'total-health', name: 'Total Health Trust', logo: 'TH', states: ['Abuja', 'Kano', 'Kaduna', 'Niger'], employeeRange: '5–300', monthlyPremium: '₦7,000–₦13,500/employee', processingTime: '5–10 business days', rating: 4.6 },
];

type EnrollStep = 'cta' | 'directory' | 'handoff' | 'tracking';

interface NHIAEnrollmentBannerProps {
  companyName: string;
  rcNumber: string;
  employeeCount: number;
  sector: string;
}

export function NHIAEnrollmentBanner({
  companyName,
  rcNumber,
  employeeCount,
  sector,
}: NHIAEnrollmentBannerProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<EnrollStep>('cta');
  const [selectedHMO, setSelectedHMO] = useState<HMO | null>(null);
  const [stateFilter, setStateFilter] = useState('All');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const states = ['All', 'Lagos', 'Abuja', 'Rivers', 'Kano', 'Ogun', 'Oyo', 'Kaduna', 'Niger'];
  const filteredHMOs = stateFilter === 'All'
    ? HMOS
    : HMOS.filter((h) => h.states.includes(stateFilter) || h.states.includes('Nationwide'));

  const handleHandoff = (hmo: HMO) => {
    setSelectedHMO(hmo);
    setStep('handoff');
  };

  const handleConfirmHandoff = () => {
    showToast('success', 'Enrollment Started', `Your details have been sent to ${selectedHMO?.name}. They will contact you within 24 hours.`);
    setStep('tracking');
  };

  // CTA Banner
  if (step === 'cta') {
    return (
      <div
        className="rounded-lg border p-4 sm:p-5 mb-6 relative"
        style={{ backgroundColor: 'rgba(255,48,0,0.05)', borderColor: '#FF3000' }}
        role="alert"
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(255,48,0,0.15)' }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: '#FF3000' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#FF3000' }}>
              NHIA Certificate Missing — Action Required
            </p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '14px' }}>
              The September 2025 presidential directive mandates NHIA enrollment for all federal procurement. Without it, you are <strong>ineligible to bid</strong> — regardless of other certificates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <button
                onClick={() => setStep('directory')}
                className="flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FF3000', fontSize: '14px' }}
              >
                Enroll with an HMO Partner
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('info', 'Guide', 'NHIA enrollment guide opening in new tab')}
                className="flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
                style={{ fontSize: '14px' }}
              >
                View Application Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HMO Directory
  if (step === 'directory') {
    return (
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setStep('cta')} className="text-muted-foreground hover:text-foreground" aria-label="Back to enrollment banner">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Select an HMO Partner</h2>
            <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
              Your company details will be pre-filled automatically
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {states.map((s) => (
            <button
              key={s}
              onClick={() => setStateFilter(s)}
              className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                stateFilter === s
                  ? 'border-[#FF3000] text-[#FF3000] bg-[#FF3000]/5'
                  : 'border-border text-muted-foreground hover:border-foreground'
              }`}
              style={{ fontSize: '12px' }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredHMOs.map((hmo) => (
            <div key={hmo.id} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-[#FF3000]/30 transition-colors">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white font-bold"
                style={{ backgroundColor: '#FF3000', fontSize: '12px' }}
              >
                {hmo.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>{hmo.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      {hmo.states.join(' · ')} · {hmo.employeeRange} employees
                    </p>
                  </div>
                  <span className="text-yellow-600 font-medium" style={{ fontSize: '13px' }}>
                    ★ {hmo.rating}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{hmo.monthlyPremium}</span>
                  <span className="text-muted-foreground" style={{ fontSize: '12px' }}>Processing: {hmo.processingTime}</span>
                </div>
              </div>
              <button
                onClick={() => handleHandoff(hmo)}
                className="shrink-0 px-3 py-1.5 min-h-[36px] rounded-md text-white hover:opacity-90"
                style={{ backgroundColor: '#FF3000', fontSize: '13px' }}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pre-filled Handoff
  if (step === 'handoff' && selectedHMO) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setStep('directory')} className="text-muted-foreground hover:text-foreground" aria-label="Back to HMO directory">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Confirm enrollment with {selectedHMO.name}</h2>
        </div>

        <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
          The following details will be sent to {selectedHMO.name} automatically. No re-entry required.
        </p>

        <div className="bg-muted/30 rounded-lg p-4 space-y-2 mb-4">
          {[
            ['Company Name', companyName],
            ['RC Number', rcNumber],
            ['Sector', sector],
            ['Employee Count', employeeCount.toString()],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-muted-foreground" style={{ fontSize: '13px' }}>{label}</span>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mb-4" style={{ fontSize: '13px' }}>
          After confirmation, {selectedHMO.name} will contact your registered email within 24 hours to complete enrollment. ClearPass will track your enrollment progress automatically.
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={() => setStep('directory')}
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors"
            style={{ fontSize: '14px' }}
          >
            Choose Different HMO
          </button>
          <button
            onClick={handleConfirmHandoff}
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-md text-white hover:opacity-90"
            style={{ backgroundColor: '#FF3000', fontSize: '14px' }}
          >
            Confirm &amp; Send Details
          </button>
        </div>
      </div>
    );
  }

  // Enrollment Tracking
  if (step === 'tracking') {
    const trackingSteps = [
      { label: 'HMO Selected', done: true },
      { label: 'Details Sent to HMO', done: true },
      { label: 'Application Under Review', done: false },
      { label: 'NHIA Certificate Issued', done: false },
    ];
    return (
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5" style={{ color: '#1FC16B' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Enrollment in Progress</h2>
        </div>
        <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
          Your details have been sent to <strong>{selectedHMO?.name}</strong>. Track your enrollment below.
        </p>
        <div className="space-y-3">
          {trackingSteps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2"
                style={{
                  borderColor: s.done ? '#1FC16B' : '#d1d5db',
                  backgroundColor: s.done ? '#1FC16B' : 'transparent',
                }}
              >
                {s.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <span style={{ fontSize: '14px', color: s.done ? undefined : 'var(--muted-foreground)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="mt-4 text-muted-foreground hover:text-foreground"
          style={{ fontSize: '13px' }}
        >
          Dismiss — I'll check progress in Reports
        </button>
      </div>
    );
  }

  return null;
}
