import { FileText, Download, Calendar, Search, Plus, Eye, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePartnerClients } from '../api';
import { useToast } from './ToastProvider';
import { ApiState, EmptyState } from './ui';
import { TableSkeleton } from './ui/Skeleton';

interface PartnerReport {
  id: string;
  clientId: string;
  clientName: string;
  rcNumber: string;
  reportType: 'compliance' | 'certificate' | 'activity' | 'portfolio';
  title: string;
  generatedAt: string;
  expiryDate?: string;
  status: 'ready' | 'generating' | 'expired';
}

export function PartnerReportsView() {
  const { showToast } = useToast();
  const clientsQuery = usePartnerClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | PartnerReport['reportType']>('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [deleteReport, setDeleteReport] = useState<PartnerReport | null>(null);

  // Mock reports data - in real implementation, this would come from the backend
  const mockReports: PartnerReport[] = [
    {
      id: '1',
      clientId: '1',
      clientName: 'TechVentures Nigeria Ltd',
      rcNumber: 'RC1234567',
      reportType: 'compliance',
      title: 'Compliance Status Report',
      generatedAt: '2026-01-15T10:30:00Z',
      expiryDate: '2026-02-15T10:30:00Z',
      status: 'ready',
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'BuildWell Construction',
      rcNumber: 'RC7654321',
      reportType: 'compliance',
      title: 'Compliance Status Report',
      generatedAt: '2026-01-10T14:20:00Z',
      expiryDate: '2026-02-10T14:20:00Z',
      status: 'ready',
    },
    {
      id: '3',
      clientId: '1',
      clientName: 'TechVenturesy Nigeria Ltd',
      rcNumber: 'RC1234567',
      reportType: 'certificate',
      title: 'Certificate Verification Report',
      generatedAt: '2026-01-08T09:00:00Z',
      expiryDate: '2026-02-08T09:00:00Z',
      status: 'ready',
    },
    {
      id: '4',
      clientId: '3',
      clientName: 'GreenEnergy Solutions',
      rcNumber: 'RC9876543',
      reportType: 'activity',
      title: 'Activity Summary Report',
      generatedAt: '2026-01-05T16:45:00Z',
      status: 'ready',
    },
  ];

  const filteredReports = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mockReports.filter((report) => {
      const matchesSearch =
        !q ||
        report.title.toLowerCase().includes(q) ||
        report.clientName.toLowerCase().includes(q) ||
        report.rcNumber.toLowerCase().includes(q);
      const matchesFilter = filterType === 'all' || report.reportType === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [mockReports, searchQuery, filterType]);

  const handleDownloadReport = (report: PartnerReport) => {
    showToast('success', 'Downloading Report', `Downloading ${report.title}...`);
  };

  const handleViewReport = (report: PartnerReport) => {
    showToast('success', 'Opening Report', `Opening ${report.title}...`);
  };

  const handleDeleteReport = (report: PartnerReport) => {
    setDeleteReport(report);
  };

  const confirmDeleteReport = () => {
    if (deleteReport) {
      showToast('success', 'Report Deleted', `${deleteReport.title} has been deleted`);
      setDeleteReport(null);
    }
  };

  const handleGenerateReport = () => {
    setIsGenerateModalOpen(true);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ApiState query={clientsQuery} loading={<TableSkeleton rows={5} />}>
          {(clients) => (
            <ReportsContent
              clients={clients}
              reports={filteredReports}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              onDownloadReport={handleDownloadReport}
              onViewReport={handleViewReport}
              onDeleteReport={handleDeleteReport}
              onGenerateReport={handleGenerateReport}
            />
          )}
        </ApiState>
      </div>

      {isGenerateModalOpen && (
        <GenerateReportModal
          clients={clientsQuery.data || []}
          onClose={() => setIsGenerateModalOpen(false)}
          onGenerate={(reportConfig) => {
            showToast('success', 'Report Generated', 'Your report is being generated');
            setIsGenerateModalOpen(false);
            // Avoid unused parameter warning
            void reportConfig;
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Delete Report</h2>
                <p className="text-muted-foreground text-sm">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md mb-6">
              <p className="font-medium">{deleteReport.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {deleteReport.clientName} ({deleteReport.rcNumber})
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this report? This will permanently remove the report from your account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteReport(null)}
                className="flex-1 px-4 py-2 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteReport}
                className="flex-1 px-4 py-2 min-h-[44px] rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FF3000' }}
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ReportsContentProps {
  clients: any[];
  reports: PartnerReport[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterType: 'all' | PartnerReport['reportType'];
  setFilterType: (t: 'all' | PartnerReport['reportType']) => void;
  onDownloadReport: (report: PartnerReport) => void;
  onViewReport: (report: PartnerReport) => void;
  onDeleteReport: (report: PartnerReport) => void;
  onGenerateReport: () => void;
}

function ReportsContent({
  clients,
  reports,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onDownloadReport,
  onViewReport,
  onDeleteReport,
  onGenerateReport,
}: ReportsContentProps) {
  // Avoid unused variable warning
  void clients;

  const reportTypeLabels: Record<PartnerReport['reportType'], string> = {
    compliance: 'Compliance',
    certificate: 'Certificate',
    activity: 'Activity',
    portfolio: 'Portfolio',
  };

  return (
    <>
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h1 className="cp-page-title">Client Reports</h1>
          <button
            onClick={onGenerateReport}
            className="px-4 py-2 min-h-[44px] rounded-md text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FF3000' }}
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>Generate Report</span>
          </button>
        </div>
        <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
          Generate and manage compliance reports for your clients
        </p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Reports" value={reports.length.toString()} icon={FileText} />
        <StatCard label="Ready to Download" value={reports.filter(r => r.status === 'ready').length.toString()} icon={Download} />
        <StatCard label="Generating" value={reports.filter(r => r.status === 'generating').length.toString()} icon={Calendar} />
        <StatCard label="Clients with Reports" value={new Set(reports.map(r => r.clientId)).size.toString()} icon={FileText} />
      </div>

      {/* Search and Filter */}
      <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <label htmlFor="reports-search" className="sr-only">
              Search reports
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="reports-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, client name, or RC number..."
              className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div
            className="flex flex-wrap gap-1 p-1 bg-muted rounded-md overflow-x-auto"
            role="group"
            aria-label="Report type filters"
          >
            {(['all', 'compliance', 'certificate', 'activity', 'portfolio'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                aria-pressed={filterType === type}
                className={`px-3 sm:px-4 py-2 min-h-[40px] rounded-md transition-colors whitespace-nowrap ${
                  filterType === type ? 'bg-card shadow-sm' : 'hover:bg-card/50'
                }`}
                style={{
                  fontSize: '14px',
                  fontWeight: filterType === type ? 500 : 400,
                }}
              >
                {type === 'all' ? 'All Types' : reportTypeLabels[type]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Reports Found"
          description={
            searchQuery
              ? 'Try adjusting your search or filter.'
              : 'Generate your first report to get started.'
          }
        />
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDownload={() => onDownloadReport(report)}
              onView={() => onViewReport(report)}
              onDelete={() => onDeleteReport(report)}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface ReportCardProps {
  report: PartnerReport;
  onDownload: () => void;
  onView: () => void;
  onDelete: () => void;
}

function ReportCard({ report, onDownload, onView, onDelete }: ReportCardProps) {
  const reportTypeLabels: Record<PartnerReport['reportType'], string> = {
    compliance: 'Compliance',
    certificate: 'Certificate',
    activity: 'Activity',
    portfolio: 'Portfolio',
  };

  const getTypeColor = (type: PartnerReport['reportType']) => {
    switch (type) {
      case 'compliance':
        return '#FF3000';
      case 'certificate':
        return '#FFA500';
      case 'activity':
        return 'rgb(92, 92, 92)';
      case 'portfolio':
        return '#FF3000';
    }
  };

  // eslint-disable-next-line react-hooks/purity
  const daysAgo = Math.floor((Date.now() - new Date(report.generatedAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${getTypeColor(report.reportType)}20`,
                color: getTypeColor(report.reportType),
              }}
            >
              {reportTypeLabels[report.reportType]}
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 500 }}>{report.title}</h4>
          </div>
          <p className="caption text-muted-foreground mb-4">{report.clientName}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="caption text-muted-foreground mb-1">RC Number</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{report.rcNumber}</p>
            </div>
            <div>
              <p className="caption text-muted-foreground mb-1">Generated</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>
                {daysAgo === 0 ? 'Today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
              </p>
            </div>
            {report.expiryDate && (
              <div>
                <p className="caption text-muted-foreground mb-1">Expires</p>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>
                  {new Date(report.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 lg:ml-6">
          <button
            onClick={onView}
            className="flex-1 lg:flex-initial px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          <button
            onClick={onDownload}
            className="flex-1 lg:flex-initial px-4 py-2 min-h-[40px] rounded-md text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: '#FF3000' }}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors text-red-600"
            aria-label="Delete report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: typeof FileText;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
          {label}
        </span>
        <Icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <p style={{ fontSize: '28px', fontWeight: 600 }}>{value}</p>
    </div>
  );
}

interface GenerateReportModalProps {
  clients: any[];
  onClose: () => void;
  onGenerate: (config: any) => void;
}

function GenerateReportModal({ clients, onClose, onGenerate }: GenerateReportModalProps) {
  const [selectedClient, setSelectedClient] = useState('');
  const [reportType, setReportType] = useState<PartnerReport['reportType']>('compliance');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!selectedClient) return;
    setIsGenerating(true);
    setTimeout(() => {
      onGenerate({ clientId: selectedClient, reportType });
      setIsGenerating(false);
    }, 1500);
    // Avoid unused variable warning
    void reportType;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
              Generate Report
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="client-select" className="block mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
              Select Client
            </label>
            <select
              id="client-select"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            >
              <option value="">Choose a client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName} ({client.rcNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="report-type" className="block mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
              Report Type
            </label>
            <select
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as PartnerReport['reportType'])}
              className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            >
              <option value="compliance">Compliance Status Report</option>
              <option value="certificate">Certificate Verification Report</option>
              <option value="activity">Activity Summary Report</option>
              <option value="portfolio">Portfolio Overview Report</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="flex-1 px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!selectedClient || isGenerating}
            className="flex-1 px-4 py-2 min-h-[40px] rounded-md text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#FF3000' }}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>
    </div>
  );
}