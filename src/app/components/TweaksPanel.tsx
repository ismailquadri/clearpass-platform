import { X, Settings2 } from 'lucide-react';
import { useState } from 'react';

export type Persona = 'Business' | 'MDA' | 'Partner';

export interface DashboardState {
  label: string;
  score: number;
  description: string;
}

export const DASHBOARD_STATES: DashboardState[] = [
  {
    label: 'Healthy',
    score: 92,
    description: 'All certificates active, procurement ready',
  },
  {
    label: 'Attention Required',
    score: 73,
    description: 'Certificate expiring soon, action needed',
  },
  {
    label: 'Critical',
    score: 52,
    description: 'Multiple certificates expired or expiring',
  },
  {
    label: 'Non-Compliant',
    score: 28,
    description: 'NHIA expired, not eligible to bid',
  },
  {
    label: 'New Registration',
    score: 0,
    description: 'Just registered, no certificates connected',
  },
  {
    label: 'Pending Verification',
    score: 65,
    description: 'Certificates uploaded, awaiting admin review',
  },
];

interface TweaksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  selectedState: DashboardState;
  onStateChange: (state: DashboardState) => void;
}

export function TweaksPanel({
  isOpen,
  onClose,
  selectedPersona,
  onPersonaChange,
  selectedState,
  onStateChange,
}: TweaksPanelProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed bottom-6 right-6 w-[520px] bg-card border border-border rounded-xl shadow-2xl z-50"
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Tweaks</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* Persona Selector */}
          <div>
            <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>
              Persona
            </h3>
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              {(['Business', 'MDA', 'Partner'] as Persona[]).map((persona) => (
                <button
                  key={persona}
                  onClick={() => onPersonaChange(persona)}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                    selectedPersona === persona
                      ? 'bg-card shadow-sm'
                      : 'hover:bg-card/50'
                  }`}
                  style={{
                    fontSize: '14px',
                    fontWeight: selectedPersona === persona ? '500' : '400',
                  }}
                >
                  {persona}
                </button>
              ))}
            </div>
            <p className="mt-3 text-muted-foreground" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              Switch between the three production portals. Each has its own information architecture,
              sidebar, and task ergonomics.
            </p>
          </div>

          {/* State Selector */}
          <div>
            <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>
              State
            </h3>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg flex items-center justify-between hover:bg-muted transition-colors"
              >
                <span style={{ fontSize: '14px' }}>
                  {selectedState.label} · {selectedState.score}/100
                </span>
                <svg
                  className="w-5 h-5 text-muted-foreground transition-transform"
                  style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                  {DASHBOARD_STATES.map((state, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onStateChange(state);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 ${
                        selectedState.label === state.label ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {state.label}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            fontSize: '12px',
                            backgroundColor:
                              state.score >= 80
                                ? 'rgb(31, 193, 107, 0.1)'
                                : state.score >= 60
                                ? 'rgb(250, 115, 25, 0.1)'
                                : 'rgb(251, 55, 72, 0.1)',
                            color:
                              state.score >= 80
                                ? 'rgb(31, 193, 107)'
                                : state.score >= 60
                                ? 'rgb(250, 115, 25)'
                                : 'rgb(251, 55, 72)',
                          }}
                        >
                          {state.score}/100
                        </span>
                      </div>
                      <p className="caption text-muted-foreground">{state.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-3 text-muted-foreground" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              All six PRD-defined dashboard states. The state strip on the dashboard mirrors this control.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function TweaksButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-30"
      style={{ backgroundColor: 'rgb(251, 115, 25)' }}
    >
      <Settings2 className="w-4 h-4 text-white" />
    </button>
  );
}
