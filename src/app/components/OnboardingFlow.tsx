import { useState } from 'react';
import {
  Building2,
  Landmark,
  Users,
  ArrowRight,
  CheckCircle2,
  FileText,
  Bell,
  Search,
  BarChart3,
  Briefcase,
} from 'lucide-react';

type Persona = 'Business' | 'MDA' | 'Partner';

interface OnboardingFlowProps {
  onComplete: (persona: Persona) => void;
}

const PERSONA_CARDS = [
  {
    id: 'Business' as Persona,
    icon: Building2,
    label: 'Business',
    tagline: "I manage my company's compliance",
  },
  {
    id: 'MDA' as Persona,
    icon: Landmark,
    label: 'Government / MDA',
    tagline: 'I verify vendor compliance',
  },
  {
    id: 'Partner' as Persona,
    icon: Users,
    label: 'Compliance Partner',
    tagline: 'I manage compliance for clients',
  },
];

const PERSONA_FEATURES: Record<Persona, { icon: typeof CheckCircle2; text: string }[]> = {
  Business: [
    { icon: FileText, text: 'Track NHIA, PCC, NSITF, FIRS, BPP & ITF certificates in one place' },
    { icon: Bell, text: 'Get alerts before any certificate expires' },
    { icon: CheckCircle2, text: 'Generate procurement-ready compliance reports instantly' },
  ],
  MDA: [
    { icon: Search, text: 'Verify vendor compliance by RC number in seconds' },
    { icon: FileText, text: 'Pre-qualify bidders with a full certificate check' },
    { icon: BarChart3, text: 'Maintain an immutable audit trail for every verification' },
  ],
  Partner: [
    { icon: Briefcase, text: 'Manage compliance portfolios for multiple clients' },
    { icon: BarChart3, text: 'Track compliance scores across your entire client base' },
    { icon: FileText, text: 'Generate branded compliance reports for any client' },
  ],
};

const PERSONA_READY_COPY: Record<Persona, string> = {
  Business:
    "Upload your first certificate and we'll start tracking expiry dates and compliance score right away.",
  MDA: "Enter any RC number to check a vendor's full compliance status before procurement.",
  Partner: 'Add your first client and start managing their compliance from one portfolio view.',
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [persona, setPersona] = useState<Persona | null>(null);

  const activeCard = persona ? PERSONA_CARDS.find((c) => c.id === persona) : null;

  const handleNext = () => {
    if (step === 0 && persona) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2 && persona) onComplete(persona);
  };

  const handleBack = () => {
    if (step === 1) setStep(0);
    else if (step === 2) setStep(1);
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-background flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/clearpass-logo.svg" alt="ClearPass" className="h-9 w-auto" />
        </div>
        <div className="flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: step === i ? '24px' : '8px',
                backgroundColor: step >= i ? '#FF3000' : 'var(--muted)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {step === 0 && (
            <div>
              <div className="text-center mb-10">
                <h1
                  id="onboarding-title"
                  style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.2 }}
                  className="mb-3"
                >
                  Welcome to ClearPass
                </h1>
                <p className="text-muted-foreground" style={{ fontSize: '17px' }}>
                  Nigeria's compliance platform. What brings you here?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PERSONA_CARDS.map((card) => {
                  const Icon = card.icon;
                  const isSelected = persona === card.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => setPersona(card.id)}
                      aria-pressed={isSelected}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#FF3000] bg-[#fff5f3] dark:bg-[#2a1010]'
                          : 'border-border hover:border-[#FF3000]/40 hover:bg-muted/50'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                        style={{ backgroundColor: isSelected ? '#FF3000' : 'var(--muted)' }}
                      >
                        <Icon
                          className="w-6 h-6 transition-colors"
                          style={{ color: isSelected ? 'white' : 'var(--muted-foreground)' }}
                        />
                      </div>
                      <p style={{ fontSize: '16px', fontWeight: 600 }} className="mb-1">
                        {card.label}
                      </p>
                      <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                        {card.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && persona && activeCard && (
            <div className="text-center">
              {(() => {
                const PersonaIcon = activeCard.icon;
                return (
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
                  >
                    <PersonaIcon className="w-8 h-8" style={{ color: '#FF3000' }} />
                  </div>
                );
              })()}
              <h2
                id="onboarding-title"
                style={{ fontSize: '28px', fontWeight: 700 }}
                className="mb-2"
              >
                Here's what you can do
              </h2>
              <p className="text-muted-foreground mb-10" style={{ fontSize: '16px' }}>
                ClearPass is built for{' '}
                {persona === 'MDA'
                  ? 'government agencies'
                  : persona === 'Partner'
                    ? 'compliance partners'
                    : 'businesses'}{' '}
                like yours.
              </p>

              <div className="space-y-3 text-left">
                {PERSONA_FEATURES[persona].map((feature, i) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
                      >
                        <FeatureIcon className="w-5 h-5" style={{ color: '#FF3000' }} />
                      </div>
                      <p style={{ fontSize: '15px', fontWeight: 500 }}>{feature.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && persona && (
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
              >
                <CheckCircle2 className="w-10 h-10" style={{ color: '#FF3000' }} />
              </div>
              <h2
                id="onboarding-title"
                style={{ fontSize: '32px', fontWeight: 700 }}
                className="mb-4"
              >
                You're all set!
              </h2>
              <p
                className="text-muted-foreground"
                style={{ fontSize: '17px', maxWidth: '420px', margin: '0 auto' }}
              >
                {PERSONA_READY_COPY[persona]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-border flex items-center justify-between">
        <button
          onClick={handleBack}
          className={`px-5 py-2.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors ${
            step === 0 ? 'invisible' : ''
          }`}
          style={{ fontSize: '15px' }}
          tabIndex={step === 0 ? -1 : 0}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={step === 0 && !persona}
          className="flex items-center gap-2 px-7 py-3 rounded-lg text-white font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#FF3000', fontSize: '15px' }}
        >
          {step === 2 ? 'Get Started' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
