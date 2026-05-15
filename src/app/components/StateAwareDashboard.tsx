import { ComplianceScore } from './ComplianceScore';
import { CertificateCard } from './CertificateCard';
import { AlertCard } from './AlertCard';
import { NextBestAction } from './NextBestAction';
import { NHIAEnrollmentBanner } from './NHIAEnrollmentBanner';
import { ActivityFeed } from './ActivityFeed';
import { OnboardingChecklist, useOnboardingChecklist } from './OnboardingChecklist';
import { Calendar } from 'lucide-react';
import { useDashboard } from '../api';
import { ApiState } from './ui';

interface StateAwareDashboardProps {
  onNavigate: (section: string) => void;
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function StateAwareDashboard({ onNavigate }: StateAwareDashboardProps) {
  const dashboardQuery = useDashboard('Healthy');
  const { showChecklist, dismissChecklist } = useOnboardingChecklist();
  const handleTaskClick = (route: string) => {
    onNavigate(route);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <div>
              <h1 className="cp-page-title mb-1">{getTimeGreeting()}, Amaka</h1>
              <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
                Here's your compliance overview for today
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <ApiState
          query={dashboardQuery}
          loading={<DashboardSkeleton />}
        >
          {(dashboard) => (
            <>
              {/* NHIA Enrollment Banner */}
              <NHIAEnrollmentBanner
                companyName="TechVentures Nigeria Ltd"
                rcNumber="RC1234567"
                employeeCount={84}
                sector="Technology Services"
              />

              {/* Onboarding Checklist */}
              {showChecklist && (
                <OnboardingChecklist
                  onClose={dismissChecklist}
                  onTaskClick={handleTaskClick}
                />
              )}

              {/* Compliance Score */}
              <div className="mb-6">
                <ComplianceScore
                  score={dashboard.summary.score}
                  isProcurementReady={dashboard.summary.procurementReady}
                  activeCerts={dashboard.summary.activeCertificates}
                  totalCerts={6}
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <StatCard
                  label="Active Certificates"
                  value={dashboard.summary.activeCertificates}
                  color="#FF3000"
                />
                <StatCard
                  label="Expiring Soon"
                  value={dashboard.summary.expiringCount}
                  color="#F59E0B"
                />
                <StatCard
                  label="Expired"
                  value={dashboard.summary.expiredCount}
                  color="#FF3000"
                />
                <StatCard
                  label="Pending Review"
                  value={dashboard.summary.pendingCount}
                  color="#6B7280"
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Certificates Section */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Your Certificates</h2>
                    <button
                      onClick={() => onNavigate('certificates')}
                      className="text-sm text-[#FF3000] hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dashboard.certificates.slice(0, 4).map((cert) => (
                      <CertificateCard
                        key={cert.id}
                        name={cert.name}
                        shortName={cert.shortName}
                        status={cert.status}
                        daysToExpiry={cert.daysToExpiry}
                        expiryDate={cert.expiryDate}
                        certificateNumber={cert.certificateNumber}
                        isApiVerified={cert.isApiVerified}
                      />
                    ))}
                  </div>
                </div>

                {/* Alerts Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Recent Alerts</h2>
                    <button
                      onClick={() => onNavigate('alerts')}
                      className="text-sm text-[#FF3000] hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {dashboard.recentAlerts.slice(0, 3).map((alert) => (
                      <AlertCard
                        key={alert.id}
                        type={alert.type === 'warning' ? 'warning' : 'info'}
                        title={alert.title}
                        message={alert.message}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Best Action */}
              <div className="mb-6">
                <NextBestAction 
                  state={{ label: dashboard.state }}
                  onAction={(section) => onNavigate(section)}
                />
              </div>

              {/* Activity Feed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Recent Activity</h2>
                  <button
                    onClick={() => onNavigate('activity')}
                    className="text-sm text-[#FF3000] hover:underline"
                  >
                    View All
                  </button>
                </div>
                <ActivityFeed />
              </div>
            </>
          )}
        </ApiState>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <p className="caption text-muted-foreground mb-1">{label}</p>
      <p style={{ fontSize: '28px', fontWeight: 600, color: color ?? undefined }}>{value}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="h-8 w-48 bg-muted rounded mb-2" />
          <div className="h-5 w-64 bg-muted rounded" />
        </div>
        <div className="h-48 bg-muted rounded-lg mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 h-64 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}
