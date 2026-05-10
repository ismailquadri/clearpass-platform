import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Upload,
  Eye,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { useState, memo, useMemo, useCallback } from 'react';
import { CertificateUploadModal } from './CertificateUploadModal';
import { CertificateDetailModal } from './CertificateDetailModal';
import { useToast } from './ToastProvider';

type CertificateStatus =
  | 'active'
  | 'expiring-soon'
  | 'expiring-critical'
  | 'expiring-urgent'
  | 'expired'
  | 'pending'
  | 'renewal-in-progress'
  | 'not-connected';

interface CertificateCardProps {
  name: string;
  shortName: string;
  status: CertificateStatus;
  daysToExpiry?: number;
  expiryDate?: string;
  certificateNumber?: string;
  isApiVerified?: boolean;
  dashboardState?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export const CertificateCard = memo(function CertificateCard({
  name,
  shortName,
  status,
  daysToExpiry,
  expiryDate,
  certificateNumber,
  isApiVerified = false,
  dashboardState,
  urgencyLevel,
}: CertificateCardProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { showToast } = useToast();

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle2,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.1)',
          label: 'Active',
          showDays: true,
          hasBorder: false,
        };
      case 'expiring-soon':
        return {
          icon: Clock,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.08)',
          label: 'Expiring Soon',
          showDays: true,
          hasBorder: false,
        };
      case 'expiring-critical':
        return {
          icon: AlertCircle,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.08)',
          label: 'Expiring Critical',
          showDays: true,
          hasBorder: false,
        };
      case 'expiring-urgent':
        return {
          icon: AlertCircle,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.1)',
          label: 'Expiring Urgent',
          showDays: true,
          hasBorder: false,
        };
      case 'expired':
        return {
          icon: XCircle,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.1)',
          label: 'Expired',
          showDays: false,
          hasBorder: false,
        };
      case 'pending':
        return {
          icon: Clock,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.08)',
          label: 'Pending Verification',
          showDays: false,
          hasBorder: false,
        };
      case 'renewal-in-progress':
        return {
          icon: RefreshCw,
          color: '#FF3000',
          bgColor: 'transparent',
          label: 'Renewal In Progress',
          showDays: false,
          hasBorder: true,
        };
      case 'not-connected':
      default:
        return {
          icon: Upload,
          color: 'rgb(92, 92, 92)',
          bgColor: 'rgb(235, 235, 235)',
          label: 'Not Connected',
          showDays: false,
          hasBorder: false,
        };
    }
  };

  // getStatusConfig is a stable closure; status is the only reactive dependency.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = useMemo(() => getStatusConfig(), [status]);
  const Icon = config.icon;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(certificateNumber || '');
    showToast('success', 'Copied', 'Certificate number copied to clipboard');
  }, [certificateNumber, showToast]);

  const handleView = useCallback(() => {
    setIsDetailModalOpen(true);
  }, []);

  const handleUpload = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  const handleUploadClose = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  const handleViewClose = useCallback(() => {
    setIsDetailModalOpen(false);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    showToast(
      'success',
      'Certificate Updated',
      `${shortName} certificate has been updated successfully`
    );
  }, [shortName, showToast]);

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{shortName}</div>
            {isApiVerified && (
              <span
                className="px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #FF3000',
                  color: '#FF3000',
                  fontSize: '13px',
                }}
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                API
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
            {name}
          </p>
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
            Status
          </span>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
              fontSize: '13px',
              fontWeight: '500',
              border: config.hasBorder ? `1px solid ${config.color}` : 'none',
            }}
          >
            {config.label}
          </span>
        </div>

        {config.showDays && daysToExpiry !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[#404040] text-xs">Days to Expiry</span>
            <span className="text-xs font-medium">{daysToExpiry} days</span>
          </div>
        )}

        {expiryDate && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[#404040] text-xs">Expiry Date</span>
            <span className="text-xs">{expiryDate}</span>
          </div>
        )}

        {certificateNumber && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[#404040] text-xs">Certificate No.</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono">{certificateNumber.slice(0, 12)}...</span>
              <button
                onClick={handleCopy}
                aria-label="Copy certificate number"
                className="p-2.5 rounded hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 mt-3 pt-3 border-t border-border">
        {status === 'not-connected' ? (
          <button
            onClick={handleUpload}
            className="flex-1 px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 bg-orange-500 text-white text-xs hover:bg-orange-600 transition-colors"
          >
            <Upload className="w-3 h-3" />
            Connect
          </button>
        ) : (
          <>
            <button
              onClick={handleView}
              className="flex-1 px-3 py-1.5 rounded-md border border-border flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
              style={{ fontSize: '12px' }}
            >
              <Eye className="w-3 h-3" />
              View
            </button>
            {(status === 'expiring-soon' ||
              status === 'expiring-critical' ||
              status === 'expiring-urgent' ||
              status === 'expired') && (
              <button
                onClick={handleUpload}
                className="flex-1 px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FF3000', color: 'white', fontSize: '12px' }}
              >
                <RefreshCw className="w-3 h-3" />
                Renew
              </button>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      <CertificateUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadClose}
        certificateType={{ name, shortName }}
        dashboardState={dashboardState}
        urgencyLevel={urgencyLevel}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Detail Modal */}
      <CertificateDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleViewClose}
        certificate={{
          name,
          shortName,
          status,
          certificateNumber,
          expiryDate,
          daysToExpiry,
          isApiVerified,
        }}
      />
    </div>
  );
});
