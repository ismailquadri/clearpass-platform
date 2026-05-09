import { Search, Filter, Plus, Download } from 'lucide-react';
import { useState } from 'react';
import { CertificateCard } from './CertificateCard';
import { CertificateDetailModal } from './CertificateDetailModal';

export function CertificatesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expiring' | 'expired'>(
    'all'
  );
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  const allCertificates = [
    {
      name: 'National Health Insurance Authority Certificate',
      shortName: 'NHIA',
      status: 'active' as const,
      daysToExpiry: 245,
      expiryDate: '15 Jan 2027',
      certificateNumber: 'NHIA/2026/FCT/AB12345678',
      isApiVerified: true,
      issuingAuthority: 'National Health Insurance Authority',
      issuedDate: '15 Jan 2026',
    },
    {
      name: 'Pension Clearance Certificate',
      shortName: 'PCC',
      status: 'expiring-soon' as const,
      daysToExpiry: 28,
      expiryDate: '05 Jun 2026',
      certificateNumber: 'PCC/2025/LAG/CD98765432',
      isApiVerified: true,
      issuingAuthority: 'National Pension Commission',
      issuedDate: '05 Jun 2025',
    },
    {
      name: 'Nigeria Social Insurance Trust Fund',
      shortName: 'NSITF',
      status: 'expiring-urgent' as const,
      daysToExpiry: 6,
      expiryDate: '15 May 2026',
      certificateNumber: 'NSITF/2025/EF45612378',
      isApiVerified: false,
      issuingAuthority: 'Nigeria Social Insurance Trust Fund',
      issuedDate: '15 May 2025',
    },
    {
      name: 'Federal Inland Revenue Service Tax Clearance',
      shortName: 'FIRS TCC',
      status: 'active' as const,
      daysToExpiry: 189,
      expiryDate: '14 Nov 2026',
      certificateNumber: 'TCC/2026/LAG/GH78945612',
      isApiVerified: true,
      issuingAuthority: 'Federal Inland Revenue Service',
      issuedDate: '14 Nov 2025',
    },
    {
      name: 'Bureau of Public Procurement Certificate',
      shortName: 'BPP',
      status: 'active' as const,
      daysToExpiry: 312,
      expiryDate: '16 Mar 2027',
      certificateNumber: 'BPP/2026/IJ12378945',
      isApiVerified: true,
      issuingAuthority: 'Bureau of Public Procurement',
      issuedDate: '16 Mar 2026',
    },
    {
      name: 'Industrial Training Fund Certificate',
      shortName: 'ITF',
      status: 'pending' as const,
      expiryDate: 'Pending',
      certificateNumber: 'ITF/2026/KL96325874',
      isApiVerified: false,
      issuingAuthority: 'Industrial Training Fund',
      issuedDate: '20 Apr 2026',
    },
  ];

  const filteredCertificates = allCertificates.filter((cert) => {
    const matchesSearch =
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificateNumber?.toLowerCase().includes(searchQuery.toLowerCase());

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

  const activeCount = allCertificates.filter((c) => c.status === 'active').length;
  const expiringCount = allCertificates.filter(
    (c) =>
      c.status === 'expiring-soon' ||
      c.status === 'expiring-critical' ||
      c.status === 'expiring-urgent'
  ).length;
  const pendingCount = allCertificates.filter(
    (c) => c.status === 'pending' || c.status === 'not-connected'
  ).length;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 style={{ fontSize: '32px' }}>My Certificates</h1>
            <button
              className="px-4 py-2 rounded-md text-white flex items-center gap-2"
              style={{ backgroundColor: 'rgb(251, 115, 25)' }}
            >
              <Plus className="w-5 h-5" />
              Add Certificate
            </button>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Manage all your compliance certificates in one place
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Total Certificates</p>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>{allCertificates.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Active</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(31, 193, 107)' }}>
              {activeCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Expiring Soon</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(250, 115, 25)' }}>
              {expiringCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Pending</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(92, 92, 92)' }}>
              {pendingCount}
            </p>
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
                placeholder="Search certificates..."
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-md"
                style={{ fontSize: '14px' }}
              />
            </div>
            <div className="flex gap-2 p-1 bg-muted rounded-md">
              {(['all', 'active', 'expiring', 'expired'] as const).map((status) => (
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
            <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredCertificates.map((cert, index) => (
            <div
              key={index}
              onClick={() => setSelectedCertificate(cert)}
              className="cursor-pointer"
            >
              <CertificateCard {...cert} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCertificates.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2" style={{ fontSize: '18px', fontWeight: '500' }}>
              No Certificates Found
            </h3>
            <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Certificate Detail Modal */}
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
