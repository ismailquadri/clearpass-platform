import { Search, CheckCircle2, XCircle, AlertTriangle, Building2, FileText } from 'lucide-react';
import { useState } from 'react';

export function BusinessVerifyView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleVerify = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      // Mock result
      setVerificationResult({
        rcNumber: searchQuery,
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
      });
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2" style={{ fontSize: '32px' }}>Verify Company</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Check compliance status of potential partners and subcontractors
          </p>
        </div>

        {/* Info Banner */}
        <div
          className="px-4 py-3 rounded-lg border border-[#e5e5e5] flex items-start gap-3 mb-6"
          style={{
            backgroundColor: 'rgb(71, 194, 255, 0.1)',
          }}
        >
          <Building2 className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(71, 194, 255)' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'rgb(71, 194, 255)' }}>
              Public Verification Service
            </p>
            <p className="caption text-muted-foreground mt-1">
              Verify any Nigerian company's compliance status using their RC number. All
              verifications are logged and audit-ready.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <label className="block mb-3" style={{ fontSize: '14px', fontWeight: '500' }}>
            Company RC Number
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="Enter RC number (e.g., RC1234567)"
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-md"
                style={{ fontSize: '16px' }}
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-3 rounded-md text-white flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'rgb(251, 115, 25)' }}
            >
              <Search className="w-5 h-5" />
              {isSearching ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          <p className="caption text-muted-foreground mt-3">
            Enter the company's RC (Registration Certificate) number to check their compliance
            status
          </p>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="bg-card border border-border rounded-lg p-6">
            {/* Company Header */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 style={{ fontSize: '24px', fontWeight: '600' }}>
                    {verificationResult.companyName}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full flex items-center gap-2"
                    style={{
                      backgroundColor: 'rgb(31, 193, 107, 0.1)',
                      color: 'rgb(31, 193, 107)',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Procurement Ready
                  </span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span style={{ fontSize: '14px' }}>RC: {verificationResult.rcNumber}</span>
                  <span className="caption">•</span>
                  <span className="caption">Verified: {verificationResult.lastVerified}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="caption text-muted-foreground mb-1">Compliance Score</p>
                <p
                  style={{
                    fontSize: '48px',
                    fontWeight: '600',
                    color: 'rgb(31, 193, 107)',
                    lineHeight: '1',
                  }}
                >
                  {verificationResult.score}
                  <span style={{ fontSize: '20px', fontWeight: '400' }}>/100</span>
                </p>
              </div>
            </div>

            {/* Certificate Status Grid */}
            <div className="mb-6">
              <h4 className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>
                Certificate Status
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {verificationResult.certificates.map((cert: any, index: number) => {
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

                  const StatusIcon =
                    cert.status === 'active'
                      ? CheckCircle2
                      : cert.status === 'expiring'
                      ? AlertTriangle
                      : XCircle;

                  return (
                    <div
                      key={index}
                      className="px-4 py-3 rounded-md border"
                      style={{ backgroundColor: certStatusBg, borderColor: certStatusColor }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <StatusIcon className="w-4 h-4" style={{ color: certStatusColor }} />
                        <p style={{ fontSize: '14px', fontWeight: '500', color: certStatusColor }}>
                          {cert.name}
                        </p>
                      </div>
                      <p className="caption text-muted-foreground">{cert.expiryDate}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Notice */}
            <div
              className="px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'rgb(71, 194, 255, 0.1)' }}
            >
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgb(71, 194, 255)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: 'rgb(71, 194, 255)' }}>
                    Verification Audit Trail
                  </p>
                  <p className="caption text-muted-foreground mt-1">
                    This verification was performed by ClearPass at {verificationResult.lastVerified}
                    . Results are current as of verification time and may change as certificates
                    expire or are renewed.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                Download Verification Report
              </button>
              <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                Email Report
              </button>
              <button
                onClick={() => setVerificationResult(null)}
                className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors ml-auto"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!verificationResult && !isSearching && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2" style={{ fontSize: '18px', fontWeight: '500' }}>
              No Verification Results
            </h3>
            <p className="text-muted-foreground mb-6" style={{ fontSize: '14px' }}>
              Enter a company RC number to verify their compliance status
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-left">
                <p style={{ fontSize: '14px', fontWeight: '500' }}>Try searching:</p>
                <p className="caption text-muted-foreground">RC1234567</p>
                <p className="caption text-muted-foreground">RC7654321</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
