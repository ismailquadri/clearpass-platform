import { CheckCircle2, Building2, FileText, Users, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    rcNumber: '',
    companyName: '',
    industrySector: '',
    employeeCount: '',
    teamEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Company Information step validation
      if (!formData.rcNumber.trim()) {
        newErrors.rcNumber = 'RC number is required';
      } else if (!/^RC\d{7,}$/i.test(formData.rcNumber.trim())) {
        newErrors.rcNumber = 'Please enter a valid RC number (e.g., RC1234567)';
      }

      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }

      if (!formData.industrySector) {
        newErrors.industrySector = 'Please select an industry sector';
      }

      if (!formData.employeeCount) {
        newErrors.employeeCount = 'Please select employee count range';
      }
    }

    if (step === 3) {
      // Team invitation step validation
      if (formData.teamEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.teamEmail)) {
        newErrors.teamEmail = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
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
              backgroundColor: '#FF3000',
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
                    style={isActive || isCompleted ? { backgroundColor: '#FF3000' } : {}}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && <div className="w-12 h-px bg-border mx-2" />}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
            >
              <Icon className="w-10 h-10" style={{ color: '#FF3000' }} />
            </div>
            <h2 id="onboarding-title" className="mb-3" style={{ fontSize: '28px', fontWeight: '600' }}>
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
                  backgroundColor: 'rgba(255, 48, 0, 0.1)',
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#FF3000' }}>
                  What is ClearPass?
                </h3>
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
                <label
                  htmlFor="onboarding-rc-number"
                  className="block mb-2"
                  style={{ fontSize: '14px', fontWeight: '500' }}
                >
                  RC Number <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="onboarding-rc-number"
                  type="text"
                  value={formData.rcNumber}
                  onChange={(e) => handleInputChange('rcNumber', e.target.value)}
                  placeholder="Enter your company RC number"
                  required
                  aria-invalid={!!errors.rcNumber}
                  aria-describedby={errors.rcNumber ? 'onboarding-rc-error' : undefined}
                  className={`w-full px-4 py-3 bg-input-background border rounded-md ${
                    errors.rcNumber ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.rcNumber && (
                  <p
                    id="onboarding-rc-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-2"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {errors.rcNumber}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="onboarding-company-name"
                  className="block mb-2"
                  style={{ fontSize: '14px', fontWeight: '500' }}
                >
                  Company Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="onboarding-company-name"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  required
                  aria-invalid={!!errors.companyName}
                  aria-describedby={errors.companyName ? 'onboarding-company-error' : undefined}
                  className={`w-full px-4 py-3 bg-input-background border rounded-md ${
                    errors.companyName ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.companyName && (
                  <p
                    id="onboarding-company-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-2"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {errors.companyName}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="onboarding-industry-sector"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Industry Sector <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="onboarding-industry-sector"
                    value={formData.industrySector}
                    onChange={(e) => handleInputChange('industrySector', e.target.value)}
                    required
                    aria-invalid={!!errors.industrySector}
                    aria-describedby={errors.industrySector ? 'onboarding-sector-error' : undefined}
                    className={`w-full px-4 py-3 bg-input-background border rounded-md ${
                      errors.industrySector ? 'border-red-500' : 'border-border'
                    }`}
                  >
                    <option value="">Select sector</option>
                    <option value="construction">Construction & Engineering</option>
                    <option value="it">Information Technology</option>
                    <option value="professional">Professional Services</option>
                  </select>
                  {errors.industrySector && (
                    <p
                      id="onboarding-sector-error"
                      className="text-red-500 text-sm mt-1 flex items-center gap-2"
                      role="alert"
                    aria-live="assertive"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {errors.industrySector}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="onboarding-employee-count"
                    className="block mb-2"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    Number of Employees <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="onboarding-employee-count"
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    required
                    aria-invalid={!!errors.employeeCount}
                    aria-describedby={errors.employeeCount ? 'onboarding-employee-error' : undefined}
                    className={`w-full px-4 py-3 bg-input-background border rounded-md ${
                      errors.employeeCount ? 'border-red-500' : 'border-border'
                    }`}
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                  </select>
                  {errors.employeeCount && (
                    <p
                      id="onboarding-employee-error"
                      className="text-red-500 text-sm mt-1 flex items-center gap-2"
                      role="alert"
                    aria-live="assertive"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {errors.employeeCount}
                    </p>
                  )}
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
                  <label htmlFor="onboarding-team-email" className="sr-only">
                    Team member email
                  </label>
                  <input
                    id="onboarding-team-email"
                    type="email"
                    value={formData.teamEmail}
                    onChange={(e) => handleInputChange('teamEmail', e.target.value)}
                    placeholder="team@company.ng"
                    aria-invalid={!!errors.teamEmail}
                    aria-describedby={errors.teamEmail ? 'onboarding-email-error' : undefined}
                    className={`flex-1 px-4 py-2 bg-input-background border rounded-md ${
                      errors.teamEmail ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  <button
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: '#FF3000' }}
                  >
                    Invite
                  </button>
                </div>
                {errors.teamEmail && (
                  <p
                    id="onboarding-email-error"
                    className="text-red-500 text-sm flex items-center gap-2"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {errors.teamEmail}
                  </p>
                )}
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
              style={{ backgroundColor: '#FF3000' }}
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
