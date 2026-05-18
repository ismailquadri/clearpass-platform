import { useState } from 'react';
import { Building2, Eye, EyeOff, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { login } from '../api/auth';
import { useToast } from './ToastProvider';

interface LoginProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
}

export function Login({ onSuccess, onRegisterClick }: LoginProps) {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresMfa] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; mfaCode?: string }>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mfaCode: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMfaCode = (code: string): boolean => {
    // MFA code is 6 digits
    return /^\d{6}$/.test(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (requiresMfa && !formData.mfaCode) {
      newErrors.mfaCode = 'MFA code is required';
    } else if (requiresMfa && formData.mfaCode && !validateMfaCode(formData.mfaCode)) {
      newErrors.mfaCode = 'MFA code must be 6 digits';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      if (requiresMfa) {
        // In a real implementation, you'd have a separate endpoint for MFA verification
        // For now, we'll simulate it
        await login({ email: formData.email, password: formData.password });
        showToast('success', 'Login Successful', 'Welcome back to ClearPass');
        onSuccess();
      } else {
        await login({ email: formData.email, password: formData.password });
        // Check if MFA is required (in real implementation, this would come from the backend)
        // For now, we'll assume MFA is not required for simplicity
        showToast('success', 'Login Successful', 'Welcome back to ClearPass');
        onSuccess();
      }
    } catch (error) {
      // In a real implementation, check if error indicates MFA is required
      // For now, we'll just show the error
      showToast(
        'error',
        'Login Failed',
        error instanceof Error ? error.message : 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: 'email' | 'password' | 'mfaCode', value: string) => {
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
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              disabled={requiresMfa}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.email ? 'border-red-500' : 'border-border'
              } bg-input-background disabled:opacity-50`}
              placeholder="you@company.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          {!requiresMfa && (
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
          )}

          {/* MFA Code */}
          {requiresMfa && (
            <div>
              <label htmlFor="mfaCode" className="block mb-2 text-sm font-medium">
                Two-Factor Authentication Code
              </label>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#FF3000]" />
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              <input
                id="mfaCode"
                type="text"
                inputMode="numeric"
                value={formData.mfaCode}
                onChange={(e) =>
                  updateFormData('mfaCode', e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className={`w-full px-4 py-3 rounded-md border text-center text-2xl tracking-widest ${
                  errors.mfaCode ? 'border-red-500' : 'border-border'
                } bg-input-background`}
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
              />
              {errors.mfaCode && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.mfaCode}
                </p>
              )}
            </div>
          )}

          {/* Forgot Password */}
          {!requiresMfa && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#FF3000] hover:underline"
                onClick={() =>
                  showToast('info', 'Password Reset', 'Password reset link sent to your email')
                }
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#FF3000] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : requiresMfa ? 'Verify' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-[#FF3000] font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
