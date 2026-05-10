import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Hash,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth, type AccountType, type RegisterData } from '../context/AuthContext';
import { useToast } from './ToastProvider';

type AuthMode = 'login' | 'register' | 'reset' | 'otp' | 'mfa';

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  business: 'Corporate Business',
  mda: 'MDA / Government Agency',
  partner: 'Compliance Partner (Consultant)',
  hmo: 'HMO Partner',
  admin: 'Admin',
};

const DEMO_CREDENTIALS = [
  { type: 'Business', email: 'amaka@techventures.ng', password: 'demo1234' },
  { type: 'MDA', email: 'bello.adamu@procurement.gov.ng', password: 'demo1234' },
  { type: 'Partner', email: 'chisom@compliancepro.ng', password: 'demo1234' },
  { type: 'HMO', email: 'fatima@axiahmo.ng', password: 'demo1234' },
  { type: 'Admin', email: 'admin@clearpass.com.ng', password: 'admin1234' },
];

interface AuthViewProps {
  onAuthenticated: () => void;
}

export function AuthView({ onAuthenticated }: AuthViewProps) {
  const { login, register, resetPassword, verifyOTP } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regData, setRegData] = useState<Partial<RegisterData>>({
    accountType: 'business',
    consentGiven: false,
  });
  const [regError, setRegError] = useState('');
  const [regStep, setRegStep] = useState(1);

  // Reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // OTP state
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleLogin = async () => {
    setLoginError('');
    if (!loginEmail.trim()) { setLoginError('Email is required'); return; }
    if (!loginPassword) { setLoginError('Password is required'); return; }
    setIsLoading(true);
    const result = await login(loginEmail, loginPassword);
    setIsLoading(false);
    if (result.success) {
      onAuthenticated();
    } else {
      setLoginError(result.error ?? 'Login failed');
    }
  };

  const handleRegisterStep1 = () => {
    setRegError('');
    if (!regData.name?.trim()) { setRegError('Full name is required'); return; }
    if (!regData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email)) {
      setRegError('Valid email is required'); return;
    }
    if (!regData.phone?.trim()) { setRegError('Phone number is required'); return; }
    if ((regData.password?.length ?? 0) < 8) { setRegError('Password must be at least 8 characters'); return; }
    if (regData.accountType === 'mda' && !regData.email?.endsWith('.gov.ng')) {
      setRegError('MDA accounts require an official .gov.ng email address'); return;
    }
    setRegStep(2);
  };

  const handleRegister = async () => {
    setRegError('');
    if (regData.accountType === 'business' && !regData.rcNumber?.trim()) {
      setRegError('RC Number is required for business accounts'); return;
    }
    if (!regData.consentGiven) {
      setRegError('You must agree to the data processing terms to continue'); return;
    }
    setIsLoading(true);
    const result = await register(regData as RegisterData);
    setIsLoading(false);
    if (result.success) {
      setPendingEmail(regData.email ?? '');
      setMode('otp');
      showToast('info', 'Verification Code Sent', `OTP sent to ${regData.email} and ${regData.phone}`);
    } else {
      setRegError(result.error ?? 'Registration failed');
    }
  };

  const handleReset = async () => {
    if (!resetEmail.trim()) return;
    setIsLoading(true);
    await resetPassword(resetEmail);
    setIsLoading(false);
    setResetSent(true);
  };

  const handleOTP = async () => {
    setOtpError('');
    if (otp.length !== 6) { setOtpError('Enter the 6-digit code'); return; }
    setIsLoading(true);
    const ok = await verifyOTP(otp);
    setIsLoading(false);
    if (ok) {
      showToast('success', 'Verified', 'Your account has been verified successfully');
      onAuthenticated();
    } else {
      setOtpError('Invalid code. Try 123456 for demo.');
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) onAuthenticated();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-10 shrink-0"
        style={{ backgroundColor: '#FF3000' }}
      >
        <div>
          <img src="/clearpass-logo.svg" alt="ClearPass" className="h-10 w-auto brightness-0 invert mb-10" />
          <h1 className="text-white mb-4" style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.2 }}>
            Nigeria's Federal Compliance Platform
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', lineHeight: 1.6 }}>
            Aggregate, verify, and monitor all mandatory federal compliance certificates in one place.
          </p>
        </div>
        <div className="space-y-4">
          {['NHIA', 'PCC', 'NSITF', 'FIRS TIN', 'BPP', 'ITF'].map((cert) => (
            <div key={cert} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{cert} Certificate Tracking</span>
            </div>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
          © 2026 Sparkr Digitals · clearpass.com.ng
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center p-4 sm:p-8 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden w-full mb-6 pt-4">
          <img src="/clearpass-logo.svg" alt="ClearPass" className="h-8 w-auto" />
        </div>

        <div className="w-full max-w-md">
          {/* ── LOGIN ── */}
          {mode === 'login' && (
            <div>
              <h2 className="mb-1" style={{ fontSize: '26px', fontWeight: 700 }}>Welcome back</h2>
              <p className="text-muted-foreground mb-6" style={{ fontSize: '14px' }}>
                Sign in to your ClearPass account
              </p>

              {loginError && <ErrorBanner message={loginError} />}

              <div className="space-y-4">
                <Field label="Email address" htmlFor="login-email">
                  <InputWithIcon
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    placeholder="you@company.ng"
                    icon={Mail}
                    onEnter={handleLogin}
                  />
                </Field>
                <Field label="Password" htmlFor="login-password">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full pl-9 pr-10 py-2.5 min-h-[44px] border border-border rounded-md bg-input-background"
                      style={{ fontSize: '15px' }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>

              <div className="flex justify-end mt-2 mb-4">
                <button
                  onClick={() => setMode('reset')}
                  className="text-[#FF3000] hover:underline"
                  style={{ fontSize: '13px' }}
                >
                  Forgot password?
                </button>
              </div>

              <PrimaryButton onClick={handleLogin} loading={isLoading} label="Sign In" />

              <p className="text-center mt-4 text-muted-foreground" style={{ fontSize: '14px' }}>
                No account?{' '}
                <button onClick={() => setMode('register')} className="text-[#FF3000] hover:underline font-medium">
                  Register free
                </button>
              </p>

              {/* Demo quick-access */}
              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-center text-muted-foreground mb-3" style={{ fontSize: '12px', fontWeight: 500 }}>
                  DEMO QUICK ACCESS
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {DEMO_CREDENTIALS.map((c) => (
                    <button
                      key={c.type}
                      onClick={() => quickLogin(c.email, c.password)}
                      disabled={isLoading}
                      className="flex items-center justify-between px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors text-left disabled:opacity-50"
                    >
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{c.type}</span>
                      <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{c.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── REGISTER STEP 1 ── */}
          {mode === 'register' && regStep === 1 && (
            <div>
              <button onClick={() => setMode('login')} className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="mb-1" style={{ fontSize: '26px', fontWeight: 700 }}>Create account</h2>
              <p className="text-muted-foreground mb-5" style={{ fontSize: '14px' }}>Start your compliance journey</p>

              {regError && <ErrorBanner message={regError} />}

              <div className="space-y-3">
                <Field label="Account type" htmlFor="reg-type">
                  <select
                    id="reg-type"
                    value={regData.accountType}
                    onChange={(e) => setRegData((d) => ({ ...d, accountType: e.target.value as AccountType }))}
                    className="w-full px-3 py-2.5 min-h-[44px] border border-border rounded-md bg-input-background"
                    style={{ fontSize: '15px' }}
                  >
                    {(Object.entries(ACCOUNT_TYPE_LABELS) as [AccountType, string][])
                      .filter(([k]) => k !== 'admin')
                      .map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                  </select>
                </Field>
                <Field label="Full name" htmlFor="reg-name">
                  <InputWithIcon id="reg-name" type="text" value={regData.name ?? ''} onChange={(v) => setRegData((d) => ({ ...d, name: v }))} placeholder="Amaka Okoro" icon={User} />
                </Field>
                <Field label={regData.accountType === 'mda' ? 'Official government email (.gov.ng)' : 'Email address'} htmlFor="reg-email">
                  <InputWithIcon id="reg-email" type="email" value={regData.email ?? ''} onChange={(v) => setRegData((d) => ({ ...d, email: v }))} placeholder={regData.accountType === 'mda' ? 'you@ministry.gov.ng' : 'you@company.ng'} icon={Mail} />
                </Field>
                <Field label="Phone number" htmlFor="reg-phone">
                  <InputWithIcon id="reg-phone" type="tel" value={regData.phone ?? ''} onChange={(v) => setRegData((d) => ({ ...d, phone: v }))} placeholder="+234 801 234 5678" icon={Phone} />
                </Field>
                <Field label="Password" htmlFor="reg-password">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={regData.password ?? ''}
                      onChange={(e) => setRegData((d) => ({ ...d, password: e.target.value }))}
                      className="w-full pl-9 pr-10 py-2.5 min-h-[44px] border border-border rounded-md bg-input-background"
                      style={{ fontSize: '15px' }}
                      placeholder="Min. 8 characters"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>
              <PrimaryButton onClick={handleRegisterStep1} loading={false} label="Continue" className="mt-4" />
            </div>
          )}

          {/* ── REGISTER STEP 2 ── */}
          {mode === 'register' && regStep === 2 && (
            <div>
              <button onClick={() => setRegStep(1)} className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="mb-1" style={{ fontSize: '26px', fontWeight: 700 }}>Company details</h2>
              <p className="text-muted-foreground mb-5" style={{ fontSize: '14px' }}>Step 2 of 2 — almost done</p>

              {regError && <ErrorBanner message={regError} />}

              <div className="space-y-3">
                {(regData.accountType === 'business' || regData.accountType === 'partner' || regData.accountType === 'hmo') && (
                  <Field label="Company / Organisation name" htmlFor="reg-company">
                    <InputWithIcon id="reg-company" type="text" value={regData.companyName ?? ''} onChange={(v) => setRegData((d) => ({ ...d, companyName: v }))} placeholder="TechVentures Nigeria Ltd" icon={Building2} />
                  </Field>
                )}
                {regData.accountType === 'business' && (
                  <Field label="RC Number (CAC Registration)" htmlFor="reg-rc">
                    <InputWithIcon id="reg-rc" type="text" value={regData.rcNumber ?? ''} onChange={(v) => setRegData((d) => ({ ...d, rcNumber: v.toUpperCase() }))} placeholder="RC1234567" icon={Hash} />
                    <p className="text-muted-foreground mt-1" style={{ fontSize: '12px' }}>
                      Enter your CAC-registered company RC number for instant profile auto-population
                    </p>
                  </Field>
                )}
                {regData.accountType === 'mda' && (
                  <Field label="Ministry / Agency name" htmlFor="reg-mda">
                    <InputWithIcon id="reg-mda" type="text" value={regData.mdaName ?? ''} onChange={(v) => setRegData((d) => ({ ...d, mdaName: v }))} placeholder="Federal Ministry of Works" icon={Building2} />
                  </Field>
                )}

                {/* NDPA Consent */}
                <div className="mt-2 p-3 rounded-lg border border-border bg-muted/30">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regData.consentGiven ?? false}
                      onChange={(e) => setRegData((d) => ({ ...d, consentGiven: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 accent-[#FF3000]"
                    />
                    <span style={{ fontSize: '13px' }}>
                      I agree to ClearPass processing my company's compliance data in accordance with the{' '}
                      <span className="text-[#FF3000]">Nigeria Data Protection Act 2023 (NDPA)</span>.
                      I understand I can request data deletion at any time through the platform.
                    </span>
                  </label>
                </div>
              </div>

              <PrimaryButton onClick={handleRegister} loading={isLoading} label="Create Account" className="mt-4" />
            </div>
          )}

          {/* ── RESET PASSWORD ── */}
          {mode === 'reset' && (
            <div>
              <button onClick={() => setMode('login')} className="flex items-center gap-1 text-muted-foreground mb-4 hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
              <h2 className="mb-1" style={{ fontSize: '26px', fontWeight: 700 }}>Reset password</h2>

              {!resetSent ? (
                <>
                  <p className="text-muted-foreground mb-5" style={{ fontSize: '14px' }}>
                    Enter your registered email and we'll send a reset link.
                  </p>
                  <Field label="Email address" htmlFor="reset-email">
                    <InputWithIcon id="reset-email" type="email" value={resetEmail} onChange={setResetEmail} placeholder="you@company.ng" icon={Mail} onEnter={handleReset} />
                  </Field>
                  <PrimaryButton onClick={handleReset} loading={isLoading} label="Send Reset Link" className="mt-4" />
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#1FC16B' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600 }}>Reset link sent</p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '14px' }}>
                    Check {resetEmail} for your password reset instructions.
                  </p>
                  <button onClick={() => { setMode('login'); setResetSent(false); }} className="mt-4 text-[#FF3000] hover:underline" style={{ fontSize: '14px' }}>
                    Back to login
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── OTP VERIFICATION ── */}
          {mode === 'otp' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(255,48,0,0.1)' }}>
                  <Shield className="w-7 h-7" style={{ color: '#FF3000' }} />
                </div>
                <h2 className="mb-1" style={{ fontSize: '26px', fontWeight: 700 }}>Verify your account</h2>
                <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                  Enter the 6-digit code sent to {pendingEmail}
                </p>
                <p className="text-muted-foreground mt-1" style={{ fontSize: '12px' }}>Demo code: 123456</p>
              </div>

              {otpError && <ErrorBanner message={otpError} />}

              <Field label="Verification code" htmlFor="otp-input">
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && handleOTP()}
                  className="w-full text-center py-3 min-h-[52px] border border-border rounded-md bg-input-background tracking-[0.5em]"
                  style={{ fontSize: '22px', fontWeight: 600 }}
                  placeholder="000000"
                />
              </Field>

              <PrimaryButton onClick={handleOTP} loading={isLoading} label="Verify" className="mt-4" />

              <button
                onClick={() => showToast('info', 'Code Resent', 'A new verification code has been sent')}
                className="w-full text-center mt-3 text-muted-foreground hover:text-foreground"
                style={{ fontSize: '13px' }}
              >
                Didn't receive it? Resend code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function InputWithIcon({
  id, type, value, onChange, placeholder, icon: Icon, onEnter,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: typeof Mail;
  onEnter?: () => void;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 min-h-[44px] border border-border rounded-md bg-input-background"
        style={{ fontSize: '15px' }}
      />
    </div>
  );
}

function PrimaryButton({
  onClick, loading, label, className = '',
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full py-3 min-h-[48px] rounded-md text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60 ${className}`}
      style={{ backgroundColor: '#FF3000', fontSize: '15px' }}
    >
      {loading ? 'Please wait…' : label}
    </button>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-md mb-4 border" style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderColor: '#fca5a5' }}>
      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
      <p style={{ fontSize: '13px', color: '#dc2626' }}>{message}</p>
    </div>
  );
}
