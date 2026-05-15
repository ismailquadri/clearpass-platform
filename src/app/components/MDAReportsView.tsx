import {
  FileText,
  Download,
  Calendar,
  Search,
  Plus,
  Eye,
  Shield,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastProvider';
import { EmptyState } from './ui';
import {
  mdaReportDownloadUrl,
  useGenerateMDAVerificationReport,
  useMDAVerificationReports,
  type MDAVerificationReport,
} from '../api';
import '../../app/styles/mda-theme.css';
import { openVerificationReport } from '../utils/reportGenerator';

function riskFromScore(score: number): { level: 'low' | 'medium' | 'high'; cls: string } {
  if (score >= 80) return { level: 'low', cls: 'text-green-600 bg-green-50' };
  if (score >= 50) return { level: 'medium', cls: 'text-yellow-600 bg-yellow-50' };
  return { level: 'high', cls: 'text-red-600 bg-red-50' };
}

function riskIcon(level: 'low' | 'medium' | 'high') {
  return level === 'high' ? AlertTriangle : Shield;
}

export function MDAReportsView() {
  const { showToast } = useToast();
  const reports = useMDAVerificationReports();
  const generate = useGenerateMDAVerificationReport();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'verification'>('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [rcToGenerate, setRcToGenerate] = useState('');
  const [viewReportId, setViewReportId] = useState<string | null>(null);

  // Support in-app navigation from Watchlist "view report" action.
  useEffect(() => {
    try {
      const rc = localStorage.getItem('clearpass.mda.reports.prefillRc');
      if (rc) {
        localStorage.removeItem('clearpass.mda.reports.prefillRc');
        queueMicrotask(() => {
          setRcToGenerate(rc);
          setIsGenerateModalOpen(true);
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const filteredReports = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const list = reports.data ?? [];
    return list.filter((r) => {
      const matchesSearch =
        !q ||
        r.company_name.toLowerCase().includes(q) ||
        r.rc_number.toLowerCase().includes(q) ||
        r.generated_by.toLowerCase().includes(q);
      const matchesFilter = filterType === 'all' || r.report_type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [reports.data, searchQuery, filterType]);

  const selected = (reports.data ?? []).find((r) => r.id === viewReportId) ?? null;

  const handleDownload = (report: MDAVerificationReport) => {
    if (report.pdf_url && report.pdf_url !== '#') {
      window.open(mdaReportDownloadUrl(report.id), '_blank', 'noopener,noreferrer');
      showToast('success', 'Report Ready', 'Verification report opened.');
      return;
    }
    openVerificationReport({
      companyName: report.company_name,
      rcNumber: report.rc_number,
      score: report.score ?? 0,
      status: report.status ?? 'ineligible',
      certificates: [],
      lastVerified: new Date(report.generated_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      generatedBy: report.generated_by,
      reportId: report.id,
      liveUrl: report.live_url,
    });
    showToast('success', 'Report Ready', 'Verification report opened.');
  };

  const submitGenerate = async () => {
    const rc = rcToGenerate.trim().toUpperCase();
    const pattern = /^RC\d{7,}$/i;
    if (!pattern.test(rc)) {
      showToast('error', 'Invalid RC Number', 'Please enter a valid RC number (e.g. RC1234567)');
      return;
    }
    try {
      const created = await generate.mutate({ rc_number: rc });
      showToast(
        'success',
        'Report Generated',
        `Verification report ready for ${created.rc_number}`
      );
      setIsGenerateModalOpen(false);
      setRcToGenerate('');
      await reports.refetch?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate report';
      showToast('error', 'Generation Failed', msg);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="cp-page-title">Verification Reports</h1>
            <p className="text-muted-foreground mt-1">
              View and manage vendor verification reports
            </p>
          </div>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--mda-primary)] text-white rounded-md hover:opacity-90 transition-opacity self-start"
          >
            <Plus className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by vendor, RC number, or generated by…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mda-primary)] focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mda-primary)] focus:border-transparent bg-background"
          >
            <option value="all">All Report Types</option>
            <option value="verification">Verification</option>
          </select>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {reports.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading reports…</div>
          ) : reports.error ? (
            <EmptyState
              icon={FileText}
              title="Unable to Load Reports"
              description="Please try again."
            />
          ) : filteredReports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Reports Found"
              description={
                searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No verification reports have been generated yet'
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Report</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Vendor</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">RC Number</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Risk Level</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Generated</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Generated By</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReports.map((report) => {
                    const score = report.score ?? 0;
                    const risk = riskFromScore(score);
                    const Icon = riskIcon(risk.level);
                    return (
                      <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium">Vendor Compliance Verification</div>
                          <div className="text-sm text-muted-foreground">ID: {report.id}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div>{report.company_name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {report.rc_number}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${risk.cls}`}
                          >
                            <Icon className="w-3 h-3" />
                            {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {new Date(report.generated_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">{report.generated_by}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewReportId(report.id)}
                              className="p-2 hover:bg-muted rounded-md transition-colors"
                              title="View Report"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(report)}
                              className="p-2 hover:bg-muted rounded-md transition-colors"
                              title="Download Report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="cp-section-title">Generate Verification Report</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Creates a PDF with a QR code to a live verification URL.
                  </p>
                </div>
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">RC Number</label>
                <input
                  value={rcToGenerate}
                  onChange={(e) => setRcToGenerate(e.target.value)}
                  placeholder="RC1234567"
                  className="w-full px-4 py-2 border border-border rounded-md bg-input-background"
                />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={submitGenerate}
                    disabled={generate.isPending}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--mda-primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    <Plus className="w-4 h-4" />
                    {generate.isPending ? 'Generating…' : 'Generate'}
                  </button>
                  <button
                    onClick={() => setIsGenerateModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="cp-section-title">Vendor Compliance Verification</h2>
                  <p className="text-muted-foreground mt-1">Report ID: {selected.id}</p>
                </div>
                <button
                  onClick={() => setViewReportId(null)}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vendor Name</label>
                    <p className="mt-1">{selected.company_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">RC Number</label>
                    <p className="mt-1">
                      <code className="bg-muted px-2 py-1 rounded">{selected.rc_number}</code>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Generated By
                    </label>
                    <p className="mt-1">{selected.generated_by}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Generated Date
                    </label>
                    <p className="mt-1">{new Date(selected.generated_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <h3 className="font-medium mb-2">Live Verification URL (QR resolves here)</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs font-mono break-all">{selected.live_url}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleDownload(selected)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--mda-primary)] text-white rounded-md hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setViewReportId(null)}
                    className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
