import {
  Users,
  Search,
  Plus,
  AlertCircle,
  TrendingUp,
  Upload,
  FileText,
  DollarSign,
  Calendar,
  Activity,
  Clock,
  CheckSquare,
  Square,
  Mail,
  FileDown,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { PartnerCertificateUploadModal } from './PartnerCertificateUploadModal';
import { useToast } from './ToastProvider';
import {
  usePartnerClients,
  updateClientPermissions,
  useClientPermissions,
  useClientCertificates,
  revokeClientAccess,
  restoreClientAccess,
} from '../api';
import type { ClientStatus, PartnerClient, Permission, ClientCertificate } from '../api';
import { getActivitiesForClient } from '../api/mocks';
import { validateClientManagementForm, type ClientManagementFormData } from '../utils/validation';
import { usePagination } from '../hooks/usePagination';
import { useOptimisticMutation } from '../hooks/useOptimisticMutation';
import { useUndoableActions } from '../hooks/useUndoableAction';
import { Pagination } from './ui/Pagination';
import { UndoToast } from './UndoToast';
import { ApiState, EmptyState } from './ui';
import { TableSkeleton } from './ui/Skeleton';

type ClientFilter = 'all' | ClientStatus;
type SectorFilter = 'all' | string;

export function PartnerClientsView() {
  const { showToast } = useToast();
  const clientsQuery = usePartnerClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ClientFilter>('all');
  const [filterSector, setFilterSector] = useState<SectorFilter>('all');
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingClient, setViewingClient] = useState<PartnerClient | null>(null);
  const [managingClient, setManagingClient] = useState<PartnerClient | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ApiState query={clientsQuery} loading={<TableSkeleton rows={5} />}>
          {(clients) => (
            <ClientsContent
              clients={clients}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterSector={filterSector}
              setFilterSector={setFilterSector}
              selectedClients={selectedClients}
              setSelectedClients={setSelectedClients}
              onBulkSendReminder={() => {
                showToast(
                  'success',
                  'Reminders Sent',
                  `Sent reminders to ${selectedClients.size} client(s)`
                );
                setSelectedClients(new Set());
              }}
              onBulkGenerateReport={() => {
                showToast(
                  'success',
                  'Reports Generated',
                  `Generated reports for ${selectedClients.size} client(s)`
                );
                setSelectedClients(new Set());
              }}
              onUploadCertificate={() => {
                setIsUploadModalOpen(true);
                showToast('success', 'Upload Certificate', 'Opening certificate upload form...');
              }}
              onAddClient={() => setIsInviteModalOpen(true)}
              onViewDashboard={(client) => setViewingClient(client)}
              onManage={(client) => setManagingClient(client)}
            />
          )}
        </ApiState>
      </div>

      <PartnerCertificateUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {viewingClient && (
        <ClientScopedView client={viewingClient} onClose={() => setViewingClient(null)} />
      )}

      {managingClient && (
        <ClientManagementModal client={managingClient} onClose={() => setManagingClient(null)} />
      )}

      {isInviteModalOpen && (
        <InviteNewClientModal
          onClose={() => setIsInviteModalOpen(false)}
          onInviteSuccess={() => {
            showToast('success', 'Client Invited', 'Invitation sent successfully');
            setIsInviteModalOpen(false);
            clientsQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

interface ClientsContentProps {
  clients: PartnerClient[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: ClientFilter;
  setFilterStatus: (f: ClientFilter) => void;
  filterSector: SectorFilter;
  setFilterSector: (f: SectorFilter) => void;
  selectedClients: Set<string>;
  setSelectedClients: (s: Set<string>) => void;
  onBulkSendReminder: () => void;
  onBulkGenerateReport: () => void;
  onUploadCertificate: () => void;
  onAddClient: () => void;
  onViewDashboard: (client: PartnerClient) => void;
  onManage: (client: PartnerClient) => void;
}

function ClientsContent({
  clients,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterSector,
  setFilterSector,
  selectedClients,
  setSelectedClients,
  onBulkSendReminder,
  onBulkGenerateReport,
  onUploadCertificate,
  onAddClient,
  onViewDashboard,
  onManage,
}: ClientsContentProps) {
  // Extract unique sectors from clients
  const sectors = useMemo(() => {
    const uniqueSectors = new Set(clients.map((c) => c.sector).filter(Boolean));
    return Array.from(uniqueSectors).sort();
  }, [clients]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return clients.filter((c) => {
      const matchesSearch =
        !q || c.companyName.toLowerCase().includes(q) || c.rcNumber.toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchesSector = filterSector === 'all' || c.sector === filterSector;
      return matchesSearch && matchesStatus && matchesSector;
    });
  }, [clients, searchQuery, filterStatus, filterSector]);

  // Sort by compliance health score (highest first) as per PRD US-04.4
  const sortedClients = useMemo(() => {
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [filtered]);

  // Pagination for large client lists
  const { currentPage, totalPages, paginatedData, goToPage, totalItems } = usePagination({
    data: sortedClients,
    pageSize: 10,
  });

  const handleSelectClient = (clientId: string) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId);
    } else {
      newSelected.add(clientId);
    }
    setSelectedClients(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedClients.size === sortedClients.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(sortedClients.map((c) => c.id)));
    }
  };

  const isAllSelected = sortedClients.length > 0 && selectedClients.size === sortedClients.length;

  const criticalClients = clients.filter((c) => c.status === 'critical').length;
  const attentionClients = clients.filter((c) => c.status === 'attention').length;

  // Aggregate health scores across all clients
  const averageHealthScore =
    clients.length > 0
      ? Math.round(clients.reduce((sum, c) => sum + c.score, 0) / clients.length)
      : 0;

  // Upcoming expirations overview - clients expiring within 30 days
  const upcomingExpirations = clients
    .filter((c) => c.daysToExpiry > 0 && c.daysToExpiry <= 30)
    .sort((a, b) => a.daysToExpiry - b.daysToExpiry)
    .slice(0, 5); // Show top 5 most urgent

  return (
    <>
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h1 className="cp-page-title">My Clients</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onUploadCertificate}
              className="px-4 py-2 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" aria-hidden="true" />
              <span>Upload Certificate</span>
            </button>
            <button
              onClick={onAddClient}
              className="px-4 py-2 min-h-[44px] rounded-md text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FF3000' }}
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span>Add Client</span>
            </button>
          </div>
        </div>
        <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
          Managing {clients.length} corporate clients
        </p>
      </header>

      {/* Bulk Actions Bar */}
      {selectedClients.size > 0 && (
        <div
          className="bg-card border border-border rounded-lg p-4 mb-6"
          style={{ borderLeft: '4px solid #FF3000' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>
                {selectedClients.size} client{selectedClients.size !== 1 ? 's' : ''} selected
              </p>
              <p className="caption text-muted-foreground">
                Choose an action to perform on selected clients
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onBulkSendReminder}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Reminder</span>
              </button>
              <button
                onClick={onBulkGenerateReport}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                <span>Generate Reports</span>
              </button>
              <button
                onClick={() => setSelectedClients(new Set())}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard
          label="Total Clients"
          value={clients.length.toString()}
          subtitle="+2 this month"
          icon={Users}
        />
        <KpiCard
          label="Avg Health Score"
          value={`${averageHealthScore}/100`}
          subtitle="Across all clients"
          icon={TrendingUp}
          color={
            averageHealthScore >= 80 ? '#FF3000' : averageHealthScore >= 50 ? '#FFA500' : '#FF3000'
          }
        />
        <KpiCard
          label="Need Attention"
          value={attentionClients.toString()}
          subtitle="Expiring soon"
          icon={AlertCircle}
          color="#FF3000"
        />
        <KpiCard
          label="Critical Issues"
          value={criticalClients.toString()}
          subtitle="Require action"
          icon={AlertCircle}
          color="#FF3000"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <label htmlFor="partner-clients-search" className="sr-only">
              Search clients
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="partner-clients-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients by name or RC number..."
              className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div
            className="flex flex-wrap gap-1 p-1 bg-muted rounded-md overflow-x-auto"
            role="group"
            aria-label="Client status filters"
          >
            {(['all', 'healthy', 'attention', 'critical'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                aria-pressed={filterStatus === status}
                className={`px-3 sm:px-4 py-2 min-h-[40px] rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === status ? 'bg-card shadow-sm' : 'hover:bg-card/50'
                }`}
                style={{
                  fontSize: '14px',
                  fontWeight: filterStatus === status ? 500 : 400,
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          {sectors.length > 0 && (
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            >
              <option value="all">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          )}
          {sortedClients.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
              aria-label={isAllSelected ? 'Deselect all' : 'Select all'}
            >
              {isAllSelected ? (
                <CheckSquare className="w-5 h-5" style={{ color: '#FF3000' }} />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </span>
            </button>
          )}
        </div>
      </div>

      {sortedClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Clients Found"
          description={
            searchQuery
              ? 'Try adjusting your search or filter.'
              : 'Add your first client to get started.'
          }
        />
      ) : (
        <>
          {/* Upcoming Expirations Overview */}
          {upcomingExpirations.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6">
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                Upcoming Expirations (Next 30 Days)
              </h3>
              <div className="space-y-3">
                {upcomingExpirations.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex-1">
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{client.companyName}</p>
                      <p className="caption text-muted-foreground">{client.rcNumber}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{client.nextExpiry}</p>
                      <p
                        className="caption"
                        style={{ color: client.daysToExpiry <= 7 ? '#FF3000' : '#FFA500' }}
                      >
                        {client.daysToExpiry} days
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client List - Sorted by Health Score */}
          <div className="space-y-3">
            {paginatedData.map((client, index) => (
              <ClientRow
                key={client.id}
                client={client}
                rank={(currentPage - 1) * 10 + index + 1}
                isSelected={selectedClients.has(client.id)}
                onSelect={() => handleSelectClient(client.id)}
                onViewDashboard={onViewDashboard}
                onManage={onManage}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={goToPage}
              pageSize={10}
            />
          )}
        </>
      )}
    </>
  );
}

function KpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  subtitle?: string;
  icon: typeof Users;
  color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
          {label}
        </span>
        <Icon
          className="w-5 h-5"
          style={{ color: color ?? 'var(--muted-foreground)' }}
          aria-hidden="true"
        />
      </div>
      <p style={{ fontSize: '28px', fontWeight: 600, color: color ?? undefined }}>{value}</p>
      {subtitle && <p className="caption text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

function ClientRow({
  client,
  rank,
  isSelected,
  onSelect,
  onViewDashboard,
  onManage,
}: {
  client: PartnerClient;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
  onViewDashboard: (client: PartnerClient) => void;
  onManage: (client: PartnerClient) => void;
}) {
  const statusConfig = getStatusConfig(client.status);
  const expiryColor =
    client.daysToExpiry < 0 ? '#FF3000' : client.daysToExpiry < 15 ? '#FF3000' : 'inherit';

  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 sm:p-5 transition-colors ${isSelected ? 'border-[#FF3000]' : ''}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Checkbox */}
          <button
            onClick={onSelect}
            className="mt-1 shrink-0"
            aria-label={`Select ${client.companyName}`}
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5" style={{ color: '#FF3000' }} />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {/* Rank Badge */}
              <div
                className="px-2 py-1 rounded text-xs font-bold"
                style={{
                  backgroundColor: rank <= 3 ? 'rgba(255, 48, 0, 0.1)' : 'rgba(92, 92, 92, 0.1)',
                  color: rank <= 3 ? '#FF3000' : 'rgb(92, 92, 92)',
                }}
              >
                #{rank}
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 500 }}>{client.companyName}</h4>
              <span
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: statusConfig.bgColor,
                  color: statusConfig.color,
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {statusConfig.label}
              </span>
            </div>
            <p className="caption text-muted-foreground mb-4">{client.rcNumber}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div>
                <p className="caption text-muted-foreground mb-1">Compliance Score</p>
                <p
                  style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: statusConfig.color,
                  }}
                >
                  {client.score}
                  <span style={{ fontSize: '14px', fontWeight: 400 }}>/100</span>
                </p>
              </div>
              <div>
                <p className="caption text-muted-foreground mb-1">Certificates</p>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>
                  {client.activeCertificates}/{client.totalCertificates} Active
                </p>
              </div>
              <div>
                <p className="caption text-muted-foreground mb-1">Next Expiry</p>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>
                  {client.nextExpiry}{' '}
                  <span className="caption" style={{ color: expiryColor }}>
                    (
                    {client.daysToExpiry < 0
                      ? `${Math.abs(client.daysToExpiry)}d overdue`
                      : `${client.daysToExpiry}d`}
                    )
                  </span>
                </p>
              </div>
              <div>
                <p className="caption text-muted-foreground mb-1">Monthly Fee</p>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>
                  ₦{client.monthlyFee.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 lg:ml-6 shrink-0">
          <button
            onClick={() => onViewDashboard(client)}
            className="flex-1 lg:flex-initial px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
          >
            View Dashboard
          </button>
          <button
            onClick={() => onManage(client)}
            className="flex-1 lg:flex-initial px-4 py-2 min-h-[40px] rounded-md text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FF3000' }}
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusConfig(status: ClientStatus) {
  switch (status) {
    case 'healthy':
      return {
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
        label: 'Healthy',
      };
    case 'attention':
      return {
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
        label: 'Attention',
      };
    case 'critical':
      return {
        color: '#FF3000',
        bgColor: 'rgba(255, 48, 0, 0.1)',
        label: 'Critical',
      };
  }
}

interface ClientScopedViewProps {
  client: PartnerClient;
  onClose: () => void;
}

function ClientScopedView({ client, onClose }: ClientScopedViewProps) {
  const statusConfig = getStatusConfig(client.status);
  const certificatesQuery = useClientCertificates(client.id);
  const certificates = certificatesQuery.data || [];
  const clientActivities = getActivitiesForClient(client.id);

  // Mock historical score data
  const historicalScores = [
    { date: '2025-10-15', score: 65 },
    { date: '2025-11-15', score: 72 },
    { date: '2025-12-15', score: 78 },
    { date: '2026-01-15', score: 85 },
  ];

  // Renewal cost forecast
  const renewalForecast = [
    { certificate: 'PCC', expiryDate: '2026-02-10', estimatedCost: 15000 },
    { certificate: 'NSITF', expiryDate: '2026-03-20', estimatedCost: 25000 },
    { certificate: 'ITF', expiryDate: '2026-04-15', estimatedCost: 12000 },
  ];

  const totalRenewalCost = renewalForecast.reduce((sum, r) => sum + r.estimatedCost, 0);

  const getCertificateStatusBadge = (status: ClientCertificate['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expiring-soon':
        return 'Expiring Soon';
      case 'expiring-urgent':
        return 'Expiring Urgent';
      case 'expiring-critical':
        return 'Expiring Critical';
      case 'expired':
        return 'Expired';
      case 'pending':
        return 'Pending';
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Viewing as:
              </p>
              <h2 style={{ fontSize: '24px', fontWeight: 600 }}>{client.companyName}</h2>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
            >
              Back to Partner Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <KpiCard
            label="Compliance Score"
            value={`${client.score}/100`}
            icon={TrendingUp}
            color={statusConfig.color}
          />
          <KpiCard
            label="Active Certificates"
            value={`${client.activeCertificates}/${client.totalCertificates}`}
            icon={FileText}
          />
          <KpiCard
            label="Next Expiry"
            value={client.nextExpiry}
            subtitle={`${client.daysToExpiry} days`}
            icon={AlertCircle}
            color={client.daysToExpiry < 15 ? '#FF3000' : undefined}
          />
          <KpiCard
            label="Monthly Fee"
            value={`₦${client.monthlyFee.toLocaleString()}`}
            icon={DollarSign}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Client Details */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
              Client Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="caption text-muted-foreground mb-1">Company Name</p>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>{client.companyName}</p>
              </div>
              <div>
                <p className="caption text-muted-foreground mb-1">RC Number</p>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>{client.rcNumber}</p>
              </div>
              <div>
                <p className="caption text-muted-foreground mb-1">Status</p>
                <span
                  className="px-3 py-1 rounded-full inline-block"
                  style={{
                    backgroundColor: statusConfig.bgColor,
                    color: statusConfig.color,
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {statusConfig.label}
                </span>
              </div>
              <div>
                <p className="caption text-muted-foreground mb-1">Next Certificate Expiry</p>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>
                  {client.nextExpiry} ({client.daysToExpiry} days)
                </p>
              </div>
            </div>
          </div>

          {/* Historical Score Trend */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Score History</h3>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {historicalScores.map((entry, index) => (
                <div key={entry.date} className="flex items-center justify-between">
                  <p className="caption text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <span
                        style={{
                          fontSize: '12px',
                          color:
                            entry.score > historicalScores[index - 1].score ? '#FF3000' : '#FFA500',
                        }}
                      >
                        {entry.score > historicalScores[index - 1].score ? '+' : ''}
                        {entry.score - historicalScores[index - 1].score}
                      </span>
                    )}
                    <p style={{ fontSize: '16px', fontWeight: 600 }}>{entry.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Certificates Overview */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
              Certificates Overview
            </h3>
            {certificatesQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#FF3000] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : certificatesQuery.error ? (
              <div className="flex items-center justify-center py-8 text-red-500">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>Failed to load certificates</span>
              </div>
            ) : (
              <div className="space-y-3">
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500 }}>{cert.name}</p>
                        <p className="caption text-muted-foreground">{cert.certificateNumber}</p>
                      </div>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor:
                            cert.status === 'expired' || cert.status === 'expiring-critical'
                              ? 'rgba(251, 55, 72, 0.1)'
                              : cert.status === 'expiring-urgent' || cert.status === 'expiring-soon'
                                ? 'rgba(255, 165, 0, 0.1)'
                                : 'rgba(255, 48, 0, 0.1)',
                          color:
                            cert.status === 'expired' || cert.status === 'expiring-critical'
                              ? 'rgb(251, 55, 72)'
                              : cert.status === 'expiring-urgent' || cert.status === 'expiring-soon'
                                ? '#FFA500'
                                : '#FF3000',
                        }}
                      >
                        {getCertificateStatusBadge(cert.status)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No certificates found for this client
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Renewal Cost Forecast */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Renewal Forecast</h3>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="mb-4 p-3 bg-muted rounded-md">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Total Estimated Cost</span>
                <span style={{ fontSize: '20px', fontWeight: 600, color: '#FF3000' }}>
                  ₦{totalRenewalCost.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {renewalForecast.map((item) => (
                <div
                  key={item.certificate}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{item.certificate}</p>
                    <p className="caption text-muted-foreground">{item.expiryDate}</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>
                    ₦{item.estimatedCost.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Recent Activity</h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {clientActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                <div className="mt-1">
                  {activity.severity === 'success' && (
                    <CheckCircle className="w-5 h-5" style={{ color: '#FF3000' }} />
                  )}
                  {activity.severity === 'warning' && (
                    <AlertCircle className="w-5 h-5" style={{ color: '#FFA500' }} />
                  )}
                  {activity.severity === 'critical' && (
                    <AlertCircle className="w-5 h-5" style={{ color: '#FF3000' }} />
                  )}
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{activity.title}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
                    {activity.description}
                  </p>
                  <p className="caption text-muted-foreground mt-1">
                    {activity.daysAgo} {activity.daysAgo === 1 ? 'day' : 'days'} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

interface ClientManagementModalProps {
  client: PartnerClient;
  onClose: () => void;
}

function ClientManagementModal({ client, onClose }: ClientManagementModalProps) {
  const { showToast } = useToast();
  const permissionsQuery = useClientPermissions(client.id);
  const [permissions, setPermissions] = useState({
    certificatesView: true,
    certificatesEdit: true,
    reportsGenerate: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Undo functionality for destructive actions
  const { executeAction, undoToast, clearUndoToast, isExecuting } = useUndoableActions();

  // Update permissions state when data loads
  useEffect(() => {
    let isMounted = true;
    if (permissionsQuery.data && permissionsQuery.data.length > 0) {
      const link = permissionsQuery.data[0];
      if (isMounted) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPermissions({
          certificatesView: link.permissions.includes('certificates.view'),
          certificatesEdit: link.permissions.includes('certificates.edit'),
          reportsGenerate: link.permissions.includes('reports.generate'),
        });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [permissionsQuery.data]);

  const handlePermissionChange = (key: keyof typeof permissions, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  };

  // Optimistic mutation for permission updates
  const permissionMutation = useOptimisticMutation({
    mutationFn: async (permissionArray: Permission[]) => {
      return await updateClientPermissions(client.id, permissionArray);
    },
    onMutate: () => {
      // Optimistically update UI
      setIsSaving(true);
    },
    onSuccess: () => {
      showToast('success', 'Permissions Updated', `Permissions updated for ${client.companyName}`);
      onClose();
    },
    onError: () => {
      showToast('error', 'Update Failed', 'Failed to update permissions. Please try again.');
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const handleSavePermissions = async () => {
    const permissionArray: Permission[] = [];
    if (permissions.certificatesView) permissionArray.push('certificates.view');
    if (permissions.certificatesEdit) permissionArray.push('certificates.edit');
    if (permissions.reportsGenerate) permissionArray.push('reports.generate');

    const formData: ClientManagementFormData = {
      permissions: permissionArray,
    };

    const validation = validateClientManagementForm(formData);

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      showToast(
        'error',
        'Validation Error',
        firstError || 'Please correct the errors before saving'
      );
      return;
    }

    try {
      await permissionMutation.mutate(permissionArray);
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const handleUploadCertificate = () => {
    showToast('success', 'Upload Certificate', 'Opening certificate upload form...');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Manage Client</h2>
              <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                {client.companyName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Loading state */}
          {permissionsQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading permissions...</div>
            </div>
          ) : (
            <>
              {/* Client Details */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                  Client Details
                </h3>
                <div className="bg-muted rounded-md p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                      RC Number:
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{client.rcNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                      Status:
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{client.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                      Compliance Score:
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{client.score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                      Monthly Fee:
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>
                      ₦{client.monthlyFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                  Your Permissions
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors">
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>View Certificates</p>
                      <p className="caption text-muted-foreground">
                        Can view client certificate details
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.certificatesView}
                      onChange={(e) => handlePermissionChange('certificatesView', e.target.checked)}
                      className="w-5 h-5 rounded accent-[#FF3000]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors">
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>Edit Certificates</p>
                      <p className="caption text-muted-foreground">
                        Can upload and update certificates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.certificatesEdit}
                      onChange={(e) => handlePermissionChange('certificatesEdit', e.target.checked)}
                      className="w-5 h-5 rounded accent-[#FF3000]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors">
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>Generate Reports</p>
                      <p className="caption text-muted-foreground">
                        Can generate compliance reports
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.reportsGenerate}
                      onChange={(e) => handlePermissionChange('reportsGenerate', e.target.checked)}
                      className="w-5 h-5 rounded accent-[#FF3000]"
                    />
                  </label>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleUploadCertificate}
                    className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
                  >
                    <Upload className="w-5 h-5 mb-2" />
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>Upload Certificate</p>
                    <p className="caption text-muted-foreground">
                      Add certificates on behalf of client
                    </p>
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await executeAction({
                          action: async () => {
                            await revokeClientAccess(client.id);
                            showToast(
                              'success',
                              'Access Revoked',
                              `Access revoked for ${client.companyName}`
                            );
                          },
                          undo: async () => {
                            await restoreClientAccess(client.id);
                            showToast(
                              'success',
                              'Access Restored',
                              `Access restored for ${client.companyName}`
                            );
                          },
                          description: `Revoked access for ${client.companyName}`,
                        });
                        onClose();
                      } catch {
                        showToast('error', 'Action Failed', 'Failed to revoke client access');
                      }
                    }}
                    disabled={isExecuting}
                    className="px-4 py-3 rounded-md border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                  >
                    <FileDown className="w-5 h-5 mb-2 text-red-500" />
                    <p style={{ fontSize: '14px', fontWeight: 500 }} className="text-red-500">
                      Revoke Access
                    </p>
                    <p className="caption text-muted-foreground">Remove client access (undoable)</p>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Undo Toast */}
        {undoToast && (
          <UndoToast
            message={undoToast.message}
            onUndo={undoToast.onUndo}
            onDismiss={clearUndoToast}
          />
        )}

        <div className="p-6 border-t border-border flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-full sm:w-auto px-4 py-2.5 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePermissions}
            disabled={isSaving}
            className="w-full sm:w-auto px-4 py-2.5 min-h-[40px] rounded-md text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#FF3000' }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface InviteNewClientModalProps {
  onClose: () => void;
  onInviteSuccess: () => void;
}

function InviteNewClientModal({ onClose, onInviteSuccess }: InviteNewClientModalProps) {
  const { showToast } = useToast();
  const [rcNumber, setRcNumber] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [companyExists, setCompanyExists] = useState<boolean | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');

  const handleCheckCompany = async () => {
    if (!rcNumber.trim()) {
      showToast('error', 'RC Number Required', 'Please enter an RC number');
      return;
    }

    setIsChecking(true);
    // Simulate API call to check if company exists
    setTimeout(() => {
      // Mock logic - in real implementation, this would check the database
      const exists = Math.random() > 0.5; // Random for demo
      setCompanyExists(exists);
      setCompanyName(exists ? 'Example Company Ltd' : '');
      setIsChecking(false);
      setStep('confirm'); // Always go to confirm step
    }, 1000);
  };

  const handleSendInvitation = () => {
    // Simulate sending invitation
    setTimeout(() => {
      onInviteSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Invite New Client</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 'enter' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="rc-number"
                  className="block mb-2"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Client RC Number
                </label>
                <input
                  id="rc-number"
                  type="text"
                  value={rcNumber}
                  onChange={(e) => setRcNumber(e.target.value)}
                  placeholder="e.g., RC1234567"
                  className="w-full px-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
                  style={{ fontSize: '14px' }}
                />
                <p className="caption text-muted-foreground mt-2">
                  Enter the client's RC number to check if they're already registered on ClearPass.
                </p>
              </div>

              <button
                onClick={handleCheckCompany}
                disabled={isChecking || !rcNumber.trim()}
                className="w-full px-4 py-2 min-h-[44px] rounded-md text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#FF3000' }}
              >
                {isChecking ? 'Checking...' : 'Check Company'}
              </button>
            </div>
          )}

          {step === 'confirm' && companyExists && (
            <div className="space-y-4">
              <div className="bg-muted rounded-md p-4">
                <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Company Already Registered
                </p>
                <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                  <strong>{companyName}</strong> is already registered on ClearPass.
                </p>
                <p className="text-muted-foreground" style={{ fontSize: '14px', marginTop: '8px' }}>
                  We'll send an access request to their primary account holder.
                </p>
              </div>

              <button
                onClick={handleSendInvitation}
                className="w-full px-4 py-2 min-h-[44px] rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FF3000' }}
              >
                Send Access Request
              </button>
            </div>
          )}

          {step === 'confirm' && !companyExists && (
            <div className="space-y-4">
              <div className="bg-muted rounded-md p-4">
                <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Company Not Registered
                </p>
                <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                  This RC number is not yet registered on ClearPass.
                </p>
                <p className="text-muted-foreground" style={{ fontSize: '14px', marginTop: '8px' }}>
                  We'll send a registration invitation to the company with your consultant referral.
                </p>
              </div>

              <button
                onClick={handleSendInvitation}
                className="w-full px-4 py-2 min-h-[44px] rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FF3000' }}
              >
                Send Registration Invitation
              </button>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={() => {
              if (step === 'confirm') {
                setStep('enter');
                setCompanyExists(null);
              } else {
                onClose();
              }
            }}
            className="w-full px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
          >
            {step === 'confirm' ? 'Back' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
