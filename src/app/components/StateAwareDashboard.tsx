import { ComplianceScore } from './ComplianceScore';
import { CertificateCard } from './CertificateCard';
import { AlertCard } from './AlertCard';
import { NextBestAction } from './NextBestAction';
import { AchievementsPanel } from './AchievementsPanel';
import { Leaderboard } from './Leaderboard';
import { ActivityFeed } from './ActivityFeed';
import { useGamification } from '../contexts/GamificationContext';
import { GamificationAction } from '../utils/gamification';
import { Calendar, TrendingUp, Building2, Flame } from 'lucide-react';
import type { DashboardState } from './TweaksPanel';
import { useToast } from './ToastProvider';
import { useEffect, useRef } from 'react';

interface StateAwareDashboardProps {
  state: DashboardState;
  onNavigate: (section: string) => void;
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const STREAK_BY_STATE: Record<string, { days: number; positive: boolean }> = {
  Healthy: { days: 47, positive: true },
  'Attention Required': { days: 14, positive: true },
  Critical: { days: 3, positive: false },
  'Non-Compliant': { days: 0, positive: false },
  'New Registration': { days: 0, positive: false },
};

const SCORE_STRIP_COLOR: Record<string, string> = {
  Healthy: 'rgba(31, 193, 107, 0.08)',
  'Attention Required': 'rgba(245, 158, 11, 0.08)',
  Critical: 'rgba(255, 48, 0, 0.08)',
  'Non-Compliant': 'rgba(255, 48, 0, 0.08)',
  'New Registration': 'rgba(255, 48, 0, 0.04)',
};

const SCORE_BADGE_COLOR: Record<string, string> = {
  Healthy: '#1FC16B',
  'Attention Required': '#F59E0B',
  Critical: '#FF3000',
  'Non-Compliant': '#FF3000',
  'New Registration': '#FF3000',
};

export function StateAwareDashboard({ state, onNavigate }: StateAwareDashboardProps) {
  const { showToast } = useToast();
  const milestoneFiredRef = useRef(false);
  const { awardXP, newlyUnlocked, clearNewlyUnlocked } = useGamification();

  // Award XP for daily login
  useEffect(() => {
    const lastLogin = localStorage.getItem('clearpass_last_login');
    const today = new Date().toDateString();

    if (lastLogin !== today) {
      awardXP(GamificationAction.DAILY_LOGIN, { streak: 1 });
      localStorage.setItem('clearpass_last_login', today);
    }
  }, [awardXP]);

  // Award XP for score updates
  useEffect(() => {
    awardXP(GamificationAction.SCORE_UPDATE, { score: state.score });
  }, [state.score, awardXP]);

  // Show achievement notifications
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      // Pass to parent App component to show notification
      // For now, we'll just clear them since the notification is in App.tsx
      clearNewlyUnlocked();
    }
  }, [newlyUnlocked, clearNewlyUnlocked]);

  // Milestone celebration — fires once when score reaches 100 / Procurement Ready
  useEffect(() => {
    if (state.label === 'Healthy' && !milestoneFiredRef.current) {
      milestoneFiredRef.current = true;
      const id = setTimeout(() => {
        showToast(
          'success',
          'Procurement Ready',
          'All 6 certificates are active. You are fully eligible for federal procurement.'
        );
      }, 900);
      return () => clearTimeout(id);
    }
  }, [state.label, showToast]);

  // Determine urgency level based on state and certificate status
  const getUrgencyLevel = (certStatus: string): 'low' | 'medium' | 'high' | 'critical' => {
    if (state.label === 'Non-Compliant' && certStatus === 'not-connected') return 'critical';
    if (state.label === 'Non-Compliant' && certStatus === 'expired') return 'critical';
    if (
      state.label === 'Critical' &&
      (certStatus === 'expired' || certStatus === 'expiring-urgent')
    )
      return 'critical';
    if (state.label === 'Attention Required' && certStatus === 'expiring-urgent') return 'high';
    if (state.label === 'New Registration' && certStatus === 'not-connected') return 'medium';
    if (certStatus === 'not-connected') return 'medium';
    return 'low';
  };

  // Generate certificate data based on state
  const getCertificatesForState = () => {
    switch (state.label) {
      case 'Healthy':
        return [
          {
            name: 'National Health Insurance Authority Certificate',
            shortName: 'NHIA',
            status: 'active' as const,
            daysToExpiry: 245,
            expiryDate: '15 Jan 2027',
            certificateNumber: 'NHIA/2026/FCT/AB12345678',
            isApiVerified: true,
          },
          {
            name: 'Pension Clearance Certificate',
            shortName: 'PCC',
            status: 'active' as const,
            daysToExpiry: 198,
            expiryDate: '23 Nov 2026',
            certificateNumber: 'PCC/2025/LAG/CD98765432',
            isApiVerified: true,
          },
          {
            name: 'Nigeria Social Insurance Trust Fund',
            shortName: 'NSITF',
            status: 'active' as const,
            daysToExpiry: 156,
            expiryDate: '12 Oct 2026',
            certificateNumber: 'NSITF/2025/EF45612378',
            isApiVerified: true,
          },
          {
            name: 'Federal Inland Revenue Service Tax Clearance',
            shortName: 'FIRS TCC',
            status: 'active' as const,
            daysToExpiry: 189,
            expiryDate: '14 Nov 2026',
            certificateNumber: 'TCC/2026/LAG/GH78945612',
            isApiVerified: true,
          },
          {
            name: 'Bureau of Public Procurement Certificate',
            shortName: 'BPP',
            status: 'active' as const,
            daysToExpiry: 312,
            expiryDate: '16 Mar 2027',
            certificateNumber: 'BPP/2026/IJ12378945',
            isApiVerified: true,
          },
          {
            name: 'Industrial Training Fund Certificate',
            shortName: 'ITF',
            status: 'active' as const,
            daysToExpiry: 223,
            expiryDate: '18 Dec 2026',
            certificateNumber: 'ITF/2026/KL96325874',
            isApiVerified: true,
          },
        ];

      case 'Attention Required':
        return [
          {
            name: 'National Health Insurance Authority Certificate',
            shortName: 'NHIA',
            status: 'active' as const,
            daysToExpiry: 245,
            expiryDate: '15 Jan 2027',
            certificateNumber: 'NHIA/2026/FCT/AB12345678',
            isApiVerified: true,
          },
          {
            name: 'Pension Clearance Certificate',
            shortName: 'PCC',
            status: 'expiring-soon' as const,
            daysToExpiry: 28,
            expiryDate: '05 Jun 2026',
            certificateNumber: 'PCC/2025/LAG/CD98765432',
            isApiVerified: true,
          },
          {
            name: 'Nigeria Social Insurance Trust Fund',
            shortName: 'NSITF',
            status: 'expiring-urgent' as const,
            daysToExpiry: 6,
            expiryDate: '15 May 2026',
            certificateNumber: 'NSITF/2025/EF45612378',
            isApiVerified: false,
          },
          {
            name: 'Federal Inland Revenue Service Tax Clearance',
            shortName: 'FIRS TCC',
            status: 'active' as const,
            daysToExpiry: 189,
            expiryDate: '14 Nov 2026',
            certificateNumber: 'TCC/2026/LAG/GH78945612',
            isApiVerified: true,
          },
          {
            name: 'Bureau of Public Procurement Certificate',
            shortName: 'BPP',
            status: 'active' as const,
            daysToExpiry: 312,
            expiryDate: '16 Mar 2027',
            certificateNumber: 'BPP/2026/IJ12378945',
            isApiVerified: true,
          },
          {
            name: 'Industrial Training Fund Certificate',
            shortName: 'ITF',
            status: 'pending' as const,
            expiryDate: 'Pending',
            certificateNumber: 'ITF/2026/KL96325874',
            isApiVerified: false,
          },
        ];

      case 'Critical':
        return [
          {
            name: 'National Health Insurance Authority Certificate',
            shortName: 'NHIA',
            status: 'expiring-critical' as const,
            daysToExpiry: 12,
            expiryDate: '21 May 2026',
            certificateNumber: 'NHIA/2026/FCT/AB12345678',
            isApiVerified: true,
          },
          {
            name: 'Pension Clearance Certificate',
            shortName: 'PCC',
            status: 'expired' as const,
            expiryDate: '15 Apr 2026',
            certificateNumber: 'PCC/2025/LAG/CD98765432',
            isApiVerified: true,
          },
          {
            name: 'Nigeria Social Insurance Trust Fund',
            shortName: 'NSITF',
            status: 'expiring-urgent' as const,
            daysToExpiry: 4,
            expiryDate: '13 May 2026',
            certificateNumber: 'NSITF/2025/EF45612378',
            isApiVerified: false,
          },
          {
            name: 'Federal Inland Revenue Service Tax Clearance',
            shortName: 'FIRS TCC',
            status: 'active' as const,
            daysToExpiry: 89,
            expiryDate: '06 Aug 2026',
            certificateNumber: 'TCC/2026/LAG/GH78945612',
            isApiVerified: true,
          },
          {
            name: 'Bureau of Public Procurement Certificate',
            shortName: 'BPP',
            status: 'active' as const,
            daysToExpiry: 212,
            expiryDate: '06 Dec 2026',
            certificateNumber: 'BPP/2026/IJ12378945',
            isApiVerified: true,
          },
          {
            name: 'Industrial Training Fund Certificate',
            shortName: 'ITF',
            status: 'renewal-in-progress' as const,
            expiryDate: 'Renewing',
            certificateNumber: 'ITF/2026/KL96325874',
            isApiVerified: false,
          },
        ];

      case 'Non-Compliant':
        return [
          {
            name: 'National Health Insurance Authority Certificate',
            shortName: 'NHIA',
            status: 'expired' as const,
            expiryDate: '15 Mar 2026',
            certificateNumber: 'NHIA/2025/FCT/AB12345678',
            isApiVerified: true,
          },
          {
            name: 'Pension Clearance Certificate',
            shortName: 'PCC',
            status: 'expired' as const,
            expiryDate: '15 Apr 2026',
            certificateNumber: 'PCC/2025/LAG/CD98765432',
            isApiVerified: true,
          },
          {
            name: 'Nigeria Social Insurance Trust Fund',
            shortName: 'NSITF',
            status: 'expiring-urgent' as const,
            daysToExpiry: 3,
            expiryDate: '12 May 2026',
            certificateNumber: 'NSITF/2025/EF45612378',
            isApiVerified: false,
          },
          {
            name: 'Federal Inland Revenue Service Tax Clearance',
            shortName: 'FIRS TCC',
            status: 'expiring-soon' as const,
            daysToExpiry: 25,
            expiryDate: '03 Jun 2026',
            certificateNumber: 'TCC/2026/LAG/GH78945612',
            isApiVerified: true,
          },
          {
            name: 'Bureau of Public Procurement Certificate',
            shortName: 'BPP',
            status: 'active' as const,
            daysToExpiry: 156,
            expiryDate: '12 Oct 2026',
            certificateNumber: 'BPP/2026/IJ12378945',
            isApiVerified: true,
          },
          {
            name: 'Industrial Training Fund Certificate',
            shortName: 'ITF',
            status: 'not-connected' as const,
          },
        ];

      case 'New Registration':
        return [
          {
            name: 'National Health Insurance Authority Certificate',
            shortName: 'NHIA',
            status: 'not-connected' as const,
          },
          {
            name: 'Pension Clearance Certificate',
            shortName: 'PCC',
            status: 'not-connected' as const,
          },
          {
            name: 'Nigeria Social Insurance Trust Fund',
            shortName: 'NSITF',
            status: 'not-connected' as const,
          },
          {
            name: 'Federal Inland Revenue Service Tax Clearance',
            shortName: 'FIRS TCC',
            status: 'not-connected' as const,
          },
          {
            name: 'Bureau of Public Procurement Certificate',
            shortName: 'BPP',
            status: 'not-connected' as const,
          },
          {
            name: 'Industrial Training Fund Certificate',
            shortName: 'ITF',
            status: 'not-connected' as const,
          },
        ];

      case 'Pending Verification':
        return [
          {
            name: 'National Health Insurance Authority Certificate',
            shortName: 'NHIA',
            status: 'pending' as const,
            expiryDate: 'Pending',
            certificateNumber: 'NHIA/2026/FCT/AB12345678',
            isApiVerified: false,
          },
          {
            name: 'Pension Clearance Certificate',
            shortName: 'PCC',
            status: 'active' as const,
            daysToExpiry: 156,
            expiryDate: '12 Oct 2026',
            certificateNumber: 'PCC/2025/LAG/CD98765432',
            isApiVerified: true,
          },
          {
            name: 'Nigeria Social Insurance Trust Fund',
            shortName: 'NSITF',
            status: 'pending' as const,
            expiryDate: 'Pending',
            certificateNumber: 'NSITF/2025/EF45612378',
            isApiVerified: false,
          },
          {
            name: 'Federal Inland Revenue Service Tax Clearance',
            shortName: 'FIRS TCC',
            status: 'active' as const,
            daysToExpiry: 189,
            expiryDate: '14 Nov 2026',
            certificateNumber: 'TCC/2026/LAG/GH78945612',
            isApiVerified: true,
          },
          {
            name: 'Bureau of Public Procurement Certificate',
            shortName: 'BPP',
            status: 'pending' as const,
            expiryDate: 'Pending',
            certificateNumber: 'BPP/2026/IJ12378945',
            isApiVerified: false,
          },
          {
            name: 'Industrial Training Fund Certificate',
            shortName: 'ITF',
            status: 'active' as const,
            daysToExpiry: 223,
            expiryDate: '18 Dec 2026',
            certificateNumber: 'ITF/2026/KL96325874',
            isApiVerified: true,
          },
        ];

      default:
        return [];
    }
  };

  const certificates = getCertificatesForState();
  const activeCerts = certificates.filter((c) => c.status === 'active').length;
  const isProcurementReady = state.score >= 80;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* State Indicator Strip */}
        <div
          className="mb-4 px-3 py-2 rounded-lg border border-[#e5e5e5] flex items-center justify-between"
          style={{ backgroundColor: SCORE_STRIP_COLOR[state.label] ?? 'rgba(255,48,0,0.04)' }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>
              Status: {state.label}
            </span>
            <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
              {state.description}
            </p>
          </div>
          <span
            className="px-2.5 py-0.5 rounded-full"
            style={{
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: SCORE_BADGE_COLOR[state.label] ?? '#FF3000',
              color: 'white',
            }}
          >
            {state.score}/100
          </span>
        </div>

        {/* Header */}
        <div className="mb-5">
          <h1 className="mb-1" style={{ fontSize: '24px', fontWeight: '500' }}>
            {getTimeGreeting()}, Amaka
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
            Here's your compliance status for TechBuild Nigeria Ltd.
          </p>
        </div>

        {/* Next Best Action */}
        <NextBestAction state={state} onAction={onNavigate} />

        {/* Conditional Alerts */}
        {state.label === 'Attention Required' && (
          <div className="mb-4 space-y-2">
            <AlertCard
              type="warning"
              title="Certificate Expiring Soon"
              message="Your NSITF certificate expires in 6 days. Renew now to maintain your Procurement Ready status."
              actionLabel="Renew Now"
              onAction={() => {
                showToast('info', 'Opening Renewal', 'Redirecting to NSITF renewal portal...');
                onNavigate('certificates');
              }}
            />
            <AlertCard
              type="info"
              title="Verification Pending"
              message="Your ITF certificate is pending admin review. Expected completion within 1-2 business days."
            />
          </div>
        )}

        {state.label === 'Critical' && (
          <div className="mb-4 space-y-2">
            <AlertCard
              type="warning"
              title="Multiple Certificates Expiring"
              message="3 certificates require immediate attention. Your PCC has expired and NHIA expires in 12 days."
              actionLabel="Take Action"
              onAction={() => {
                showToast('info', 'Taking Action', 'Opening certificate management...');
                onNavigate('certificates');
              }}
            />
          </div>
        )}

        {state.label === 'Non-Compliant' && (
          <div className="mb-4 space-y-2">
            <AlertCard
              type="warning"
              title="NHIA Certificate Expired - Ineligible to Bid"
              message="Your NHIA certificate has expired. You cannot participate in federal procurement until this is renewed."
              actionLabel="Renew NHIA Now"
              onAction={() => {
                showToast('info', 'Opening Renewal', 'Redirecting to NHIA renewal portal...');
                onNavigate('certificates');
              }}
            />
          </div>
        )}

        {state.label === 'New Registration' && (
          <div className="mb-4 space-y-2">
            <AlertCard
              type="info"
              title="Welcome to ClearPass!"
              message="Get started by connecting your compliance certificates. We'll guide you through the process."
              actionLabel="Start Setup"
              onAction={() => {
                showToast('success', 'Getting Started', 'Opening certificate setup wizard...');
                onNavigate('certificates');
              }}
            />
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-[#404040]" style={{ fontSize: '12px' }}>
                Active Certificates
              </span>
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-green-600" />
              </div>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '600' }}>{activeCerts}</p>
            <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
              out of 6 total
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-[#404040]" style={{ fontSize: '12px' }}>
                Compliance Score
              </span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    state.score >= 80
                      ? 'rgb(31, 193, 107, 0.2)'
                      : state.score >= 60
                        ? 'rgba(255, 48, 0, 0.2)'
                        : 'rgb(251, 55, 72, 0.2)',
                }}
              >
                <TrendingUp
                  className="w-3.5 h-3.5"
                  style={{
                    color:
                      state.score >= 80 ? '#FF3000' : state.score >= 60 ? '#FF3000' : '#FF3000',
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '600' }}>{state.score}</p>
            <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
              out of 100
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                Company Status
              </span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isProcurementReady
                    ? 'rgba(31, 193, 107, 0.15)'
                    : 'rgba(255, 48, 0, 0.12)',
                }}
              >
                <Building2
                  className="w-3.5 h-3.5"
                  style={{
                    color: isProcurementReady ? '#1FC16B' : '#FF3000',
                  }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: '15px',
                fontWeight: '600',
                color: isProcurementReady ? '#1FC16B' : '#FF3000',
              }}
            >
              {isProcurementReady ? 'Procurement Ready' : state.label}
            </p>
            <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
              CAC Verified
            </p>
          </div>

          {/* Compliance Streak stat */}
          {(() => {
            const streak = STREAK_BY_STATE[state.label] ?? { days: 0, positive: false };
            return (
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-[#404040]" style={{ fontSize: '12px' }}>
                    {streak.positive ? 'Compliance Streak' : 'Days Since Issue'}
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: streak.positive
                        ? 'rgba(31,193,107,0.15)'
                        : 'rgba(255,48,0,0.12)',
                    }}
                  >
                    <Flame
                      className="w-3.5 h-3.5"
                      style={{ color: streak.positive ? '#1FC16B' : '#FF3000' }}
                    />
                  </div>
                </div>
                <p style={{ fontSize: '24px', fontWeight: '600' }}>{streak.days}</p>
                <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
                  {streak.days === 1 ? 'day' : 'days'}
                </p>
              </div>
            );
          })()}
        </div>

        {/* Compliance Score */}
        <div className="mb-5">
          <ComplianceScore
            score={state.score}
            isProcurementReady={isProcurementReady}
            activeCerts={activeCerts}
            totalCerts={6}
            projectedScore={
              state.label === 'Attention Required'
                ? {
                    score: 41,
                    date: '15 May 2026',
                    certificate: 'NSITF',
                  }
                : undefined
            }
          />
        </div>

        {/* Certificates Grid */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: '16px', fontWeight: '500' }}>My Certificates</h2>
            <button
              onClick={() => onNavigate('certificates')}
              className="px-3 py-1.5 rounded-md border border-border hover:bg-[#fafafa] transition-all duration-200 ease-in-out text-sm"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {certificates.map((cert, index) => (
              <CertificateCard
                key={index}
                {...cert}
                dashboardState={state.label}
                urgencyLevel={getUrgencyLevel(cert.status)}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="mb-3" style={{ fontSize: '15px', fontWeight: '500' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              onClick={() => onNavigate('reports')}
              className="px-3 py-2 rounded-md border border-border hover:bg-[#fafafa] hover:border-[#e5e5e5] transition-all duration-200 ease-in-out text-left"
            >
              <p style={{ fontSize: '13px', fontWeight: '500' }}>Generate Report</p>
              <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
                Download compliance PDF
              </p>
            </button>
            <button
              onClick={() => onNavigate('verify')}
              className="px-3 py-2 rounded-md border border-border hover:bg-[#fafafa] hover:border-[#e5e5e5] transition-all duration-200 ease-in-out text-left"
            >
              <p style={{ fontSize: '13px', fontWeight: '500' }}>Verify Company</p>
              <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
                Check another company's status
              </p>
            </button>
            <button
              onClick={() => onNavigate('certificates')}
              className="px-3 py-2 rounded-md border border-border hover:bg-[#fafafa] hover:border-[#e5e5e5] transition-all duration-200 ease-in-out text-left"
            >
              <p style={{ fontSize: '13px', fontWeight: '500' }}>Upload Certificate</p>
              <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
                Add new certification
              </p>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="px-3 py-2 rounded-md border border-border hover:bg-[#fafafa] hover:border-[#e5e5e5] transition-all duration-200 ease-in-out text-left"
            >
              <p style={{ fontSize: '13px', fontWeight: '500' }}>Contact Support</p>
              <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
                Get help with compliance
              </p>
            </button>
          </div>
        </div>

        {/* Achievements Panel */}
        <div className="mt-5">
          <AchievementsPanel />
        </div>

        {/* Social Mechanics - Leaderboard and Activity Feed */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Leaderboard />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
