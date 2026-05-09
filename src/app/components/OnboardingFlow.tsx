import { CheckCircle2, Building2, FileText, Users, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to ClearPass',
      description: 'Your all-in-one compliance management platform',
      icon: CheckCircle2,
    },
    {
      id: 'company',
      title: 'Company Information',
      description: 'Tell us about your business',
      icon: Building2,
    },
    {
      id: 'certificates',
      title: 'Connect Certificates',
      description: 'Link your existing compliance certificates',
      icon: FileText,
    },
    {
      id: 'team',
      title: 'Invite Your Team',
      description: 'Add team members to manage compliance',
      icon: Users,
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
      <div
        className="bg-card rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="h-2 bg-muted">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              backgroundColor: 'rgb(251, 115, 25)',
            }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive || isCompleted ? 'text-white' : 'bg-muted text-muted-foreground'
                    }`}
                    style={
                      isActive || isCompleted
                        ? { backgroundColor: 'rgb(251, 115, 25)' }
                        : {}
                    }
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-px bg-border mx-2" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: 'rgb(251, 115, 25, 0.1)' }}
            >
              <Icon className="w-10 h-10" style={{ color: 'rgb(251, 115, 25)' }} />
            </div>
            <h2 className="mb-3" style={{ fontSize: '28px', fontWeight: '600' }}>
              {currentStepData.title}
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
              {currentStepData.description}
            </p>
          </div>

          {/* Step-specific content */}
          {currentStep === 0 && (
            <div className="space-y-4 mb-8">
              <div
                className="p-4 rounded-lg border border-[#e5e5e5]"
                style={{
                  backgroundColor: 'rgb(71, 194, 255, 0.1)',
                }}
              >
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: 'rgb(71, 194, 255)' }}>
                  What is ClearPass?
                </h4>
                <p className="caption text-muted-foreground mt-1">
                  ClearPass is Nigeria's first unified compliance management platform. Track all 6
                  federal certificates in one dashboard, get expiry alerts, and generate
                  procurement-ready reports instantly.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Track 6 Certificates', value: 'NHIA, PCC, NSITF, FIRS, BPP, ITF' },
                  { label: 'Compliance Score', value: 'Real-time monitoring' },
                  { label: 'Expiry Alerts', value: 'Never miss a renewal' },
                ].map((item, index) => (
                  <div key={index} className="bg-muted rounded-lg p-3 text-center">
                    <p style={{ fontSize: '12px', fontWeight: '500' }}>{item.label}</p>
                    <p className="caption text-muted-foreground mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 mb-8">
              <div>
                <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                  RC Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your company RC number"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Industry Sector
                  </label>
                  <select className="w-full px-4 py-3 bg-input-background border border-border rounded-md">
                    <option>Select sector</option>
                    <option>Construction & Engineering</option>
                    <option>Information Technology</option>
                    <option>Professional Services</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Number of Employees
                  </label>
                  <select className="w-full px-4 py-3 bg-input-background border border-border rounded-md">
                    <option>Select range</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground text-center mb-6" style={{ fontSize: '14px' }}>
                Connect your existing certificates or upload documents to get started
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['NHIA', 'PCC', 'NSITF', 'FIRS', 'BPP', 'ITF'].map((cert) => (
                  <button
                    key={cert}
                    className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
                  >
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{cert}</p>
                    <p className="caption text-muted-foreground">Click to upload or connect</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground text-center mb-6" style={{ fontSize: '14px' }}>
                Invite team members to help manage your company's compliance
              </p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="team@company.ng"
                    className="flex-1 px-4 py-2 bg-input-background border border-border rounded-md"
                  />
                  <button
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: 'rgb(251, 115, 25)' }}
                  >
                    Invite
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="px-6 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-md text-white flex items-center gap-2"
              style={{ backgroundColor: 'rgb(251, 115, 25)' }}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
