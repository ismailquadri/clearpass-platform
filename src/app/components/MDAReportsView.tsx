import { FileText, Download, Calendar, Search, Plus, Eye, Trash2, Shield, AlertTriangle, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useToast } from './ToastProvider';
import { EmptyState } from './ui';

interface MDAReport {
  id: string;
  vendorName: string;
  rcNumber: string;
  reportType: 'verification' | 'prequalification' | 'audit' | 'compliance';
  title: string;
  generatedAt: string;
  generatedBy: string;
  status: 'ready' | 'generating' | 'expired';
  riskLevel: 'low' | 'medium' | 'high';
}

export function MDAReportsView() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | MDAReport['reportType']>('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [viewReport, setViewReport] = useState<MDAReport | null>(null);
  const [deleteReport, setDeleteReport] = useState<MDAReport | null>(null);

  // Mock reports data - in real implementation, this would come from the backend
  const mockReports: MDAReport[] = [
    {
      id: '1',
      vendorName: 'TechVentures Nigeria Ltd',
      rcNumber: 'RC1234567',
      reportType: 'verification',
      title: 'Vendor Compliance Verification',
      generatedAt: '2026-01-15T10:30:00Z',
      generatedBy: 'Engr. Bello',
      status: 'ready',
      riskLevel: 'low',
    },
    {
      id: '2',
      vendorName: 'BuildWell Construction',
      rcNumber: 'RC7654321',
      reportType: 'prequalification',
      title: 'Pre-Qualification Assessment',
      generatedAt: '2026-01-10T14:20:00Z',
      generatedBy: 'Engr. Bello',
      status: 'ready',
      riskLevel: 'medium',
    },
    {
      id: '3',
      vendorName: 'GreenEnergy Solutions',
      rcNumber: 'RC9876543',
      reportType: 'verification',
      title: 'Vendor Compliance Verification',
      generatedAt: '2026-01-08T09:00:00Z',
      generatedBy: 'Procurement Team',
      status: 'ready',
      riskLevel: 'low',
    },
    {
      id: '4',
      vendorName: 'Nigeria Logistics Co',
      rcNumber: 'RC4567890',
      reportType: 'audit',
      title: 'Compliance Audit Report',
      generatedAt: '2026-01-05T16:45:00Z',
      generatedBy: 'Internal Audit',
      status: 'ready',
      riskLevel: 'high',
    },
    {
      id: '5',
      vendorName: 'SecureTech Services',
      rcNumber: 'RC3456789',
      reportType: 'compliance',
      title: 'Annual Compliance Summary',
      generatedAt: '2026-01-03T11:30:00Z',
      generatedBy: 'Compliance Officer',
      status: 'ready',
      riskLevel: 'low',
    },
  ];

  const filteredReports = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mockReports.filter((report) => {
      const matchesSearch =
        !q ||
        report.title.toLowerCase().includes(q) ||
        report.vendorName.toLowerCase().includes(q) ||
        report.rcNumber.toLowerCase().includes(q);
      const matchesFilter = filterType === 'all' || report.reportType === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [mockReports, searchQuery, filterType]);

  const handleDownloadReport = (report: MDAReport) => {
    showToast('success', 'Downloading Report', `Downloading ${report.title}...`);
  };

  const handleViewReport = (report: MDAReport) => {
    setViewReport(report);
  };

  const handleDeleteReport = (report: MDAReport) => {
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

  const getReportTypeLabel = (type: MDAReport['reportType']) => {
    const labels: Record<MDAReport['reportType'], string> = {
      verification: 'Verification',
      prequalification: 'Pre-Qualification',
      audit: 'Audit',
      compliance: 'Compliance',
    };
    return labels[type];
  };

  const getRiskLevelColor = (level: MDAReport['riskLevel']) => {
    const colors: Record<MDAReport['riskLevel'], string> = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-red-600 bg-red-50',
    };
    return colors[level];
  };

  const getRiskLevelIcon = (level: MDAReport['riskLevel']) => {
    if (level === 'high') return AlertTriangle;
    return Shield;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Verification Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage vendor verification reports</p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF3000] text-white rounded-md hover:bg-[#e62e00] transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports by vendor, RC number, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF3000] focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF3000] focus:border-transparent bg-background"
        >
          <option value="all">All Report Types</option>
          <option value="verification">Verification</option>
          <option value="prequalification">Pre-Qualification</option>
          <option value="audit">Audit</option>
          <option value="compliance">Compliance</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {filteredReports.length === 0 ? (
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
                  <th className="px-4 py-3 text-left font-semibold text-sm">Report Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Vendor</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">RC Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Risk Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Generated</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Generated By</th>
                  <th className="px-4 py-3 text-right font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground">ID: {report.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{report.vendorName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{report.rcNumber}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                        {getReportTypeLabel(report.reportType)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                          report.riskLevel
                        )}`}
                      >
                        {(() => {
                          const Icon = getRiskLevelIcon(report.riskLevel);
                          return <Icon className="w-3 h-3" />;
                        })()}
                        {report.riskLevel.charAt(0).toUpperCase() + report.riskLevel.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{report.generatedBy}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report)}
                          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Generate Verification Report</h2>
            <p className="text-muted-foreground mb-6">
              Select the type of report you want to generate. This will create a new verification
              report based on current vendor data.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  showToast('success', 'Report Generation Started', 'Verification report is being generated...');
                  setIsGenerateModalOpen(false);
                }}
                className="w-full text-left px-4 py-3 border border-border rounded-md hover:bg-muted transition-colors"
              >
                <div className="font-medium">Vendor Verification Report</div>
                <div className="text-sm text-muted-foreground">Comprehensive compliance verification for selected vendors</div>
              </button>
              <button
                onClick={() => {
                  showToast('success', 'Report Generation Started', 'Pre-qualification report is being generated...');
                  setIsGenerateModalOpen(false);
                }}
                className="w-full text-left px-4 py-3 border border-border rounded-md hover:bg-muted transition-colors"
              >
                <div className="font-medium">Pre-Qualification Summary</div>
                <div className="text-sm text-muted-foreground">Summary of all pre-qualified vendors</div>
              </button>
              <button
                onClick={() => {
                  showToast('success', 'Report Generation Started', 'Audit trail report is being generated...');
                  setIsGenerateModalOpen(false);
                }}
                className="w-full text-left px-4 py-3 border border-border rounded-md hover:bg-muted transition-colors"
              >
                <div className="font-medium">Audit Trail Report</div>
                <div className="text-sm text-muted-foreground">Complete audit trail of all verification activities</div>
              </button>
            </div>
            <button
              onClick={() => setIsGenerateModalOpen(false)}
              className="mt-6 w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {viewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{viewReport.title}</h2>
                <p className="text-muted-foreground mt-1">Report ID: {viewReport.id}</p>
              </div>
              <button
                onClick={() => setViewReport(null)}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vendor Name</label>
                  <p className="mt-1">{viewReport.vendorName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">RC Number</label>
                  <p className="mt-1"><code className="bg-muted px-2 py-1 rounded">{viewReport.rcNumber}</code></p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Report Type</label>
                  <p className="mt-1">{getReportTypeLabel(viewReport.reportType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Risk Level</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                      viewReport.riskLevel
                    )}`}>
                      {(() => {
                        const Icon = getRiskLevelIcon(viewReport.riskLevel);
                        return <Icon className="w-3 h-3" />;
                      })()}
                      {viewReport.riskLevel.charAt(0).toUpperCase() + viewReport.riskLevel.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Generated Date</label>
                  <p className="mt-1">{new Date(viewReport.generatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Generated By</label>
                  <p className="mt-1">{viewReport.generatedBy}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-medium mb-3">Report Summary</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm">
                    This {getReportTypeLabel(viewReport.reportType).toLowerCase()} report was generated for {viewReport.vendorName} 
                    (RC: {viewReport.rcNumber}). The vendor has been assessed with a <strong>{viewReport.riskLevel} risk level</strong>. 
                    All compliance checks have been completed and documented in this report.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleDownloadReport(viewReport);
                    setViewReport(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FF3000] text-white rounded-md hover:bg-[#e62e00] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                <button
                  onClick={() => setViewReport(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
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
                {deleteReport.vendorName} ({deleteReport.rcNumber})
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this report? This will permanently remove the report 
              and all associated data from the system.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDeleteReport}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Report
              </button>
              <button
                onClick={() => setDeleteReport(null)}
                className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}