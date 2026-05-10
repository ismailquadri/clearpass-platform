import { X, CheckCircle2, Clock, Download, Upload, RefreshCw, Eye } from 'lucide-react';
import { useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CertificateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    name: string;
    shortName: string;
    status: string;
    certificateNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
    daysToExpiry?: number;
    isApiVerified?: boolean;
    issuingAuthority?: string;
    documentUrl?: string;
  };
}

export function CertificateDetailModal({
  isOpen,
  onClose,
  certificate,
}: CertificateDetailModalProps) {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const modalRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    if (status === 'active') return '#FF3000';
    if (
      status === 'expiring-soon' ||
      status === 'expiring-critical' ||
      status === 'expiring-urgent'
    )
      return '#FF3000';
    if (status === 'expired') return '#FF3000';
    if (status === 'pending') return '#FF3000';
    return 'rgb(92, 92, 92)';
  };

  const statusColor = getStatusColor(certificate.status);

  const verificationHistory = [
    { date: '9 May 2026, 10:23 AM', event: 'Certificate verified via API', by: 'System' },
    { date: '15 Jan 2026, 2:45 PM', event: 'Certificate renewed', by: 'Amaka Okoro' },
    { date: '5 Jan 2026, 9:15 AM', event: 'Renewal alert sent', by: 'System' },
    { date: '20 Dec 2025, 3:30 PM', event: 'Document uploaded', by: 'Amaka Okoro' },
  ];

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
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="bg-card rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 id="modal-title" style={{ fontSize: '24px', fontWeight: '600' }}>
                  {certificate.shortName}
                </h2>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${statusColor}20`,
                    color: statusColor,
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {certificate.status.replace('-', ' ').toUpperCase()}
                </span>
                {certificate.isApiVerified && (
                  <span
                    className="px-2 py-1 rounded-full flex items-center gap-1"
                    style={{
                      backgroundColor: 'rgba(255, 48, 0, 0.1)',
                      color: '#FF3000',
                      fontSize: '13px',
                    }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    API Verified
                  </span>
                )}
              </div>
              <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                {certificate.name}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              autoFocus={isOpen}
              className="w-11 h-11 rounded-md hover:bg-muted flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Certificate Details */}
            <div>
              <h3 className="mb-4" style={{ fontSize: '16px', fontWeight: '500' }}>
                Certificate Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="caption text-muted-foreground mb-1">Certificate Number</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'monospace' }}>
                    {certificate.certificateNumber || 'N/A'}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="caption text-muted-foreground mb-1">Issuing Authority</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    {certificate.issuingAuthority || 'Federal Government of Nigeria'}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="caption text-muted-foreground mb-1">Issued Date</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    {certificate.issuedDate || '15 Jan 2025'}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="caption text-muted-foreground mb-1">Expiry Date</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>
                    {certificate.expiryDate || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Expiry Warning */}
            {certificate.daysToExpiry !== undefined && certificate.daysToExpiry < 30 && (
              <div
                className="px-4 py-3 rounded-lg border border-[#e5e5e5] flex items-start gap-3"
                style={{
                  backgroundColor:
                    certificate.daysToExpiry < 7
                      ? 'rgba(255, 48, 0, 0.1)'
                      : 'rgba(255, 48, 0, 0.1)',
                }}
              >
                <Clock
                  className="w-5 h-5 flex-shrink-0"
                  style={{
                    color: certificate.daysToExpiry < 7 ? '#FF3000' : '#FF3000',
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color:
                        certificate.daysToExpiry < 7 ? '#FF3000' : '#FF3000',
                    }}
                  >
                    {certificate.daysToExpiry < 7 ? 'Urgent Action Required' : 'Renewal Reminder'}
                  </p>
                  <p className="caption text-muted-foreground mt-1">
                    This certificate expires in {certificate.daysToExpiry} days. Renew now to avoid
                    compliance gaps.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div>
              <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>
                Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Document
                </button>
                <button className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload New Document
                </button>
                <button
                  className="px-4 py-3 rounded-md text-white flex items-center gap-2"
                  style={{ backgroundColor: '#FF3000' }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Start Renewal
                </button>
              </div>
            </div>

            {/* Verification History */}
            <div>
              <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>
                Verification History
              </h3>
              <div className="space-y-3">
                {verificationHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
                    >
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#FF3000' }} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.event}</p>
                      <p className="caption text-muted-foreground">
                        {item.date} • by {item.by}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Impact */}
            <div
              className="px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#FF3000' }}>
                Compliance Impact
              </h4>
              <p className="caption text-muted-foreground mt-1">
                This certificate contributes 15 points to your overall compliance score. Keeping it
                active is critical for maintaining Procurement Ready status.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
            >
              Close
            </button>
            <button
              className="px-4 py-2 rounded-md text-white"
              style={{ backgroundColor: '#FF3000' }}
            >
              Take Action
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
