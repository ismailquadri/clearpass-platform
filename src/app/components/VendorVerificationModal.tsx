import { X, Search, CheckCircle2, XCircle, AlertTriangle, Download, FileText, Shield } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface VendorVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VerificationResult {
  companyName: string;
  rcNumber: string;
  complianceScore: number;
  status: 'procurement-ready' | 'attention-required' | 'non-compliant';
  certificates: {
    name: string;
    status: 'active' | 'expired' | 'missing';
    expiryDate?: string;
    daysToExpiry?: number;
  }[];
  lastVerified: string;
  cacVerified: boolean;
}

export function VendorVerificationModal({ isOpen, onClose }: VendorVerificationModalProps) {
  const { showToast } = useToast();
  const [rcNumber, setRcNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!rcNumber || rcNumber.length < 6) {
      showToast('error', 'Invalid RC Number', 'Please enter a valid RC number');
      return;
    }

    setIsVerifying(true);

    // Simulate vendor verification
    setTimeout(() => {
      const mockResults: VerificationResult[] = [
        {
          companyName: 'TechBuild Nigeria Ltd',
          rcNumber: 'RC1234567',
          complianceScore: 73,
          status: 'attention-required',
          certificates: [
            { name: 'NHIA', status: 'active', expiryDate: '15 Jan 2027', daysToExpiry: 245 },
            { name: 'PCC', status: 'active', expiryDate: '05 Jun 2026', daysToExpiry: 28 },
            { name: 'NSITF', status: 'expired', expiryDate: '15 May 2026' },
            { name: 'FIRS TCC', status: 'active', expiryDate: '14 Nov 2026', daysToExpiry: 189 },
            { name: 'BPP', status: 'active', expiryDate: '16 Mar 2027', daysToExpiry: 312 },
            { name: 'ITF', status: 'missing' },
          ],
          lastVerified: '9 May 2026, 10:23 AM',
          cacVerified: true,
        },
        {
          companyName: 'GreenEnergy Solutions Ltd',
          rcNumber: 'RC7654321',
          complianceScore: 92,
          status: 'procurement-ready',
          certificates: [
            { name: 'NHIA', status: 'active', expiryDate: '20 Feb 2027', daysToExpiry: 280 },
            { name: 'PCC', status: 'active', expiryDate: '15 Aug 2026', daysToExpiry: 98 },
            { name: 'NSITF', status: 'active', expiryDate: '22 Sep 2026', daysToExpiry: 136 },
            { name: 'FIRS TCC', status: 'active', expiryDate: '10 Dec 2026', daysToExpiry: 215 },
            { name: 'BPP', status: 'active', expiryDate: '05 Apr 2027', daysToExpiry: 331 },
            { name: 'ITF', status: 'active', expiryDate: '18 Nov 2026', daysToExpiry: 193 },
          ],
          lastVerified: '9 May 2026, 9:45 AM',
          cacVerified: true,
        },
        {
          companyName: 'BuildCorp Infrastructure',
          rcNumber: 'RC9988776',
          complianceScore: 34,
          status: 'non-compliant',
          certificates: [
            { name: 'NHIA', status: 'expired', expiryDate: '15 Mar 2026' },
            { name: 'PCC', status: 'expired', expiryDate: '10 Apr 2026' },
            { name: 'NSITF', status: 'missing' },
            { name: 'FIRS TCC', status: 'missing' },
            { name: 'BPP', status: 'active', expiryDate: '25 Jul 2026', daysToExpiry: 77 },
            { name: 'ITF', status: 'missing' },
          ],
          lastVerified: '9 May 2026, 8:12 AM',
          cacVerified: true,
        },
      ];

      // Randomly select a result or show "not found"
      const found = Math.random() > 0.2;
      setIsVerifying(false);

      if (found) {
        const result = mockResults[Math.floor(Math.random() * mockResults.length)];
        setVerificationResult(result);
        showToast('success', 'Vendor Found', `Successfully verified ${result.companyName}`);
      } else {
        setVerificationResult(null);
        showToast('error', 'Vendor Not Found', 'No company found with this RC number');
      }
    }, 2000);
  };

  const handleDownloadReport = () => {
    if (verificationResult) {
      showToast('success', 'Report Downloaded', `Verification report for ${verificationResult.companyName}`);
    }
  };

  const handleReset = () => {
    setRcNumber('');
    setVerificationResult(null);
  };

  const getStatusConfig = (status: VerificationResult['status']) => {
    switch (status) {
      case 'procurement-ready':
        return {
          color: 'rgb(31, 193, 107)',
          bgColor: 'rgb(31, 193, 107, 0.1)',
          label: 'Procurement Ready',
          icon: CheckCircle2,
        };
      case 'attention-required':
        return {
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          label: 'Attention Required',
          icon: AlertTriangle,
        };
      case 'non-compliant':
        return {
          color: 'rgb(251, 55, 72)',
          bgColor: 'rgb(251, 55, 72, 0.1)',
          label: 'Non-Compliant',
          icon: XCircle,
        };
    }
  };

  const getCertStatusConfig = (status: 'active' | 'expired' | 'missing') => {
    switch (status) {
      case 'active':
        return { color: 'rgb(31, 193, 107)', label: 'Active', icon: CheckCircle2 };
      case 'expired':
        return { color: 'rgb(251, 55, 72)', label: 'Expired', icon: XCircle };
      case 'missing':
        return { color: 'rgb(92, 92, 92)', label: 'Missing', icon: AlertTriangle };
    }
  };

  const statusConfig = verificationResult ? getStatusConfig(verificationResult.status) : null;
  const StatusIcon = statusConfig?.icon;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgb(251, 115, 25, 0.1)' }}
              >
                <Shield className="w-5 h-5" style={{ color: '#fb7319' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Vendor Verification</h2>
                <p className="text-muted-foreground text-[#404040] mt-1" style={{ fontSize: '14px' }}>
                  Verify vendor compliance status via RC number
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Search Section */}
            <div className="mb-6">
              <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500' }}>
                RC Number
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={rcNumber}
                  onChange={(e) => setRcNumber(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="e.g., RC1234567"
                  disabled={isVerifying}
                  className="flex-1 px-3 py-2 rounded-md border border-border bg-background disabled:opacity-50"
                  style={{ fontSize: '13px' }}
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || !rcNumber}
                  className="px-4 py-2 rounded-md text-white flex items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: '#fb7319', fontSize: '13px', fontWeight: '500' }}
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verification Result */}
            {verificationResult && statusConfig && StatusIcon && (
              <div className="space-y-6">
                {/* Company Info */}
                <div className="bg-muted/50 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 style={{ fontSize: '20px', fontWeight: '600' }} className="mb-1">
                        {verificationResult.companyName}
                      </h3>
                      <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
                        RC Number: {verificationResult.rcNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full flex items-center gap-1.5"
                        style={{
                          backgroundColor: statusConfig.bgColor,
                          color: statusConfig.color,
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-muted-foreground text-[#404040] mb-1" style={{ fontSize: '11px' }}>
                        Compliance Score
                      </p>
                      <p
                        style={{
                          fontSize: '24px',
                          fontWeight: '600',
                          color: statusConfig.color,
                        }}
                      >
                        {verificationResult.complianceScore}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[#404040] mb-1" style={{ fontSize: '11px' }}>
                        CAC Status
                      </p>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" style={{ color: 'rgb(31, 193, 107)' }} />
                        <p style={{ fontSize: '13px', fontWeight: '500', color: 'rgb(31, 193, 107)' }}>
                          Verified
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[#404040] mb-1" style={{ fontSize: '11px' }}>
                        Last Verified
                      </p>
                      <p style={{ fontSize: '13px', fontWeight: '500' }}>{verificationResult.lastVerified}</p>
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                <div>
                  <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>
                    Certificate Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {verificationResult.certificates.map((cert, index) => {
                      const certConfig = getCertStatusConfig(cert.status);
                      const CertIcon = certConfig.icon;
                      return (
                        <div key={index} className="bg-card border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p style={{ fontSize: '13px', fontWeight: '500' }}>{cert.name}</p>
                            <span
                              className="px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{
                                backgroundColor: `${certConfig.color}20`,
                                color: certConfig.color,
                                fontSize: '11px',
                                fontWeight: '500',
                              }}
                            >
                              <CertIcon className="w-3 h-3" />
                              {certConfig.label}
                            </span>
                          </div>
                          {cert.expiryDate && (
                            <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '11px' }}>
                              {cert.status === 'active' ? 'Expires: ' : 'Expired: '}
                              {cert.expiryDate}
                              {cert.daysToExpiry && ` (${cert.daysToExpiry} days)`}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verification Note */}
                <div className="px-4 py-3 rounded-lg border border-[#e5e5e5] bg-[#c4edff] bg-opacity-30">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 flex-shrink-0" style={{ color: '#47c2ff' }} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#47c2ff' }}>
                        Official Verification Record
                      </p>
                      <p className="text-muted-foreground text-[#404040] mt-1" style={{ fontSize: '13px' }}>
                        This verification has been logged in the MDA audit trail. You can download an official report for your records.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-3 justify-end">
              {verificationResult ? (
                <>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
                    style={{ fontSize: '13px' }}
                  >
                    Verify Another
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="px-4 py-2 rounded-md text-white flex items-center gap-2"
                    style={{ backgroundColor: '#fb7319', fontSize: '13px', fontWeight: '500' }}
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
                  style={{ fontSize: '13px' }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
