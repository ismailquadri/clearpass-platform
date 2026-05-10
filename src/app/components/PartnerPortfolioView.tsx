import { Briefcase, TrendingUp, DollarSign, Users, AlertCircle, Building2, Calendar, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePartnerClients } from '../api';
import { ApiState, EmptyState } from './ui';
import { TableSkeleton } from './ui/Skeleton';

export function PartnerPortfolioView() {
  const clientsQuery = usePartnerClients();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ApiState query={clientsQuery} loading={<TableSkeleton rows={5} />}>
          {(clients) => <PortfolioContent clients={clients} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        </ApiState>
      </div>
    </div>
  );
}

interface PortfolioContentProps {
  clients: any[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

function PortfolioContent({ clients, searchQuery, setSearchQuery }: PortfolioContentProps) {
  // Filter clients by search query
  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(client =>
      client.companyName?.toLowerCase().includes(q) ||
      client.rcNumber?.toLowerCase().includes(q) ||
      client.sector?.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  if (filteredClients.length === 0 && searchQuery) {
    return (
      <EmptyState
        icon={Search}
        title="No Clients Found"
        description="Try adjusting your search query."
      />
    );
  }

  if (filteredClients.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No Clients in Portfolio"
        description="Start by adding clients to track their compliance and certificates."
      />
    );
  }

  // Portfolio-level aggregate metrics - always call hooks
  const totalMonthlyRevenue = useMemo(() => {
    return filteredClients.reduce((sum, c) => sum + c.monthlyFee, 0);
  }, [filteredClients]);

  const averageHealthScore = useMemo(() => {
    return filteredClients.length > 0
      ? Math.round(filteredClients.reduce((sum, c) => sum + c.score, 0) / filteredClients.length)
      : 0;
  }, [filteredClients]);

  const totalCertificates = useMemo(() => {
    return filteredClients.reduce((sum, c) => sum + c.totalCertificates, 0);
  }, [filteredClients]);

  const activeCertificates = useMemo(() => {
    return filteredClients.reduce((sum, c) => sum + c.activeCertificates, 0);
  }, [filteredClients]);

  // Sector distribution
  const sectorDistribution = useMemo(() => {
    const sectors: Record<string, number> = {};
    filteredClients.forEach(client => {
      const sector = client.sector || 'Other';
      sectors[sector] = (sectors[sector] || 0) + 1;
    });
    return Object.entries(sectors).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / filteredClients.length) * 100),
    })).sort((a, b) => b.count - a.count);
  }, [filteredClients]);

  // Sector performance (average score by sector)
  const sectorPerformance = useMemo(() => {
    const sectorScores: Record<string, { total: number; count: number }> = {};
    filteredClients.forEach(client => {
      const sector = client.sector || 'Other';
      if (!sectorScores[sector]) {
        sectorScores[sector] = { total: 0, count: 0 };
      }
      sectorScores[sector].total += client.score;
      sectorScores[sector].count += 1;
    });
    return Object.entries(sectorScores).map(([name, data]) => ({
      name,
      averageScore: Math.round(data.total / data.count),
      clientCount: data.count,
    })).sort((a, b) => b.averageScore - a.averageScore);
  }, [filteredClients]);

  // Renewal forecast (next 90 days)
  const renewalForecast = useMemo(() => {
    const now = new Date();
    const ninetyDaysLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    return filteredClients
      .filter(c => {
        const expiryDate = new Date(c.nextExpiry);
        return expiryDate > now && expiryDate <= ninetyDaysLater;
      })
      .map(c => ({
        ...c,
        estimatedRenewalCost: c.monthlyFee * 12, // Annual cost estimate
      }))
      .sort((a, b) => new Date(a.nextExpiry).getTime() - new Date(b.nextExpiry).getTime());
  }, [filteredClients]);

  const totalRenewalCost = renewalForecast.reduce((sum, c) => sum + c.estimatedRenewalCost, 0);

  // Growth metrics
  const newClientsThisMonth = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return filteredClients.filter(c => new Date(c.createdAt) >= oneMonthAgo).length;
  }, [filteredClients]);

  const atRiskClients = filteredClients.filter(c => c.status === 'critical' || c.status === 'attention').length;

  // Certificate health metrics
  const expiringSoonCertificates = useMemo(() => {
    return filteredClients.reduce((sum, c) => sum + (c.totalCertificates - c.activeCertificates), 0);
  }, [filteredClients]);

  const certificateHealthRate = useMemo(() => {
    return totalCertificates > 0 
      ? Math.round((activeCertificates / totalCertificates) * 100) 
      : 0;
  }, [totalCertificates, activeCertificates]);

  return (
    <>
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 style={{ fontSize: '28px' }} className="sm:text-[32px]">
              Portfolio Overview
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
              Aggregate performance and revenue across your client portfolio
            </p>
          </div>
          <div className="relative w-full sm:w-auto">
            <label htmlFor="portfolio-search" className="sr-only">
              Search clients
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="portfolio-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>
      </header>

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <PortfolioKpiCard
          label="Total Monthly Revenue"
          value={`₦${totalMonthlyRevenue.toLocaleString()}`}
          subtitle={`${clients.length} active clients`}
          icon={DollarSign}
          color="#FF3000"
        />
        <PortfolioKpiCard
          label="Portfolio Health Score"
          value={`${averageHealthScore}/100`}
          subtitle="Average across all clients"
          icon={TrendingUp}
          color={averageHealthScore >= 80 ? '#FF3000' : averageHealthScore >= 50 ? '#FFA500' : '#FF3000'}
        />
        <PortfolioKpiCard
          label="Certificate Health"
          value={`${certificateHealthRate}%`}
          subtitle={`${activeCertificates}/${totalCertificates} active`}
          icon={Briefcase}
          color={certificateHealthRate >= 80 ? '#FF3000' : certificateHealthRate >= 50 ? '#FFA500' : '#FF3000'}
        />
        <PortfolioKpiCard
          label="At-Risk Clients"
          value={atRiskClients.toString()}
          subtitle="Require immediate attention"
          icon={AlertCircle}
          color="#FF3000"
        />
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <PortfolioKpiCard
          label="New This Month"
          value={newClientsThisMonth.toString()}
          subtitle="Client acquisitions"
          icon={Users}
          color="#FF3000"
        />
        <PortfolioKpiCard
          label="Expiring Soon"
          value={expiringSoonCertificates.toString()}
          subtitle="Certificates need renewal"
          icon={Calendar}
          color="#FFA500"
        />
        <PortfolioKpiCard
          label="Renewal Value"
          value={`₦${totalRenewalCost.toLocaleString()}`}
          subtitle="Next 90 days forecast"
          icon={DollarSign}
          color="#FF3000"
        />
        <PortfolioKpiCard
          label="Top Sector"
          value={sectorDistribution[0]?.name || 'N/A'}
          subtitle={`${sectorDistribution[0]?.count || 0} clients`}
          icon={Building2}
          color="#FF3000"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sector Distribution */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
              Sector Distribution
            </h3>
            <Building2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {sectorDistribution.map((sector) => (
              <div key={sector.name}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{sector.name}</span>
                  <span className="caption text-muted-foreground">
                    {sector.count} clients ({sector.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${sector.percentage}%`,
                      backgroundColor: '#FF3000',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Performance */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
              Sector Performance
            </h3>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {sectorPerformance.map((sector) => (
              <div key={sector.name} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{sector.name}</p>
                  <p className="caption text-muted-foreground">{sector.clientCount} clients</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '18px', fontWeight: 600, color: sector.averageScore >= 80 ? '#FF3000' : sector.averageScore >= 50 ? '#FFA500' : '#FF3000' }}>
                    {sector.averageScore}/100
                  </p>
                  <p className="caption text-muted-foreground">Avg Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Renewal Forecast */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
              Renewal Forecast (Next 90 Days)
            </h3>
            <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
              Estimated renewal costs for upcoming certificate expirations
            </p>
          </div>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="mb-4 p-3 bg-muted rounded-md">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Total Estimated Renewal Cost</span>
            <span style={{ fontSize: '20px', fontWeight: 600, color: '#FF3000' }}>
              ₦{totalRenewalCost.toLocaleString()}
            </span>
          </div>
        </div>

        {renewalForecast.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Upcoming Renewals"
            description="No certificate renewals scheduled in the next 90 days."
          />
        ) : (
          <div className="space-y-3">
            {renewalForecast.slice(0, 10).map((client) => (
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
                  <p className="caption text-muted-foreground">
                    {client.daysToExpiry} days
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>
                    ₦{client.estimatedRenewalCost.toLocaleString()}
                  </p>
                  <p className="caption text-muted-foreground">Est. cost</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

interface PortfolioKpiCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: typeof DollarSign;
  color?: string;
}

function PortfolioKpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  color,
}: PortfolioKpiCardProps) {
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