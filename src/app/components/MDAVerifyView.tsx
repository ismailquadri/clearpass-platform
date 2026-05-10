import { Search, Upload, Download, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { VendorVerificationModal } from './VendorVerificationModal';
import { useToast } from './ToastProvider';
import { useVerifyVendor, verifyVendor } from '../api';
import type { VendorEligibilityStatus, VendorVerification } from '../api';
import { EmptyState } from './ui';

export function MDAVerifyView() {
  const { showToast } = useToast();
  const verify = useVerifyVendor();
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResults, setVerificationResults] = useState<VendorVerification[]>([]);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    if (!searchQuery.trim()) {
      setError('Please enter an RC number to search');
      return;
    }
    const rcPattern = /^RC\d{7,}$/i;
    if (!rcPattern.test(searchQuery.trim())) {
      setError('Please enter a valid RC number (e.g., RC1234567)');
      return;
    }
    try {
      // For the demo we fan out to a few RC numbers to populate results;
      // wire this to a single-vendor or list endpoint as needed.
      const primary = await verify.mutate(searchQuery.trim());
      const additional = await Promise.all([
        verifyVendor('RC7654321').catch(() => null),
        verifyVendor('RC9876543').catch(() => null),
      ]);
      const results = [primary, ...additional.filter((v): v is VendorVerification => !!v)]
        // De-duplicate by RC number.
        .reduce<VendorVerification[]>((acc, v) => {
          if (!acc.some((x) => x.rcNumber === v.rcNumber)) acc.push(v);
          return acc;
        }, []);
      setVerificationResults(results);
      showToast(
        'success',
        'Search Complete',
        `Found ${results.length} verification result${results.length === 1 ? '' : 's'}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed. Try again.';
      setError(message);
      showToast('error', 'Verification Failed', message);
    }
  };

  const handleBulkUpload = () => {
    showToast(
      'info',
      'Bulk Upload',
      'Bulk upload feature coming soon. Contact support for assistance.'
    );
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>
            Verify Vendors
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Real-time compliance verification for procurement pre-qualification
          </p>
        </header>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="mda-search-input"
                className="block mb-2"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                RC Number or Company Name
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="mda-search-input"
                  type="search"
                  inputMode="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !verify.isPending) handleSearch();
                  }}
                  placeholder="Enter RC number (e.g., RC1234567)"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'mda-search-error' : undefined}
                  className={`w-full pl-10 pr-4 py-3 min-h-[48px] bg-input-background border rounded-md ${
                    error ? 'border-red-500' : 'border-border'
                  }`}
                  style={{ fontSize: '16px' }}
                />
              </div>
              {error && (
                <p
                  id="mda-search-error"
                  className="text-red-500 mt-2 flex items-center gap-2"
                  style={{ fontSize: '14px' }}
                  role="alert"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-6 py-3 min-h-[44px] rounded-md text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FF3000' }}
              >
                <Search className="w-5 h-5" aria-hidden="true" />
                Quick Verify
              </button>
              <button
                onClick={handleSearch}
                disabled={verify.isPending}
                aria-live="polite"
                aria-busy={verify.isPending}
                className="px-6 py-3 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verify.isPending ? 'Searching...' : 'Search List'}
              </button>
              <button
                onClick={handleBulkUpload}
                className="px-6 py-3 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" aria-hidden="true" />
                Bulk Upload
              </button>
            </div>
          </div>
          <p className="caption text-muted-foreground mt-3">
            Search for single vendor or upload CSV file with multiple RC numbers for batch
            verification
          </p>
        </div>

        {verificationResults.length > 0 && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <StatTile label="Total Verified" value={verificationResults.length} />
              <StatTile
                label="Procurement Ready"
                value={verificationResults.filter((r) => r.status === 'procurement-ready').length}
                color="#FF3000"
              />
              <StatTile
                label="Attention Required"
                value={verificationResults.filter((r) => r.status === 'attention-required').length}
                color="#FF3000"
              />
              <StatTile
                label="Ineligible"
                value={verificationResults.filter((r) => r.status === 'ineligible').length}
                color="#FF3000"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 style={{ fontSize: '20px' }}>Verification Results</h2>
              <button
                className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
                onClick={() =>
                  showToast('success', 'Export Started', 'Generating verification report PDF...')
                }
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Export Report
              </button>
            </div>

            <div className="space-y-4">
              {verificationResults.map((result) => (
                <ResultCard key={result.rcNumber} result={result} />
              ))}
            </div>
          </>
        )}

        {verificationResults.length === 0 && !verify.isPending && (
          <EmptyState
            icon={Search}
            title="No Verification Results"
            description="Enter an RC number or company name to verify vendor compliance status."
          >
            <div className="mt-4 text-left max-w-xs mx-auto bg-muted rounded-md p-3">
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Try searching:</p>
              <p className="caption text-muted-foreground">RC1234567</p>
              <p className="caption text-muted-foreground">RC7654321</p>
              <p className="caption text-muted-foreground">RC9876543</p>
            </div>
          </EmptyState>
        )}
      </div>

      <VendorVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
}

function StatTile({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="caption text-muted-foreground mb-1">{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 600, color: color ?? undefined }}>{value}</p>
    </div>
  );
}

function ResultCard({ result }: { result: VendorVerification }) {
  const statusConfig = getStatusConfig(result.status);
  const StatusIcon = statusConfig.icon;
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h4 style={{ fontSize: '18px', fontWeight: 500 }}>{result.companyName}</h4>
            <span
              className="px-3 py-1 rounded-full flex items-center gap-2"
              style={{
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              <StatusIcon className="w-4 h-4" aria-hidden="true" />
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-muted-foreground flex-wrap">
            <span style={{ fontSize: '14px' }}>RC: {result.rcNumber}</span>
            <span className="caption">•</span>
            <span className="caption">Last verified: {result.lastVerified}</span>
          </div>
        </div>
        <div className="lg:text-right">
          <p className="caption text-muted-foreground mb-1">Compliance Score</p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: statusConfig.color,
            }}
          >
            {result.score}
            <span style={{ fontSize: '15px', fontWeight: 400 }}>/100</span>
          </p>
        </div>
      </div>

      {result.certificates.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 pt-4 border-t border-border">
          {result.certificates.map((cert, idx) => {
            const certColor =
              cert.status === 'active'
                ? '#FF3000'
                : cert.status === 'expiring'
                  ? '#FF3000'
                  : '#FF3000';
            const certBg =
              cert.status === 'active'
                ? 'rgba(255, 48, 0, 0.1)'
                : cert.status === 'expiring'
                  ? 'rgba(255, 48, 0, 0.1)'
                  : 'rgba(255, 48, 0, 0.1)';
            return (
              <div key={idx} className="px-3 py-2 rounded-md" style={{ backgroundColor: certBg }}>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: certColor,
                  }}
                >
                  {cert.name}
                </p>
                <p className="caption text-muted-foreground mt-1">{cert.expiryDate}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <button className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors">
          View Full Report
        </button>
        <button className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors">
          Download PDF
        </button>
        <button className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors">
          Add to Pre-Qualification List
        </button>
      </div>
    </div>
  );
}

function getStatusConfig(status: VendorEligibilityStatus) {
  switch (status) {
    case 'procurement-ready':
      return {
        icon: CheckCircle2,
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
        label: 'Procurement Ready',
      };
    case 'attention-required':
      return {
        icon: AlertTriangle,
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
        label: 'Attention Required',
      };
    case 'ineligible':
      return {
        icon: XCircle,
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
        label: 'Ineligible to Bid',
      };
  }
}
