import { Search, Upload, Download, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { VendorVerificationModal } from './VendorVerificationModal';
import { useToast } from './ToastProvider';

interface VerificationResult {
  rcNumber: string;
  companyName: string;
  score: number;
  status: 'procurement-ready' | 'attention-required' | 'ineligible';
  lastVerified: string;
  certificates: {
    name: string;
    status: 'active' | 'expired' | 'expiring';
    expiryDate: string;
  }[];
}

export function MDAVerifyView() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const mockResults: VerificationResult[] = [
    {
      rcNumber: 'RC1234567',
      companyName: 'TechBuild Nigeria Ltd',
      score: 73,
      status: 'attention-required',
      lastVerified: '9 May 2026, 10:23 AM',
      certificates: [
        { name: 'NHIA', status: 'active', expiryDate: '15 Jan 2027' },
        { name: 'PCC', status: 'expiring', expiryDate: '05 Jun 2026' },
        { name: 'NSITF', status: 'expiring', expiryDate: '15 May 2026' },
        { name: 'FIRS', status: 'active', expiryDate: '14 Nov 2026' },
        { name: 'BPP', status: 'active', expiryDate: '16 Mar 2027' },
        { name: 'ITF', status: 'active', expiryDate: '18 Dec 2026' },
      ],
    },
    {
      rcNumber: 'RC7654321',
      companyName: 'BuildCo Construction Ltd',
      score: 92,
      status: 'procurement-ready',
      lastVerified: '9 May 2026, 10:23 AM',
      certificates: [
        { name: 'NHIA', status: 'active', expiryDate: '20 Feb 2027' },
        { name: 'PCC', status: 'active', expiryDate: '15 Jan 2027' },
        { name: 'NSITF', status: 'active', expiryDate: '10 Dec 2026' },
        { name: 'FIRS', status: 'active', expiryDate: '25 Nov 2026' },
        { name: 'BPP', status: 'active', expiryDate: '08 Apr 2027' },
        { name: 'ITF', status: 'active', expiryDate: '12 Jan 2027' },
      ],
    },
    {
      rcNumber: 'RC9876543',
      companyName: 'Alpha Services Ltd',
      score: 28,
      status: 'ineligible',
      lastVerified: '9 May 2026, 10:23 AM',
      certificates: [
        { name: 'NHIA', status: 'expired', expiryDate: '15 Mar 2026' },
        { name: 'PCC', status: 'expired', expiryDate: '20 Apr 2026' },
        { name: 'NSITF', status: 'expiring', expiryDate: '12 May 2026' },
        { name: 'FIRS', status: 'active', expiryDate: '03 Jun 2026' },
        { name: 'BPP', status: 'active', expiryDate: '12 Oct 2026' },
        { name: 'ITF', status: 'expired', expiryDate: '05 Apr 2026' },
      ],
    },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setVerificationResults(mockResults);
      setIsSearching(false);
    }, 800);
  };

  const handleBulkUpload = () => {
    showToast('info', 'Bulk Upload', 'Bulk upload feature coming soon. Contact support for assistance.');
  };

  const getStatusConfig = (status: VerificationResult['status']) => {
    switch (status) {
      case 'procurement-ready':
        return {
          icon: CheckCircle2,
          color: 'rgb(31, 193, 107)',
          bgColor: 'rgb(31, 193, 107, 0.1)',
          label: 'Procurement Ready',
        };
      case 'attention-required':
        return {
          icon: AlertTriangle,
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          label: 'Attention Required',
        };
      case 'ineligible':
        return {
          icon: XCircle,
          color: 'rgb(251, 55, 72)',
          bgColor: 'rgb(251, 55, 72, 0.1)',
          label: 'Ineligible to Bid',
        };
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2" style={{ fontSize: '32px' }}>Verify Vendors</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Real-time compliance verification for procurement pre-qualification
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                RC Number or Company Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter RC number (e.g., RC1234567)"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-md"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-6 py-3 rounded-md text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'rgb(251, 115, 25)' }}
              >
                <Search className="w-5 h-5" />
                Quick Verify
              </button>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-3 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search List'}
              </button>
              <button
                onClick={handleBulkUpload}
                className="px-6 py-3 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Bulk Upload
              </button>
            </div>
          </div>
          <p className="caption text-muted-foreground">
            Search for single vendor or upload CSV file with multiple RC numbers for batch verification
          </p>
        </div>

        {/* Quick Stats */}
        {verificationResults.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="caption text-muted-foreground mb-1">Total Verified</p>
              <p style={{ fontSize: '24px', fontWeight: '600' }}>{verificationResults.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="caption text-muted-foreground mb-1">Procurement Ready</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: 'rgb(31, 193, 107)' }}>
                {verificationResults.filter((r) => r.status === 'procurement-ready').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="caption text-muted-foreground mb-1">Attention Required</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: 'rgb(250, 115, 25)' }}>
                {verificationResults.filter((r) => r.status === 'attention-required').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="caption text-muted-foreground mb-1">Ineligible</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: 'rgb(251, 55, 72)' }}>
                {verificationResults.filter((r) => r.status === 'ineligible').length}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {verificationResults.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '20px' }}>Verification Results</h3>
              <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>

            <div className="space-y-4">
              {verificationResults.map((result, index) => {
                const statusConfig = getStatusConfig(result.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 style={{ fontSize: '18px', fontWeight: '500' }}>
                            {result.companyName}
                          </h4>
                          <span
                            className="px-3 py-1 rounded-full flex items-center gap-2"
                            style={{
                              backgroundColor: statusConfig.bgColor,
                              color: statusConfig.color,
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span style={{ fontSize: '14px' }}>RC: {result.rcNumber}</span>
                          <span className="caption">•</span>
                          <span className="caption">Last verified: {result.lastVerified}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="caption text-muted-foreground mb-1">Compliance Score</p>
                        <p
                          style={{
                            fontSize: '32px',
                            fontWeight: '600',
                            color: statusConfig.color,
                          }}
                        >
                          {result.score}
                          <span style={{ fontSize: '16px', fontWeight: '400' }}>/100</span>
                        </p>
                      </div>
                    </div>

                    {/* Certificate Grid */}
                    <div className="grid grid-cols-6 gap-3 pt-4 border-t border-border">
                      {result.certificates.map((cert, certIndex) => {
                        const certStatusColor =
                          cert.status === 'active'
                            ? 'rgb(31, 193, 107)'
                            : cert.status === 'expiring'
                            ? 'rgb(250, 115, 25)'
                            : 'rgb(251, 55, 72)';
                        const certStatusBg =
                          cert.status === 'active'
                            ? 'rgb(31, 193, 107, 0.1)'
                            : cert.status === 'expiring'
                            ? 'rgb(250, 115, 25, 0.1)'
                            : 'rgb(251, 55, 72, 0.1)';

                        return (
                          <div
                            key={certIndex}
                            className="px-3 py-2 rounded-md"
                            style={{ backgroundColor: certStatusBg }}
                          >
                            <p
                              style={{
                                fontSize: '12px',
                                fontWeight: '500',
                                color: certStatusColor,
                              }}
                            >
                              {cert.name}
                            </p>
                            <p className="caption text-muted-foreground mt-1">
                              {cert.expiryDate}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                        View Full Report
                      </button>
                      <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                        Download PDF
                      </button>
                      <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                        Add to Pre-Qualification List
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {verificationResults.length === 0 && !isSearching && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2" style={{ fontSize: '18px', fontWeight: '500' }}>
              No Verification Results
            </h3>
            <p className="text-muted-foreground mb-6" style={{ fontSize: '14px' }}>
              Enter an RC number or company name to verify vendor compliance status
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-left">
                <p style={{ fontSize: '14px', fontWeight: '500' }}>Try searching:</p>
                <p className="caption text-muted-foreground">RC1234567</p>
                <p className="caption text-muted-foreground">TechBuild Nigeria Ltd</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      <VendorVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
}
