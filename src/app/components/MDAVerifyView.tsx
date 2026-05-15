import {
  Search,
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { VendorVerificationModal } from './VendorVerificationModal';
import { useToast } from './ToastProvider';
import {
  mdaReportDownloadUrl,
  useGenerateMDAVerificationReport,
  useVerifyVendor,
  verifyVendor,
} from '../api';
import { openVerificationReport } from '../utils/reportGenerator';
import type { VendorEligibilityStatus, VendorVerification } from '../api';
import { EmptyState } from './ui';
import { MDAActivityHook } from './NextBestAction';
import '../../app/styles/mda-theme.css';

interface BulkRow {
  rcNumber: string;
  companyName: string;
  status: 'eligible' | 'ineligible' | 'pending' | 'error';
  score: number;
  nhia: boolean;
  pcc: boolean;
  nsitf: boolean;
  firs: boolean;
}

const MOCK_BULK_RESULTS: Record<string, BulkRow> = {
  RC1234567: {
    rcNumber: 'RC1234567',
    companyName: 'TechVentures Nigeria Ltd',
    status: 'eligible',
    score: 92,
    nhia: true,
    pcc: true,
    nsitf: true,
    firs: true,
  },
  RC7654321: {
    rcNumber: 'RC7654321',
    companyName: 'Lagos Builders Ltd',
    status: 'ineligible',
    score: 54,
    nhia: false,
    pcc: true,
    nsitf: false,
    firs: true,
  },
  RC9876543: {
    rcNumber: 'RC9876543',
    companyName: 'Delta Contractors',
    status: 'ineligible',
    score: 38,
    nhia: false,
    pcc: false,
    nsitf: false,
    firs: false,
  },
  RC2345678: {
    rcNumber: 'RC2345678',
    companyName: 'Abuja Roads Co.',
    status: 'eligible',
    score: 88,
    nhia: true,
    pcc: true,
    nsitf: true,
    firs: true,
  },
};

export function MDAVerifyView() {
  const { showToast } = useToast();
  const verify = useVerifyVendor();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResults, setVerificationResults] = useState<VendorVerification[]>([]);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [quickVerifyQuery, setQuickVerifyQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkRow[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const handleQuickVerifyResult = useCallback((result: VendorVerification) => {
    setVerificationResults([result]);
  }, []);

  const handleSearch = async () => {
    setError(null);
    if (!searchQuery.trim()) {
      setError('Please enter an RC number to search');
      return;
    }
    const query = searchQuery.trim();
    const rcPattern = /^RC\d{7,}$/i;
    const looksLikeRc = /^RC/i.test(query);
    if (looksLikeRc && !rcPattern.test(query)) {
      setError('Please enter a valid RC number (e.g., RC1234567)');
      return;
    }
    if (!looksLikeRc && query.length < 3) {
      setError('Enter at least 3 characters for company name search');
      return;
    }
    try {
      const primary = await verify.mutate(query);
      setVerificationResults([primary]);
      showToast(
        'success',
        'Verification Complete',
        `${primary.companyName} verification result is ready`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed. Try again.';
      setError(message);
      showToast('error', 'Verification Failed', message);
    }
  };

  const handleBulkUpload = () => {
    csvInputRef.current?.click();
  };

  const handleCSVFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      showToast(
        'error',
        'Invalid File',
        'Please upload a CSV file with RC numbers in the first column.'
      );
      return;
    }
    setIsBulkProcessing(true);
    setBulkResults([]);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      const rcNumbers = lines
        .map((l) => l.split(',')[0].trim().toUpperCase())
        .filter((rc) => /^RC\d{7,}$/i.test(rc));

      if (rcNumbers.length === 0) {
        showToast(
          'error',
          'No Valid RC Numbers',
          'CSV must have RC numbers (e.g. RC1234567) in the first column.'
        );
        setIsBulkProcessing(false);
        return;
      }

      void Promise.all(
        rcNumbers.map(async (rc) => {
          try {
            const result = await verifyVendor(rc);
            return toBulkRow(result);
          } catch {
            return MOCK_BULK_RESULTS[rc] ?? {
              rcNumber: rc,
              companyName: 'Unknown Company',
              status: 'pending' as const,
              score: 0,
              nhia: false,
              pcc: false,
              nsitf: false,
              firs: false,
            };
          }
        })
      ).then((results) => {
          setBulkResults(results);
          setIsBulkProcessing(false);
          showToast('success', 'Bulk Verification Complete', `${results.length} RC numbers processed.`);
        })
        .catch(() => {
          setIsBulkProcessing(false);
          showToast('error', 'Bulk Verification Failed', 'Please check the CSV and try again.');
        });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const exportBulkResults = () => {
    if (!bulkResults.length) return;
    const header = 'RC Number,Company Name,Status,Score,NHIA,PCC,NSITF,FIRS\n';
    const rows = bulkResults
      .map(
        (r) =>
          `${r.rcNumber},${r.companyName},${r.status},${r.score},${r.nhia},${r.pcc},${r.nsitf},${r.firs}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-verification-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Export Complete', 'Bulk verification results downloaded.');
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="cp-page-title mb-2">Verify Vendors</h1>
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
                  placeholder="Enter RC number or company name"
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
                onClick={() => {
                  setQuickVerifyQuery(searchQuery.trim());
                  setIsVerificationModalOpen(true);
                }}
                className="cp-shimmer px-6 py-3 min-h-[44px] rounded-md text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--mda-primary)' }}
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
                disabled={isBulkProcessing}
                className="px-6 py-3 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" aria-hidden="true" />
                {isBulkProcessing ? 'Processing…' : 'Bulk CSV Upload'}
              </button>
            </div>
            {/* Hidden CSV file input */}
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleCSVFile}
              className="sr-only"
              aria-hidden="true"
            />
          </div>
          <p className="caption text-muted-foreground mt-3">
            Single vendor search or upload a CSV with RC numbers in column A for batch verification
          </p>
        </div>

        {/* Bulk Results Matrix */}
        {(isBulkProcessing || bulkResults.length > 0) && (
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="cp-section-title">
                Bulk Verification Results
                {isBulkProcessing && (
                  <span className="ml-2 text-muted-foreground" style={{ fontSize: '14px' }}>
                    Processing…
                  </span>
                )}
              </h2>
              {bulkResults.length > 0 && (
                <button
                  onClick={exportBulkResults}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors"
                  style={{ fontSize: '13px' }}
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Export CSV
                </button>
              )}
            </div>

            {isBulkProcessing ? (
              <div className="flex items-center gap-3 py-6 justify-center text-muted-foreground">
                <Clock className="w-5 h-5 animate-spin" />
                <span style={{ fontSize: '14px' }}>Verifying RC numbers…</span>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--mda-success)' }}>
                      {bulkResults.filter((r) => r.status === 'eligible').length}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      Eligible
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--mda-error)' }}>
                      {bulkResults.filter((r) => r.status === 'ineligible').length}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      Ineligible
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--mda-warning)' }}>
                      {bulkResults.filter((r) => r.status === 'pending').length}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      Unknown
                    </p>
                  </div>
                </div>

                {/* Table — desktop */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {[
                          'RC Number',
                          'Company',
                          'Status',
                          'Score',
                          'NHIA',
                          'PCC',
                          'NSITF',
                          'FIRS',
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left pb-2 text-muted-foreground"
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bulkResults.map((row) => {
                        const statusColor =
                          row.status === 'eligible'
                    ? 'var(--mda-success)'
                            : row.status === 'ineligible'
                              ? 'var(--mda-error)'
                              : 'var(--mda-warning)';
                        return (
                          <tr key={row.rcNumber} className="border-b border-border last:border-0">
                            <td className="py-2" style={{ fontSize: '13px' }}>
                              {row.rcNumber}
                            </td>
                            <td className="py-2" style={{ fontSize: '13px' }}>
                              {row.companyName}
                            </td>
                            <td className="py-2">
                              <span
                                className="px-2 py-0.5 rounded-full capitalize"
                                style={{
                                  fontSize: '11px',
                                  backgroundColor: `${statusColor}20`,
                                  color: statusColor,
                                  fontWeight: 500,
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td
                              className="py-2"
                              style={{ fontSize: '13px', fontWeight: 500, color: statusColor }}
                            >
                              {row.score || '—'}
                            </td>
                            {[row.nhia, row.pcc, row.nsitf, row.firs].map((v, i) => (
                              <td key={i} className="py-2">
                                {v ? (
                                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--mda-success)' }} />
                                ) : (
                                  <XCircle className="w-4 h-4" style={{ color: 'var(--mda-primary)' }} />
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {bulkResults.map((row) => {
                    const statusColor =
                      row.status === 'eligible'
                        ? 'var(--mda-success)'
                        : row.status === 'ineligible'
                          ? 'var(--mda-error)'
                          : '#F59E0B';
                    return (
                      <div key={row.rcNumber} className="border border-border rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600 }}>{row.companyName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                              {row.rcNumber}
                            </p>
                          </div>
                          <span
                            className="px-2 py-0.5 rounded-full capitalize shrink-0"
                            style={{
                              fontSize: '11px',
                              backgroundColor: `${statusColor}20`,
                              color: statusColor,
                              fontWeight: 500,
                            }}
                          >
                            {row.status}
                          </span>
                        </div>
                        <div
                          className="flex gap-3 text-muted-foreground"
                          style={{ fontSize: '12px' }}
                        >
                          <span>NHIA {row.nhia ? '✓' : '✗'}</span>
                          <span>PCC {row.pcc ? '✓' : '✗'}</span>
                          <span>NSITF {row.nsitf ? '✓' : '✗'}</span>
                          <span>FIRS {row.firs ? '✓' : '✗'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {verificationResults.length > 0 && (
          <>
            <MDAActivityHook
              sessionCount={verificationResults.length}
              readyCount={
                verificationResults.filter((r) => r.status === 'procurement-ready').length
              }
              flaggedCount={
                verificationResults.filter(
                  (r) => r.status === 'attention-required' || r.status === 'ineligible'
                ).length
              }
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <StatTile label="Total Verified" value={verificationResults.length} />
              <StatTile
                label="Procurement Ready"
                value={verificationResults.filter((r) => r.status === 'procurement-ready').length}
                color="var(--mda-success)"
              />
              <StatTile
                label="Attention Required"
                value={verificationResults.filter((r) => r.status === 'attention-required').length}
                color="var(--mda-warning)"
              />
              <StatTile
                label="Ineligible"
                value={verificationResults.filter((r) => r.status === 'ineligible').length}
                color="var(--mda-error)"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="cp-section-title">Verification Results</h2>
              <button
                className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
                onClick={() => exportVerificationResults(verificationResults, showToast)}
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Export CSV
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
          />
        )}
      </div>

      <VendorVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        initialQuery={quickVerifyQuery}
        onVerified={handleQuickVerifyResult}
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

function toBulkRow(result: VendorVerification): BulkRow {
  const hasActive = (name: string) =>
    result.certificates.some(
      (cert) => cert.name.toLowerCase().includes(name) && cert.status === 'active'
    );

  return {
    rcNumber: result.rcNumber,
    companyName: result.companyName,
    status:
      result.status === 'procurement-ready'
        ? 'eligible'
        : result.status === 'ineligible'
          ? 'ineligible'
          : 'pending',
    score: result.score,
    nhia: hasActive('nhia'),
    pcc: hasActive('pcc'),
    nsitf: hasActive('nsitf'),
    firs: hasActive('firs'),
  };
}

function exportVerificationResults(
  results: VendorVerification[],
  showToast: ReturnType<typeof useToast>['showToast']
) {
  if (!results.length) return;
  const header = 'RC Number,Company Name,Status,Score,Last Verified\n';
  const rows = results
    .map((r) => `${r.rcNumber},${r.companyName},${r.status},${r.score},${r.lastVerified}`)
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mda-verification-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('success', 'Export Complete', 'Verification results downloaded.');
}

function addToStoredPrequalification(result: VendorVerification) {
  const key = 'clearpass.mda.prequalification.pendingVendor';
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        rcNumber: result.rcNumber,
        companyName: result.companyName,
        score: result.score,
        status:
          result.status === 'procurement-ready'
            ? 'qualified'
            : result.status === 'ineligible'
              ? 'disqualified'
              : 'attention',
      })
    );
    window.dispatchEvent(
      new CustomEvent('clearpass:navigate', {
        detail: { persona: 'MDA', section: 'prequalification' },
      })
    );
  } catch {
    // ignore
  }
}

function ResultCard({ result }: { result: VendorVerification }) {
  const { showToast } = useToast();
  const generateReport = useGenerateMDAVerificationReport();
  const statusConfig = getStatusConfig(result.status);
  const StatusIcon = statusConfig.icon;

  const openReport = () => {
    try {
      localStorage.setItem('clearpass.mda.reports.prefillRc', result.rcNumber);
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent('clearpass:navigate', {
        detail: { persona: 'MDA', section: 'reports' },
      })
    );
  };

  const downloadPdf = async () => {
    try {
      let liveUrl: string | undefined;
      let reportId: string | undefined;
      try {
        const report = await generateReport.mutate({ rc_number: result.rcNumber });
        if (report.pdf_url && report.pdf_url !== '#') {
          window.open(mdaReportDownloadUrl(report.id), '_blank', 'noopener,noreferrer');
          showToast('success', 'Report Ready', `Verification report opened for ${result.companyName}`);
          return;
        }
        liveUrl = report.live_url;
        reportId = report.id;
      } catch {
        // API offline — fall through to local report generation
      }
      openVerificationReport({
        companyName: result.companyName,
        rcNumber: result.rcNumber,
        score: result.score,
        status: result.status,
        certificates: result.certificates,
        lastVerified: result.lastVerified,
        generatedBy: 'Dr. Bello Adamu',
        reportId,
        liveUrl,
      });
      showToast('success', 'Report Ready', `Verification report opened for ${result.companyName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate report';
      showToast('error', 'Report Failed', message);
    }
  };

  const addToWatchlist = () => {
    const key = 'clearpass.mda.watchlist.v1';
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]') as Array<{
        rcNumber: string;
      }>;
      if (existing.some((item) => item.rcNumber === result.rcNumber)) {
        showToast('info', 'Already Monitored', `${result.rcNumber} is already on the watchlist.`);
        return;
      }
      const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const dates = result.certificates
        .map((cert) => new Date(cert.expiryDate))
        .filter((date) => !Number.isNaN(date.getTime()));
      const nearest = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : null;
      const days = nearest
        ? Math.ceil((nearest.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
      const next = [
        {
          id: `w${Date.now()}`,
          companyName: result.companyName,
          rcNumber: result.rcNumber,
          score: result.score,
          status: result.status,
          nearestExpiry: nearest
            ? nearest.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'N/A',
          daysToExpiry: days,
          alertsEnabled: true,
          addedDate: today,
          lastVerified: today,
        },
        ...existing,
      ];
      localStorage.setItem(key, JSON.stringify(next));
      showToast('success', 'Added to Watchlist', `${result.companyName} is now monitored.`);
    } catch {
      showToast('error', 'Watchlist Failed', 'Unable to update watchlist.');
    }
  };

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
            className="cp-score-reveal tabnum"
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
                ? 'var(--mda-success)'
                : cert.status === 'expiring'
                  ? 'var(--mda-warning)'
                  : 'var(--mda-error)';
            const certBg =
              cert.status === 'active'
                ? 'var(--mda-success-light)'
                : cert.status === 'expiring'
                  ? 'var(--mda-warning-light)'
                  : 'var(--mda-error-light)';
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
        <button
          onClick={openReport}
          className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
        >
          View Full Report
        </button>
        <button
          onClick={downloadPdf}
          disabled={generateReport.isPending}
          className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
        >
          {generateReport.isPending ? 'Preparing PDF...' : 'Download PDF'}
        </button>
        <button
          onClick={() => addToStoredPrequalification(result)}
          className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
        >
          Add to Pre-Qualification List
        </button>
        <button
          onClick={addToWatchlist}
          className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
        >
          Add to Watchlist
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
    color: 'var(--mda-success)',
    bgColor: 'var(--mda-success-light)',
        label: 'Procurement Ready',
      };
    case 'attention-required':
      return {
        icon: AlertTriangle,
        color: 'var(--mda-warning)',
        bgColor: 'var(--mda-warning-light)',
        label: 'Attention Required',
      };
    case 'ineligible':
      return {
        icon: XCircle,
        color: 'var(--mda-error)',
        bgColor: 'var(--mda-error-light)',
        label: 'Ineligible to Bid',
      };
  }
}
