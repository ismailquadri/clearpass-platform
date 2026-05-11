import { useState } from 'react';
import { Building2, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { register } from '../api/auth';
import { useToast } from './ToastProvider';
import type { UserRole } from '../api/types';

interface RegisterProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  bvn?: string;
  companyName?: string;
  rcNumber?: string;
}

export function Register({ onSuccess, onLoginClick }: RegisterProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'contractor',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateGovernmentEmail = (email: string): boolean => {
    const govDomains = [
      '.gov.ng',
      '.gov.com',
      '@fmc',
      '@mda',
      '@ministry',
      '@parliament',
      '@nationalassembly',
    ];
    return govDomains.some((domain) => email.toLowerCase().includes(domain));
  };

  const validateBVN = (bvn: string): boolean => {
    // BVN is 11 digits
    return /^\d{11}$/.test(bvn);
  };

  const validateRCNumber = (rc: string): boolean => {
    // RC number format: RC followed by 7+ digits
    return /^RC\d{7,}$/i.test(rc);
  };

  const validatePhone = (phone: string): boolean => {
    // Nigerian phone number: 11 digits starting with 0
    return /^0[789]\d{9}$/.test(phone);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Nigerian phone number (e.g., 08012345678)';
    }

    if (formData.role === 'mda' && !validateGovernmentEmail(formData.email)) {
      newErrors.email = 'MDA users must register with a government email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // BVN is required for contractors
    if (formData.role === 'contractor' && !formData.bvn) {
      newErrors.bvn = 'BVN is required for contractor registration';
    } else if (formData.role === 'contractor' && formData.bvn && !validateBVN(formData.bvn)) {
      newErrors.bvn = 'BVN must be 11 digits';
    }

    // Company name and RC number are required for contractors
    if (formData.role === 'contractor' && !formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }

    if (formData.role === 'contractor' && !formData.rcNumber) {
      newErrors.rcNumber = 'RC number is required';
    } else if (formData.role === 'contractor' && formData.rcNumber && !validateRCNumber(formData.rcNumber)) {
      newErrors.rcNumber = 'RC number must be in format RC1234567';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
        phone: formData.phone,
      });

      showToast(
        'success',
        'Registration Successful',
        'Your account has been created. Please complete your company profile.'
      );
      onSuccess();
    } catch (error) {
      showToast(
        'error',
        'Registration Failed',
        error instanceof Error ? error.message : 'An error occurred during registration'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-8 h-8 text-[#FF3000]" />
            <span className="text-2xl font-bold">ClearPass</span>
          </div>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step >= s ? 'bg-[#FF3000]' : 'bg-muted'
              }`}
              style={{ width: step === s ? '32px' : '24px' }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Account Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.email ? 'border-red-500' : 'border-border'
                  } bg-input-background`}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className={`w-full px-4 py-3 rounded-md border ${
                      errors.password ? 'border-red-500' : 'border-border'
                    } bg-input-background pr-12`}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 rounded-md border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-border'
                    } bg-input-background pr-12`}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.firstName ? 'border-red-500' : 'border-border'
                  } bg-input-background`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.lastName ? 'border-red-500' : 'border-border'
                  } bg-input-background`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  } bg-input-background`}
                  placeholder="08012345678"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium">
                  I am a...
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => updateFormData('role', e.target.value as UserRole)}
                  className="w-full px-4 py-3 rounded-md border border-border bg-input-background"
                >
                  <option value="contractor">Business / Contractor</option>
                  <option value="mda">Government / MDA</option>
                  <option value="consultant">Compliance Partner</option>
                  <option value="hmo">Health Insurance (HMO)</option>
                </select>
                {formData.role === 'mda' && !validateGovernmentEmail(formData.email) && (
                  <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    MDA users must use a government email address
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Business Details (Contractors only) */}
          {step === 3 && (
            <div className="space-y-4">
              {formData.role === 'contractor' && (
                <>
                  <div>
                    <label htmlFor="bvn" className="block mb-2 text-sm font-medium">
                      BVN (Bank Verification Number)
                    </label>
                    <input
                      id="bvn"
                      type="text"
                      value={formData.bvn || ''}
                      onChange={(e) => updateFormData('bvn', e.target.value)}
                      className={`w-full px-4 py-3 rounded-md border ${
                        errors.bvn ? 'border-red-500' : 'border-border'
                      } bg-input-background`}
                      placeholder="12345678901"
                      maxLength={11}
                    />
                    {errors.bvn && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.bvn}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your BVN is required for identity verification. It will be validated against the
                      Nigerian Inter-Bank Settlement System.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block mb-2 text-sm font-medium">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      value={formData.companyName || ''}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className={`w-full px-4 py-3 rounded-md border ${
                        errors.companyName ? 'border-red-500' : 'border-border'
                      } bg-input-background`}
                      placeholder="Your Company Ltd"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rcNumber" className="block mb-2 text-sm font-medium">
                      RC Number
                    </label>
                    <input
                      id="rcNumber"
                      type="text"
                      value={formData.rcNumber || ''}
                      onChange={(e) => updateFormData('rcNumber', e.target.value)}
                      className={`w-full px-4 py-3 rounded-md border ${
                        errors.rcNumber ? 'border-red-500' : 'border-border'
                      } bg-input-background`}
                      placeholder="RC1234567"
                    />
                    {errors.rcNumber && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.rcNumber}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your company's RC number from the Corporate Affairs Commission (CAC)
                    </p>
                  </div>
                </>
              )}

              {formData.role !== 'contractor' && (
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Almost Done!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Create Account" to complete your registration.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-md border border-border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              type={step === 3 ? 'submit' : 'button'}
              onClick={step < 3 ? handleNext : undefined}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#FF3000] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : step === 3 ? 'Create Account' : 'Next'}
              {step < 3 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-[#FF3000] font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}