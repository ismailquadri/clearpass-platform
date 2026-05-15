import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Shield,
  AlertTriangle,
  Info,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
  Eye,
} from 'lucide-react';
import { useToast } from './ToastProvider';
import {
  auditTrail,
  type AuditLogEntry,
  type AuditTrailFilters,
  type AuditTrailStats,
  type AuditActionType,
  type EntityType,
} from '../utils/auditTrail';

export function DetailedAuditTrailView() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditTrailStats | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<AuditTrailFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [selectedActionType, setSelectedActionType] = useState<AuditActionType | ''>('');
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | ''>('');
  const [selectedSeverity, setSelectedSeverity] = useState<AuditLogEntry['severity'] | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<AuditLogEntry['category'] | ''>('');

  const loadEntries = () => {
    let effectiveFilters: AuditTrailFilters = { ...filters };

    // Apply date range
    const now = new Date();
    if (dateRange === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      effectiveFilters.startDate = today.toISOString();
    } else if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      effectiveFilters.startDate = weekAgo.toISOString();
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      effectiveFilters.startDate = monthAgo.toISOString();
    }

    if (searchQuery) {
      effectiveFilters.searchQuery = searchQuery;
    }

    if (selectedActionType) {
      effectiveFilters.actionType = selectedActionType;
    }

    if (selectedEntityType) {
      effectiveFilters.entityType = selectedEntityType;
    }

    if (selectedSeverity) {
      effectiveFilters.severity = selectedSeverity;
    }

    if (selectedCategory) {
      effectiveFilters.category = selectedCategory;
    }

    const filteredEntries = auditTrail.getEntries(effectiveFilters);
    setEntries(filteredEntries);
  };

  const loadStats = () => {
    setStats(auditTrail.getStats());
  };

  // Load entries on mount and filter change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEntries();

    loadStats();
  }, [filters, searchQuery, dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadEntries();
      loadStats();
      setIsRefreshing(false);
      showToast('success', 'Refreshed', 'Audit trail updated');
    }, 500);
  };

  const handleExport = () => {
    const csv = auditTrail.exportToCSV(filters);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Export Complete', 'Audit trail exported to CSV');
  };

  const handleClearOldEntries = () => {
    if (
      window.confirm(
        'Are you sure you want to delete audit entries older than 90 days? This action cannot be undone.'
      )
    ) {
      const deletedCount = auditTrail.clearOldEntries(90);
      loadEntries();
      loadStats();
      showToast('success', 'Cleanup Complete', `${deletedCount} old entries deleted`);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateRange('all');
    setSelectedActionType('');
    setSelectedEntityType('');
    setSelectedSeverity('');
    setSelectedCategory('');
    setFilters({});
    setShowFilters(false);
  };

  const getSeverityIcon = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'critical':
        return <Shield className="w-4 h-4 text-red-600" />;
    }
  };

  const getSeverityColor = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getCategoryColor = (category: AuditLogEntry['category']) => {
    switch (category) {
      case 'compliance':
        return 'bg-green-50 text-green-700';
      case 'security':
        return 'bg-red-50 text-red-700';
      case 'user_management':
        return 'bg-blue-50 text-blue-700';
      case 'system':
        return 'bg-gray-50 text-gray-700';
      case 'business':
        return 'bg-purple-50 text-purple-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const actionTypes: AuditActionType[] = [
    'certificate.created',
    'certificate.updated',
    'certificate.deleted',
    'certificate.verified',
    'company.created',
    'company.updated',
    'user.created',
    'user.login',
    'compliance.check_run',
    'mda.verification_performed',
  ];

  const entityTypes: EntityType[] = [
    'certificate',
    'company',
    'user',
    'compliance',
    'mda_verification',
    'document',
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <h1 className="cp-page-title">Detailed Audit Trail</h1>
              <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
                Comprehensive logging of all compliance-related actions
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Entries</p>
              <p style={{ fontSize: '24px', fontWeight: 600 }}>
                {stats.totalEntries.toLocaleString()}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Today</p>
              <p style={{ fontSize: '24px', fontWeight: 600 }}>{stats.todayCount}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">This Week</p>
              <p style={{ fontSize: '24px', fontWeight: 600 }}>{stats.weekCount}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">This Month</p>
              <p style={{ fontSize: '24px', fontWeight: 600 }}>{stats.monthCount}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Critical</p>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#DC2626' }}>
                {stats.entriesBySeverity.critical}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Warnings</p>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#D97706' }}>
                {stats.entriesBySeverity.warning}
              </p>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block mb-2 text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by description, user, or entity ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input-background"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block mb-2 text-sm font-medium">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="w-full px-4 py-2 border border-border rounded-md bg-input-background"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              {/* Action Type */}
              <div>
                <label className="block mb-2 text-sm font-medium">Action Type</label>
                <select
                  value={selectedActionType}
                  onChange={(e) => setSelectedActionType(e.target.value as AuditActionType)}
                  className="w-full px-4 py-2 border border-border rounded-md bg-input-background"
                >
                  <option value="">All Actions</option>
                  {actionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/\./g, ' → ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entity Type */}
              <div>
                <label className="block mb-2 text-sm font-medium">Entity Type</label>
                <select
                  value={selectedEntityType}
                  onChange={(e) => setSelectedEntityType(e.target.value as EntityType)}
                  className="w-full px-4 py-2 border border-border rounded-md bg-input-background"
                >
                  <option value="">All Entities</option>
                  {entityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block mb-2 text-sm font-medium">Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value as AuditLogEntry['severity'])}
                  className="w-full px-4 py-2 border border-border rounded-md bg-input-background"
                >
                  <option value="">All Severities</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-medium">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as AuditLogEntry['category'])}
                  className="w-full px-4 py-2 border border-border rounded-md bg-input-background"
                >
                  <option value="">All Categories</option>
                  <option value="compliance">Compliance</option>
                  <option value="security">Security</option>
                  <option value="user_management">User Management</option>
                  <option value="system">System</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Audit Entries Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 style={{ fontSize: '18px', fontWeight: 500 }}>Audit Entries ({entries.length})</h2>
            <button
              onClick={handleClearOldEntries}
              className="px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clean Old Entries</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Entity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Details</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No audit entries found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <td className="px-4 py-3 text-sm">{formatDate(entry.timestamp)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{entry.description}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{entry.userName}</p>
                          <p className="text-xs text-muted-foreground">{entry.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{entry.entityType}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {entry.entityId}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                            entry.severity
                          )} flex items-center gap-1 w-fit`}
                        >
                          {getSeverityIcon(entry.severity)}
                          {entry.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            entry.category
                          )}`}
                        >
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntry(entry);
                          }}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Audit Entry Details</h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                    <p className="text-sm font-medium">{formatDate(selectedEntry.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Severity</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                        selectedEntry.severity
                      )} flex items-center gap-1 w-fit`}
                    >
                      {getSeverityIcon(selectedEntry.severity)}
                      {selectedEntry.severity}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Action Type</p>
                    <p className="text-sm font-medium">{selectedEntry.actionType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        selectedEntry.category
                      )}`}
                    >
                      {selectedEntry.category}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm font-medium">{selectedEntry.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">User</p>
                    <p className="text-sm font-medium">{selectedEntry.userName}</p>
                    <p className="text-xs text-muted-foreground">{selectedEntry.userEmail}</p>
                    <p className="text-xs text-muted-foreground">{selectedEntry.userRole}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Entity</p>
                    <p className="text-sm font-medium">{selectedEntry.entityType}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedEntry.entityId}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">IP Address</p>
                    <p className="text-sm font-mono">{selectedEntry.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">User Agent</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedEntry.userAgent}
                    </p>
                  </div>
                </div>

                {selectedEntry.details && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Details</p>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {JSON.stringify(selectedEntry.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
