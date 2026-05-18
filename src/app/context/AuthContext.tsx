import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type AccountType = 'business' | 'mda' | 'partner' | 'hmo' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: AccountType;
  companyName?: string;
  rcNumber?: string;
  mdaName?: string;
  partnerType?: 'distributor' | 'reseller' | 'direct';
  sector?: string;
  employeeBand?: '1-10' | '11-50' | '51-200' | '200+';
  mfaEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  cacVerified: boolean;
  consentGiven: boolean;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
  updateUser: (data: Partial<AuthUser>) => void;
  verifyOTP: (otp: string) => Promise<boolean>;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  accountType: AccountType;
  companyName?: string;
  rcNumber?: string;
  mdaName?: string;
  bvn?: string;
  govEmail?: string;
  consentGiven?: boolean;
}

const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: 'usr-001',
    name: 'Amaka Okoro',
    email: 'amaka@techventures.ng',
    phone: '+2348012345678',
    password: 'demo1234',
    accountType: 'business',
    companyName: 'TechVentures Nigeria Ltd',
    rcNumber: 'RC1234567',
    sector: 'Construction',
    employeeBand: '51-200',
    mfaEnabled: false,
    emailVerified: true,
    phoneVerified: true,
    cacVerified: true,
    consentGiven: true,
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'usr-002',
    name: 'Dr. Bello Adamu',
    email: 'bello.adamu@nhia.gov.ng',
    phone: '+2348023456789',
    password: 'demo1234',
    accountType: 'mda',
    mdaName: 'National Health Insurance Authority',
    mfaEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    cacVerified: false,
    consentGiven: true,
    createdAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 'usr-003',
    name: 'Chisom Okafor',
    email: 'chisom@compliancepro.ng',
    phone: '+2348034567890',
    password: 'demo1234',
    accountType: 'partner',
    companyName: 'CompliancePro Advisory',
    partnerType: 'distributor',
    mfaEnabled: false,
    emailVerified: true,
    phoneVerified: true,
    cacVerified: true,
    consentGiven: true,
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'usr-004',
    name: 'Fatima Aliyu',
    email: 'fatima@axiahmo.ng',
    phone: '+2348045678901',
    password: 'demo1234',
    accountType: 'hmo',
    companyName: 'Axia Health Insurance',
    mfaEnabled: false,
    emailVerified: true,
    phoneVerified: true,
    cacVerified: true,
    consentGiven: true,
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 'usr-005',
    name: 'ClearPass Admin',
    email: 'admin@clearpass.com.ng',
    phone: '+2348056789012',
    password: 'admin1234',
    accountType: 'admin',
    mfaEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    cacVerified: false,
    consentGiven: true,
    createdAt: '2026-01-01T09:00:00Z',
  },
];

const STORAGE_KEY = 'clearpass_auth_user';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored) as AuthUser;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({ user, isLoading: false, isAuthenticated: true });
      } catch {
        localStorage.removeItem(STORAGE_KEY);

        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: 'Invalid email or password' };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...user } = found;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setState({ user, isLoading: false, isAuthenticated: true });
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 1000));
    const exists = MOCK_USERS.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { success: false, error: 'An account with this email already exists' };

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '+2348000000000',
      accountType: data.accountType,
      companyName: data.companyName,
      rcNumber: data.rcNumber,
      mdaName: data.mdaName,
      mfaEnabled: data.accountType === 'mda' || data.accountType === 'admin',
      emailVerified: false,
      phoneVerified: false,
      cacVerified: false,
      consentGiven: data.consentGiven ?? true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setState({ user: newUser, isLoading: false, isAuthenticated: true });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isLoading: false, isAuthenticated: false });
  };

  const resetPassword = async (email: string): Promise<{ success: boolean }> => {
    await new Promise((r) => setTimeout(r, 800));
    const exists = MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase());
    return { success: exists };
  };

  const updateUser = (data: Partial<AuthUser>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));
    return otp === '123456';
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, resetPassword, updateUser, verifyOTP }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
