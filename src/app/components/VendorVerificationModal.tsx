import {
  X,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  Shield,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from './ToastProvider';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { openVerificationReport } from '../utils/reportGenerator';
import { verifyVendor } from '../api';
import type { VendorVerification } from '../api';
import '../../app/styles/mda-theme.css';

interface VendorVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onVerified?: (result: VendorVerification) => void;
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

export function VendorVerificationModal({
  isOpen,
  onClose,
  initialQuery = '',
  onVerified,
}: VendorVerificationModalProps) {
  const { showToast } = useToast();
  const [rcNumber, setRcNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoVerifiedQueryRef = useRef('');

  const runVerification = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      setError(null);

      if (!trimmed) {
        setError('Please enter an RC number or company name to verify');
        return;
      }

      const rcPattern = /^RC\d{7,}$/i;
      const looksLikeRc = /^RC/i.test(trimmed);
      if (looksLikeRc && !rcPattern.test(trimmed)) {
        setError('Please enter a valid RC number (e.g., RC1234567)');
        return;
      }
      if (!looksLikeRc && trimmed.length < 3) {
        setError('Enter at least 3 characters for company name search');
        return;
      }

      setIsVerifying(true);
      try {
        const result = await verifyVendor(trimmed);
        setVerificationResult(toModalResult(result));
        onVerified?.(result);
        showToast('success', 'Vendor Found', `Successfully verified ${result.companyName}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to verify vendor';
        setVerificationResult(null);
        setError(message);
        showToast('error', 'Verification Failed', message);
      } finally {
        setIsVerifying(false);
      }
    },
    [onVerified, showToast]
  );

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isVerifying) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, isVerifying, onClose]);

  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) {
      autoVerifiedQueryRef.current = '';
      return;
    }
    const trimmed = initialQuery.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRcNumber(trimmed);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVerificationResult(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);

    if (trimmed && autoVerifiedQueryRef.current !== trimmed) {
      autoVerifiedQueryRef.current = trimmed;
      void runVerification(trimmed);
    }
    // Only reset/auto-run when the modal open state or incoming query changes.
    // Including runVerification here causes toast/provider re-renders to clear the fresh result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleVerify = () => {
    autoVerifiedQueryRef.current = rcNumber.trim();
    void runVerification(rcNumber);
  };

  const handleDownloadReport = () => {
    if (!verificationResult) return;
    openVerificationReport({
      companyName: verificationResult.companyName,
      rcNumber: verificationResult.rcNumber,
      score: verificationResult.complianceScore,
      status: verificationResult.status === 'non-compliant' ? 'ineligible' : verificationResult.status,
      certificates: verificationResult.certificates.map((c) => ({
        name: c.name,
        status: c.status,
        expiryDate: c.expiryDate ?? '',
      })),
      lastVerified: verificationResult.lastVerified,
      generatedBy: 'Dr. Bello Adamu',
    });
    showToast('success', 'Report Ready', `Verification report opened for ${verificationResult.companyName}`);
  };

  const handleReset = () => {
    setRcNumber('');
    setVerificationResult(null);
    setError(null);
    autoVerifiedQueryRef.current = '';
  };

  const getStatusConfig = (status: VerificationResult['status']) => {
    switch (status) {
      case 'procurement-ready':
        return {
          color: 'var(--mda-success)',
          bgColor: 'var(--mda-success-light)',
          label: 'Procurement Ready',
          icon: CheckCircle2,
        };
      case 'attention-required':
        return {
          color: 'var(--mda-warning)',
          bgColor: 'var(--mda-warning-light)',
          label: 'Attention Required',
          icon: AlertTriangle,
        };
      case 'non-compliant':
        return {
          color: 'var(--mda-error)',
          bgColor: 'var(--mda-error-light)',
          label: 'Non-Compliant',
          icon: XCircle,
        };
    }
  };

  const getCertStatusConfig = (status: 'active' | 'expired' | 'missing') => {
    switch (status) {
      case 'active':
        return { color: 'var(--mda-success)', label: 'Active', icon: CheckCircle2 };
      case 'expired':
        return { color: 'var(--mda-error)', label: 'Expired', icon: XCircle };
      case 'missing':
        return { color: 'rgb(92, 92, 92)', label: 'Missing', icon: AlertTriangle };
    }
  };

  const statusConfig = verificationResult ? getStatusConfig(verificationResult.status) : null;
  const StatusIcon = statusConfig?.icon;

  return (
    <>
      {/* Backdrop - non-focusable */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="bg-card rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--mda-bg-light)' }}
              >
                <Shield className="w-5 h-5" style={{ color: 'var(--mda-primary)' }} />
              </div>
              <div>
                <h2 id="modal-title" style={{ fontSize: '24px', fontWeight: '600' }}>
                  Vendor Verification
                </h2>
                <p
                  className="text-muted-foreground text-[#404040] mt-1"
                  style={{ fontSize: '14px' }}
                >
                  Verify vendor compliance status via RC number
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              autoFocus={!isVerifying}
              className="w-11 h-11 rounded-md hover:bg-muted flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Search Section */}
            <div className="mb-6">
              <label
                htmlFor="vendor-rc-input"
                className="block mb-2"
                style={{ fontSize: '13px', fontWeight: '500' }}
              >
                RC Number *
              </label>
              <div className="flex gap-3">
                <input
                  id="vendor-rc-input"
                  type="text"
                  value={rcNumber}
                  onChange={(e) => {
                    setRcNumber(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="e.g., RC1234567 or TechBuild"
                  required
                  disabled={isVerifying}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'vendor-rc-error' : undefined}
                  className={`flex-1 px-3 py-2 rounded-md border bg-background disabled:opacity-50 ${
                    error ? 'border-red-500' : 'border-border'
                  }`}
                  style={{ fontSize: '13px' }}
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || !rcNumber}
                  aria-live="polite"
                  aria-busy={isVerifying}
                  className="shrink-0 px-4 py-2 rounded-md text-white flex items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--mda-primary)', fontSize: '13px', fontWeight: '500' }}
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                      <span className="sr-only" aria-live="polite">
                        Verifying vendor information, please wait
                      </span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Verify
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p
                  id="vendor-rc-error"
                  className="text-red-500 text-sm mt-2 flex items-center gap-2"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </p>
              )}
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
                      <p
                        className="text-muted-foreground text-[#404040]"
                        style={{ fontSize: '13px' }}
                      >
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
                      <p
                        className="text-muted-foreground text-[#404040] mb-1"
                        style={{ fontSize: '11px' }}
                      >
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
                      <p
                        className="text-muted-foreground text-[#404040] mb-1"
                        style={{ fontSize: '11px' }}
                      >
                        CAC Status
                      </p>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--mda-success)' }} />
                        <p
                          style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: 'var(--mda-success)',
                          }}
                        >
                          Verified
                        </p>
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-muted-foreground text-[#404040] mb-1"
                        style={{ fontSize: '11px' }}
                      >
                        Last Verified
                      </p>
                      <p style={{ fontSize: '13px', fontWeight: '500' }}>
                        {verificationResult.lastVerified}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                <div>
                  <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>
                    Certificate Status
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <p
                              className="text-muted-foreground text-[#404040]"
                              style={{ fontSize: '11px' }}
                            >
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
                <div className="px-4 py-3 rounded-lg border border-[var(--mda-border-light)] bg-[var(--mda-bg-light)]">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--mda-primary)' }} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--mda-primary)' }}>
                        Official Verification Record
                      </p>
                      <p
                        className="text-muted-foreground text-[#404040] mt-1"
                        style={{ fontSize: '13px' }}
                      >
                        This verification has been logged in the MDA audit trail. You can download
                        an official report for your records.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              {verificationResult ? (
                <>
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
                    style={{ fontSize: '13px' }}
                  >
                    Verify Another
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-md text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--mda-primary)', fontSize: '13px', fontWeight: '500' }}
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
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

function toModalResult(result: VendorVerification): VerificationResult {
  const today = Date.now();

  return {
    companyName: result.companyName,
    rcNumber: result.rcNumber,
    complianceScore: result.score,
    status: result.status === 'ineligible' ? 'non-compliant' : result.status,
    certificates: result.certificates.map((cert) => {
      const expiry = new Date(cert.expiryDate);
      const daysToExpiry = Number.isNaN(expiry.getTime())
        ? undefined
        : Math.ceil((expiry.getTime() - today) / (1000 * 60 * 60 * 24));

      return {
        name: cert.name,
        status:
          cert.status === 'active'
            ? 'active'
            : cert.status === 'expired'
              ? 'expired'
              : 'missing',
        expiryDate: cert.expiryDate,
        daysToExpiry,
      };
    }),
    lastVerified: result.lastVerified,
    cacVerified: true,
  };
}
