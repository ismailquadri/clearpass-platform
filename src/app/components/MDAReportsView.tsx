import { FileText, Download, Calendar, Search, Plus, Eye, Trash2, Shield, AlertTriangle } from 'lucide-react';
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
    showToast('success', 'Opening Report', `Opening ${report.title}...`);
  };

  const handleDeleteReport = (report: MDAReport) => {
    showToast('success', 'Report Deleted', `${report.title} has been deleted`);
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
    </div>
  );
}