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
import { useState } from 'react';
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

export function CertificateCard({
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
          color: 'rgb(31, 193, 107)',
          bgColor: 'rgb(31, 193, 107, 0.1)',
          label: 'Active',
          showDays: true,
        };
      case 'expiring-soon':
        return {
          icon: Clock,
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          label: 'Expiring Soon',
          showDays: true,
        };
      case 'expiring-critical':
        return {
          icon: AlertCircle,
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          label: 'Expiring Critical',
          showDays: true,
        };
      case 'expiring-urgent':
        return {
          icon: AlertCircle,
          color: 'rgb(251, 55, 72)',
          bgColor: 'rgb(251, 55, 72, 0.1)',
          label: 'Expiring Urgent',
          showDays: true,
        };
      case 'expired':
        return {
          icon: XCircle,
          color: 'rgb(251, 55, 72)',
          bgColor: 'rgb(251, 55, 72, 0.1)',
          label: 'Expired',
          showDays: false,
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          label: 'Pending Verification',
          showDays: false,
        };
      case 'renewal-in-progress':
        return {
          icon: RefreshCw,
          color: 'rgb(71, 194, 255)',
          bgColor: 'rgb(71, 194, 255, 0.1)',
          label: 'Renewal In Progress',
          showDays: false,
        };
      case 'not-connected':
      default:
        return {
          icon: Upload,
          color: 'rgb(92, 92, 92)',
          bgColor: 'rgb(235, 235, 235)',
          label: 'Not Connected',
          showDays: false,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 style={{ fontSize: '14px', fontWeight: '500' }}>{shortName}</h4>
            {isApiVerified && (
              <span
                className="px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                style={{
                  backgroundColor: 'rgb(71, 194, 255, 0.1)',
                  color: 'rgb(71, 194, 255)',
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
            }}
          >
            {config.label}
          </span>
        </div>

        {config.showDays && daysToExpiry !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
              Days to Expiry
            </span>
            <span style={{ fontSize: '12px', fontWeight: '500' }}>{daysToExpiry} days</span>
          </div>
        )}

        {expiryDate && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
              Expiry Date
            </span>
            <span style={{ fontSize: '12px' }}>{expiryDate}</span>
          </div>
        )}

        {certificateNumber && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[#404040]" style={{ fontSize: '13px' }}>
              Certificate No.
            </span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                {certificateNumber.slice(0, 12)}...
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(certificateNumber || '');
                  showToast('success', 'Copied', 'Certificate number copied to clipboard');
                }}
                className="p-0.5 rounded hover:bg-muted transition-colors"
              >
                <Copy className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 mt-3 pt-3 border-t border-border">
        {status === 'not-connected' ? (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex-1 px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 "
            style={{ backgroundColor: 'rgb(251, 115, 25)', color: 'white', fontSize: '12px' }}
          >
            <Upload className="w-3 h-3" />
            Connect
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsDetailModalOpen(true)}
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
                onClick={() => setIsUploadModalOpen(true)}
                className="flex-1 px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'rgb(251, 115, 25)', color: 'white', fontSize: '12px' }}
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
        onClose={() => setIsUploadModalOpen(false)}
        certificateType={{ name, shortName }}
        dashboardState={dashboardState}
        urgencyLevel={urgencyLevel}
        onUploadSuccess={() => {
          showToast(
            'success',
            'Certificate Updated',
            `${shortName} certificate has been updated successfully`
          );
        }}
      />

      {/* Detail Modal */}
      <CertificateDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
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
}
