import { Users, Search, Plus, AlertCircle, TrendingUp, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PartnerCertificateUploadModal } from './PartnerCertificateUploadModal';
import { useToast } from './ToastProvider';
import { usePartnerClients } from '../api';
import type { ClientStatus, PartnerClient } from '../api';
import { ApiState, EmptyState } from './ui';
import { TableSkeleton } from './ui/Skeleton';

type ClientFilter = 'all' | ClientStatus;

export function PartnerClientsView() {
  const { showToast } = useToast();
  const clientsQuery = usePartnerClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ClientFilter>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
              onUploadCertificate={() => {
                setIsUploadModalOpen(true);
                showToast('success', 'Upload Certificate', 'Opening certificate upload form...');
              }}
              onAddClient={() =>
                showToast('success', 'Add Client', 'Opening new client registration form...')
              }
              onViewDashboard={() =>
                showToast('success', 'Client Dashboard', 'Opening client compliance dashboard...')
              }
              onManage={() =>
                showToast('success', 'Client Management', 'Opening client management panel...')
              }
            />
          )}
        </ApiState>
      </div>

      <PartnerCertificateUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}

interface ClientsContentProps {
  clients: PartnerClient[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: ClientFilter;
  setFilterStatus: (f: ClientFilter) => void;
  onUploadCertificate: () => void;
  onAddClient: () => void;
  onViewDashboard: () => void;
  onManage: () => void;
}

function ClientsContent({
  clients,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  onUploadCertificate,
  onAddClient,
  onViewDashboard,
  onManage,
}: ClientsContentProps) {
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return clients.filter((c) => {
      const matchesSearch =
        !q || c.companyName.toLowerCase().includes(q) || c.rcNumber.toLowerCase().includes(q);
      const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchQuery, filterStatus]);

  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyFee, 0);
  const criticalClients = clients.filter((c) => c.status === 'critical').length;
  const attentionClients = clients.filter((c) => c.status === 'attention').length;

  return (
    <>
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h1 style={{ fontSize: '28px' }} className="sm:text-[32px]">
            My Clients
          </h1>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard
          label="Total Clients"
          value={clients.length.toString()}
          subtitle="+2 this month"
          icon={Users}
        />
        <KpiCard
          label="Monthly Revenue"
          value={`₦${(totalRevenue / 1000).toFixed(0)}k`}
          subtitle="Per month"
          icon={TrendingUp}
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
        </div>
      </div>

      {filtered.length === 0 ? (
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
        <div className="space-y-3">
          {filtered.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              onViewDashboard={onViewDashboard}
              onManage={onManage}
            />
          ))}
        </div>
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
  onViewDashboard,
  onManage,
}: {
  client: PartnerClient;
  onViewDashboard: () => void;
  onManage: () => void;
}) {
  const statusConfig = getStatusConfig(client.status);
  const expiryColor =
    client.daysToExpiry < 0 ? '#FF3000' : client.daysToExpiry < 15 ? '#FF3000' : 'inherit';

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
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
        <div className="flex gap-2 lg:ml-6">
          <button
            onClick={onViewDashboard}
            className="flex-1 lg:flex-initial px-4 py-2 min-h-[40px] rounded-md border border-border hover:bg-muted transition-colors"
          >
            View Dashboard
          </button>
          <button
            onClick={onManage}
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
