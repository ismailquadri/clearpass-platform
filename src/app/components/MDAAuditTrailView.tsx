import { Search, Download, Eye, Clock, User, AlertCircle, CheckCircle2, XCircle, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useToast } from './ToastProvider';
import { EmptyState } from './ui';
import '../../app/styles/mda-theme.css';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'verification_initiated' | 'verification_completed' | 'prequalification_started' | 'prequalification_completed' | 'report_generated' | 'certificate_expired' | 'compliance_flagged';
  actor: string;
  actorRole: string;
  targetVendor: string;
  rcNumber: string;
  details: string;
  status: 'success' | 'pending' | 'failed';
  ipAddress?: string;
}

export function MDAAuditTrailView() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<'all' | AuditLogEntry['action']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | AuditLogEntry['status']>('all');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  // Mock audit trail data - in real implementation, this would come from the backend
  const mockAuditLogs: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2026-01-15T14:30:00Z',
      action: 'verification_initiated',
      actor: 'Engr. Bello',
      actorRole: 'Procurement Officer',
      targetVendor: 'TechVentures Nigeria Ltd',
      rcNumber: 'RC1234567',
      details: 'Initiated compliance verification for NHIA certificate',
      status: 'success',
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      timestamp: '2026-01-15T14:35:00Z',
      action: 'verification_completed',
      actor: 'System',
      actorRole: 'Automated',
      targetVendor: 'TechVentures Nigeria Ltd',
      rcNumber: 'RC1234567',
      details: 'NHIA certificate verified - Valid until 2026-12-31',
      status: 'success',
      ipAddress: '192.168.1.100',
    },
    {
      id: '3',
      timestamp: '2026-01-14T10:15:00Z',
      action: 'prequalification_started',
      actor: 'Procurement Team',
      actorRole: 'MDA Staff',
      targetVendor: 'BuildWell Construction',
      rcNumber: 'RC7654321',
      details: 'Started pre-qualification process for tender #2026-042',
      status: 'success',
      ipAddress: '192.168.1.105',
    },
    {
      id: '4',
      timestamp: '2026-01-14T11:45:00Z',
      action: 'prequalification_completed',
      actor: 'Engr. Bello',
      actorRole: 'Procurement Officer',
      targetVendor: 'BuildWell Construction',
      rcNumber: 'RC7654321',
      details: 'Pre-qualification completed - Vendor approved for tender',
      status: 'success',
      ipAddress: '192.168.1.100',
    },
    {
      id: '5',
      timestamp: '2026-01-13T09:00:00Z',
      action: 'report_generated',
      actor: 'Internal Audit',
      actorRole: 'Auditor',
      targetVendor: 'GreenEnergy Solutions',
      rcNumber: 'RC9876543',
      details: 'Generated compliance audit report for Q4 2025',
      status: 'success',
      ipAddress: '192.168.1.110',
    },
    {
      id: '6',
      timestamp: '2026-01-12T16:20:00Z',
      action: 'certificate_expired',
      actor: 'System',
      actorRole: 'Automated',
      targetVendor: 'Nigeria Logistics Co',
      rcNumber: 'RC4567890',
      details: 'NSITF certificate expired - Vendor flagged for renewal',
      status: 'failed',
      ipAddress: '192.168.1.1',
    },
    {
      id: '7',
      timestamp: '2026-01-11T13:10:00Z',
      action: 'compliance_flagged',
      actor: 'System',
      actorRole: 'Automated',
      targetVendor: 'SecureTech Services',
      rcNumber: 'RC3456789',
      details: 'Compliance score dropped below threshold - Requires review',
      status: 'pending',
      ipAddress: '192.168.1.1',
    },
    {
      id: '8',
      timestamp: '2026-01-10T08:30:00Z',
      action: 'verification_initiated',
      actor: 'Engr. Bello',
      actorRole: 'Procurement Officer',
      targetVendor: 'Alpha Construction Ltd',
      rcNumber: 'RC2345678',
      details: 'Initiated full compliance verification for all certificates',
      status: 'pending',
      ipAddress: '192.168.1.100',
    },
  ];

  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        !q ||
        log.targetVendor.toLowerCase().includes(q) ||
        log.rcNumber.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q);
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
      return matchesSearch && matchesAction && matchesStatus;
    });
  }, [mockAuditLogs, searchQuery, filterAction, filterStatus]);

  const handleExportAuditTrail = () => {
    showToast('success', 'Exporting Audit Trail', 'Audit trail is being exported to CSV...');
  };

  const handleViewEntry = (entry: AuditLogEntry) => {
    setSelectedEntry(entry);
  };

  const getActionLabel = (action: AuditLogEntry['action']) => {
    const labels: Record<AuditLogEntry['action'], string> = {
      verification_initiated: 'Verification Initiated',
      verification_completed: 'Verification Completed',
      prequalification_started: 'Pre-Qualification Started',
      prequalification_completed: 'Pre-Qualification Completed',
      report_generated: 'Report Generated',
      certificate_expired: 'Certificate Expired',
      compliance_flagged: 'Compliance Flagged',
    };
    return labels[action];
  };

  const getStatusIcon = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'success':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'failed':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Audit Trail</h1>
          <p className="text-muted-foreground mt-1">
    Complete immutable log of all verification activities
          </p>
        </div>
        <button
          onClick={handleExportAuditTrail}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors self-start"
        >
          <Download className="w-4 h-4" />
          Export Audit Trail
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by vendor, RC number, actor, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mda-primary)] focus:border-transparent"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value as typeof filterAction)}
          className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mda-primary)] focus:border-transparent bg-background"
        >
          <option value="all">All Actions</option>
          <option value="verification_initiated">Verification Initiated</option>
          <option value="verification_completed">Verification Completed</option>
          <option value="prequalification_started">Pre-Qualification Started</option>
          <option value="prequalification_completed">Pre-Qualification Completed</option>
          <option value="report_generated">Report Generated</option>
          <option value="certificate_expired">Certificate Expired</option>
          <option value="compliance_flagged">Compliance Flagged</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mda-primary)] focus:border-transparent bg-background"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {filteredLogs.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No Audit Logs Found"
            description={
              searchQuery || filterAction !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No audit logs have been recorded yet'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Timestamp</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Action</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Actor</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Vendor</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">RC Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm">{getActionLabel(log.action)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{log.actor}</div>
                          <div className="text-xs text-muted-foreground">{log.actorRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{log.targetVendor}</div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{log.rcNumber}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          log.status
                        )}`}
                      >
                        {(() => {
                          const Icon = getStatusIcon(log.status);
                          return <Icon className="w-3 h-3" />;
                        })()}
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewEntry(log)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* View Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Audit Log Entry</h2>
                <p className="text-muted-foreground mt-1">Entry ID: {selectedEntry.id}</p>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {new Date(selectedEntry.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Action</label>
                  <p className="mt-1">{getActionLabel(selectedEntry.action)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Actor</label>
                  <p className="mt-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {selectedEntry.actor} <span className="text-muted-foreground">({selectedEntry.actorRole})</span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedEntry.status
                    )}`}>
                      {(() => {
                        const Icon = getStatusIcon(selectedEntry.status);
                        return <Icon className="w-3 h-3" />;
                      })()}
                      {selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Target Vendor</label>
                  <p className="mt-1">{selectedEntry.targetVendor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">RC Number</label>
                  <p className="mt-1"><code className="bg-muted px-2 py-1 rounded">{selectedEntry.rcNumber}</code></p>
                </div>
                {selectedEntry.ipAddress && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                    <p className="mt-1"><code className="bg-muted px-2 py-1 rounded">{selectedEntry.ipAddress}</code></p>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-medium mb-3">Details</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm">{selectedEntry.details}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedEntry(null)}
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
  );
}