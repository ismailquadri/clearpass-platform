import { ComplianceScore } from './ComplianceScore';
import { CertificateCard } from './CertificateCard';
import { AlertCard } from './AlertCard';
import { Calendar, TrendingUp, Building2 } from 'lucide-react';
import { useToast } from './ToastProvider';

export function DashboardOverview() {
  const { showToast } = useToast();
  // Mock data - in a real app this would come from an API
  const certificates = [
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

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="cp-page-title mb-2">Welcome back, Amaka</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Here's your compliance status for TechBuild Nigeria Ltd.
          </p>
        </div>

        {/* Alerts */}
        <div className="mb-6 space-y-3">
          <AlertCard
            type="warning"
            title="Certificate Expiring Soon"
            message="Your NSITF certificate expires in 6 days. Renew now to maintain your Procurement Ready status."
            actionLabel="Renew Now"
            onAction={() =>
              showToast('info', 'Opening Renewal', 'Redirecting to NSITF renewal portal...')
            }
          />
          <AlertCard
            type="info"
            title="Verification Pending"
            message="Your ITF certificate is pending admin review. Expected completion within 1-2 business days."
          />
        </div>

        {/* Stats Row */}
        <section
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          aria-labelledby="stats-heading"
        >
          <div className="sr-only" id="stats-heading">
            Statistics Overview
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Active Certificates
              </span>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>5</p>
            <p className="caption text-muted-foreground">out of 6 total</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Avg. Days to Expiry
              </span>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>156</p>
            <p className="caption text-green-600">+12 from last month</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Company Status
              </span>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#FF3000' }}>
              Attention Required
            </p>
            <p className="caption text-muted-foreground">CAC Verified</p>
          </div>
        </section>

        {/* Compliance Score */}
        <section className="mb-8" aria-labelledby="compliance-score-heading">
          <h2 id="compliance-score-heading" className="sr-only">
            Compliance Score
          </h2>
          <ComplianceScore
            score={73}
            isProcurementReady={false}
            projectedScore={{
              score: 41,
              date: '15 May 2026',
              certificate: 'NSITF',
            }}
          />
        </section>

        {/* Certificates Grid */}
        <section className="mb-8" aria-labelledby="certificates-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="certificates-heading" style={{ fontSize: '20px' }}>
              My Certificates
            </h2>
            <button
              onClick={() =>
                showToast('success', 'Navigate to Certificates', 'Opening certificates view...')
              }
              className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
              aria-label="View all certificates"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert, index) => (
              <CertificateCard key={index} {...cert} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section
          className="bg-card border border-border rounded-lg p-6"
          aria-labelledby="quick-actions-heading"
        >
          <h2 id="quick-actions-heading" className="mb-4" style={{ fontSize: '18px' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() =>
                showToast('success', 'Generate Report', 'Opening report generation form...')
              }
              className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
            >
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Generate Report</p>
              <p className="caption text-muted-foreground">Download compliance PDF</p>
            </button>
            <button
              onClick={() =>
                showToast('success', 'Verify Company', 'Opening company verification form...')
              }
              className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
            >
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Verify Company</p>
              <p className="caption text-muted-foreground">Check another company's status</p>
            </button>
            <button
              onClick={() =>
                showToast('success', 'Upload Certificate', 'Opening certificate upload form...')
              }
              className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
            >
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Upload Certificate</p>
              <p className="caption text-muted-foreground">Add new certification</p>
            </button>
            <button
              onClick={() =>
                showToast('success', 'Contact Support', 'Opening support contact form...')
              }
              className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
            >
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Contact Support</p>
              <p className="caption text-muted-foreground">Get help with compliance</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
