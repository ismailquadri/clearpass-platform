import { Users, Search, Plus, AlertCircle, TrendingUp, Upload } from 'lucide-react';
import { useState } from 'react';
import { PartnerCertificateUploadModal } from './PartnerCertificateUploadModal';
import { useToast } from './ToastProvider';

interface Client {
  id: string;
  companyName: string;
  rcNumber: string;
  score: number;
  status: 'healthy' | 'attention' | 'critical';
  activeCertificates: number;
  totalCertificates: number;
  nextExpiry: string;
  daysToExpiry: number;
  monthlyFee: number;
}

export function PartnerClientsView() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'attention' | 'critical'>(
    'all'
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const mockClients: Client[] = [
    {
      id: '1',
      companyName: 'TechBuild Nigeria Ltd',
      rcNumber: 'RC1234567',
      score: 73,
      status: 'attention',
      activeCertificates: 5,
      totalCertificates: 6,
      nextExpiry: 'NSITF',
      daysToExpiry: 6,
      monthlyFee: 45000,
    },
    {
      id: '2',
      companyName: 'BuildCo Construction Ltd',
      rcNumber: 'RC7654321',
      score: 92,
      status: 'healthy',
      activeCertificates: 6,
      totalCertificates: 6,
      nextExpiry: 'FIRS',
      daysToExpiry: 89,
      monthlyFee: 65000,
    },
    {
      id: '3',
      companyName: 'Alpha Services Ltd',
      rcNumber: 'RC9876543',
      score: 28,
      status: 'critical',
      activeCertificates: 2,
      totalCertificates: 6,
      nextExpiry: 'NHIA',
      daysToExpiry: -55,
      monthlyFee: 45000,
    },
    {
      id: '4',
      companyName: 'ProServe Engineering',
      rcNumber: 'RC1122334',
      score: 88,
      status: 'healthy',
      activeCertificates: 6,
      totalCertificates: 6,
      nextExpiry: 'PCC',
      daysToExpiry: 112,
      monthlyFee: 55000,
    },
    {
      id: '5',
      companyName: 'Delta Logistics Ltd',
      rcNumber: 'RC5566778',
      score: 65,
      status: 'attention',
      activeCertificates: 4,
      totalCertificates: 6,
      nextExpiry: 'ITF',
      daysToExpiry: 18,
      monthlyFee: 45000,
    },
  ];

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.rcNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status: Client['status']) => {
    switch (status) {
      case 'healthy':
        return {
          color: 'rgb(31, 193, 107)',
          bgColor: 'rgb(31, 193, 107, 0.1)',
          label: 'Healthy',
        };
      case 'attention':
        return {
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          label: 'Attention',
        };
      case 'critical':
        return {
          color: 'rgb(251, 55, 72)',
          bgColor: 'rgb(251, 55, 72, 0.1)',
          label: 'Critical',
        };
    }
  };

  const totalRevenue = mockClients.reduce((sum, client) => sum + client.monthlyFee, 0);
  const criticalClients = mockClients.filter((c) => c.status === 'critical').length;
  const attentionClients = mockClients.filter((c) => c.status === 'attention').length;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 style={{ fontSize: '32px' }}>My Clients</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Certificate
              </button>
              <button
                className="px-4 py-2 rounded-md text-white flex items-center gap-2"
                style={{ backgroundColor: 'rgb(251, 115, 25)' }}
              >
                <Plus className="w-5 h-5" />
                Add Client
              </button>
            </div>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Managing {mockClients.length} corporate clients
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Total Clients
              </span>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>{mockClients.length}</p>
            <p className="caption text-green-600">+2 this month</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Monthly Revenue
              </span>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>
              ₦{(totalRevenue / 1000).toFixed(0)}k
            </p>
            <p className="caption text-muted-foreground">Per month</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Need Attention
              </span>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(250, 115, 25)' }}>
              {attentionClients}
            </p>
            <p className="caption text-muted-foreground">Expiring soon</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Critical Issues
              </span>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(251, 55, 72)' }}>
              {criticalClients}
            </p>
            <p className="caption text-muted-foreground">Require action</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients by name or RC number..."
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-md"
                style={{ fontSize: '14px' }}
              />
            </div>
            <div className="flex gap-2 p-1 bg-muted rounded-md">
              {(['all', 'healthy', 'attention', 'critical'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filterStatus === status ? 'bg-card shadow-sm' : 'hover:bg-card/50'
                  }`}
                  style={{
                    fontSize: '14px',
                    fontWeight: filterStatus === status ? '500' : '400',
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-3">
          {filteredClients.map((client) => {
            const statusConfig = getStatusConfig(client.status);

            return (
              <div
                key={client.id}
                className="bg-card border border-border rounded-lg p-5 transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 style={{ fontSize: '18px', fontWeight: '500' }}>{client.companyName}</h4>
                      <span
                        className="px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: statusConfig.bgColor,
                          color: statusConfig.color,
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="caption text-muted-foreground mb-4">{client.rcNumber}</p>

                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <p className="caption text-muted-foreground mb-1">Compliance Score</p>
                        <p
                          style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: statusConfig.color,
                          }}
                        >
                          {client.score}
                          <span style={{ fontSize: '14px', fontWeight: '400' }}>/100</span>
                        </p>
                      </div>
                      <div>
                        <p className="caption text-muted-foreground mb-1">Certificates</p>
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>
                          {client.activeCertificates}/{client.totalCertificates} Active
                        </p>
                      </div>
                      <div>
                        <p className="caption text-muted-foreground mb-1">Next Expiry</p>
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>
                          {client.nextExpiry}{' '}
                          <span
                            className="caption"
                            style={{
                              color:
                                client.daysToExpiry < 0
                                  ? 'rgb(251, 55, 72)'
                                  : client.daysToExpiry < 15
                                    ? 'rgb(250, 115, 25)'
                                    : 'inherit',
                            }}
                          >
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
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>
                          ₦{client.monthlyFee.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-6">
                    <button
                      onClick={() =>
                        showToast(
                          'info',
                          'Client Dashboard',
                          'Opening client compliance dashboard...'
                        )
                      }
                      className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
                    >
                      View Dashboard
                    </button>
                    <button
                      onClick={() =>
                        showToast('info', 'Client Management', 'Opening client management panel...')
                      }
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: 'rgb(251, 115, 25)' }}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2" style={{ fontSize: '18px', fontWeight: '500' }}>
              No Clients Found
            </h3>
            <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
              {searchQuery
                ? 'Try adjusting your search or filter'
                : 'Add your first client to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Certificate Upload Modal */}
      <PartnerCertificateUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
