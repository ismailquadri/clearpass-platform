import { Search, Filter, Plus, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CertificateCard } from './CertificateCard';
import { CertificateDetailModal } from './CertificateDetailModal';
import { useToast } from './ToastProvider';
import { useCertificates } from '../api';
import type { Certificate } from '../api';
import { ApiState, EmptyState } from './ui';
import { CertificateGridSkeleton } from './ui/Skeleton';

type StatusFilter = 'all' | 'active' | 'expiring' | 'expired';

export function CertificatesView() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(
    null
  );

  const certificatesQuery = useCertificates();

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <h1 style={{ fontSize: '28px' }} className="sm:text-[32px]">
              My Certificates
            </h1>
            <button
              onClick={() =>
                showToast(
                  'success',
                  'Upload Certificate',
                  'Opening certificate upload form...'
                )
              }
              className="px-4 py-2 rounded-md text-white flex items-center justify-center gap-2 min-h-[44px] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FF3000' }}
              aria-label="Add new certificate"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span>Add Certificate</span>
            </button>
          </div>
          <p
            className="text-muted-foreground"
            style={{ fontSize: '16px' }}
          >
            Manage all your compliance certificates in one place
          </p>
        </header>

        <ApiState
          query={certificatesQuery}
          loading={
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-lg p-5 animate-pulse"
                  >
                    <div className="h-3 w-24 bg-muted rounded mb-3" />
                    <div className="h-8 w-16 bg-muted rounded" />
                  </div>
                ))}
              </div>
              <CertificateGridSkeleton count={6} />
            </div>
          }
        >
          {(allCertificates) => (
            <CertificatesContent
              certificates={allCertificates}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onSelectCertificate={setSelectedCertificate}
              onExport={() =>
                showToast(
                  'success',
                  'Export Started',
                  'Downloading all certificates as PDF bundle...'
                )
              }
            />
          )}
        </ApiState>
      </div>

      {selectedCertificate && (
        <CertificateDetailModal
          isOpen={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          certificate={selectedCertificate}
        />
      )}
    </div>
  );
}

interface CertificatesContentProps {
  certificates: Certificate[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: StatusFilter;
  setFilterStatus: (f: StatusFilter) => void;
  onSelectCertificate: (c: Certificate) => void;
  onExport: () => void;
}

function CertificatesContent({
  certificates,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  onSelectCertificate,
  onExport,
}: CertificatesContentProps) {
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return certificates.filter((cert) => {
      const matchesSearch =
        !q ||
        cert.name.toLowerCase().includes(q) ||
        cert.shortName.toLowerCase().includes(q) ||
        cert.certificateNumber?.toLowerCase().includes(q);

      const matchesFilter =
        filterStatus === 'all' ||
        (filterStatus === 'active' && cert.status === 'active') ||
        (filterStatus === 'expiring' &&
          (cert.status === 'expiring-soon' ||
            cert.status === 'expiring-critical' ||
            cert.status === 'expiring-urgent')) ||
        (filterStatus === 'expired' && cert.status === 'expired');

      return matchesSearch && matchesFilter;
    });
  }, [certificates, searchQuery, filterStatus]);

  const counts = useMemo(() => {
    return {
      total: certificates.length,
      active: certificates.filter((c) => c.status === 'active').length,
      expiring: certificates.filter(
        (c) =>
          c.status === 'expiring-soon' ||
          c.status === 'expiring-critical' ||
          c.status === 'expiring-urgent'
      ).length,
      pending: certificates.filter(
        (c) => c.status === 'pending' || c.status === 'not-connected'
      ).length,
    };
  }, [certificates]);

  return (
    <>
      <section
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
        aria-labelledby="cert-stats-heading"
      >
        <div className="sr-only" id="cert-stats-heading">
          Certificate Statistics
        </div>
        <StatCard label="Total Certificates" value={counts.total} />
        <StatCard label="Active" value={counts.active} color="#FF3000" />
        <StatCard
          label="Expiring Soon"
          value={counts.expiring}
          color="#FF3000"
        />
        <StatCard label="Pending" value={counts.pending} color="rgb(92, 92, 92)" />
      </section>

      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <label htmlFor="certificates-search" className="sr-only">
              Search certificates
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="certificates-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates..."
              className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-input-background border border-border rounded-md"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div
            className="flex flex-wrap gap-1 p-1 bg-muted rounded-md overflow-x-auto"
            role="group"
            aria-label="Certificate status filters"
          >
            {(['all', 'active', 'expiring', 'expired'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                aria-pressed={filterStatus === status}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors min-h-[40px] whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-card shadow-sm'
                    : 'hover:bg-card/50'
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
          <button
            onClick={onExport}
            className="px-4 py-2 min-h-[44px] rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No Certificates Found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-labelledby="certificates-list-heading"
        >
          <h2 id="certificates-list-heading" className="sr-only">
            Certificates List
          </h2>
          {filtered.map((cert) => (
            <article key={cert.id}>
              <button
                onClick={() => onSelectCertificate(cert)}
                className="cursor-pointer text-left w-full bg-transparent border-0 p-0"
                type="button"
                aria-label={`View ${cert.name}`}
              >
                <CertificateCard
                  name={cert.name}
                  shortName={cert.shortName}
                  status={cert.status}
                  daysToExpiry={cert.daysToExpiry}
                  expiryDate={cert.expiryDate}
                  certificateNumber={cert.certificateNumber}
                  isApiVerified={cert.isApiVerified}
                />
              </button>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <p className="caption text-muted-foreground mb-1">{label}</p>
      <p style={{ fontSize: '28px', fontWeight: 600, color: color ?? undefined }}>
        {value}
      </p>
    </div>
  );
}
