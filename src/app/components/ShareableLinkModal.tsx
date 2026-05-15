import { useState } from 'react';
import { Link, CheckCircle2, Copy, X, Clock } from 'lucide-react';
import { useToast } from './ToastProvider';

interface ShareableLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  rcNumber?: string;
  complianceScore?: number;
  procurementReady?: boolean;
}

export function ShareableLinkModal({
  isOpen,
  onClose,
  companyName = 'My Company',
  rcNumber = 'RC1234567',
  complianceScore = 85,
  procurementReady = true,
}: ShareableLinkModalProps) {
  const { showToast } = useToast();
  const [linkExpiry, setLinkExpiry] = useState<'7' | '30' | '90'>('30');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [linkStatus, setLinkStatus] = useState<'idle' | 'generating' | 'active' | 'expired'>('idle');

  const generateLink = () => {
    setLinkStatus('generating');
    // Simulate link generation - in production this would call the backend
    setTimeout(() => {
      const baseUrl = window.location.origin;
      const uniqueId = Math.random().toString(36).substring(2, 15);
      const link = `${baseUrl}/verify/${rcNumber}/${uniqueId}?expiry=${linkExpiry}`;
      setGeneratedLink(link);
      setLinkStatus('active');
      showToast('success', 'Link Generated', 'Your shareable compliance link is ready');
    }, 1000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    showToast('success', 'Link Copied', 'Shareable link copied to clipboard');
  };

  const deactivateLink = () => {
    setGeneratedLink('');
    setLinkStatus('idle');
    showToast('info', 'Link Deactivated', 'Shareable link has been deactivated');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-[#FF3000]" />
            <h2 className="text-lg font-semibold">Shareable Compliance Link</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Generate a shareable link to let MDAs verify your compliance status without requiring them to log in.
            </p>
          </div>

          {/* Company Info */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Company</span>
              <span className="font-medium">{companyName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">RC Number</span>
              <span className="font-medium">{rcNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Compliance Score</span>
              <span className="font-medium" style={{ color: complianceScore >= 80 ? '#1FC16B' : '#FF3000' }}>
                {complianceScore}/100
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`font-medium ${
                  procurementReady ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {procurementReady ? 'Procurement Ready' : 'Ineligible to Bid'}
              </span>
            </div>
          </div>

          {/* Link Expiry */}
          <div>
            <label className="block text-sm font-medium mb-2">Link Expiry</label>
            <div className="flex gap-2">
              {['7' as const, '30' as const, '90' as const].map((days) => (
                <button
                  key={days}
                  onClick={() => setLinkExpiry(days)}
                  disabled={linkStatus === 'active'}
                  className={`flex-1 px-3 py-2 rounded-md border text-sm transition-colors ${
                    linkExpiry === days
                      ? 'border-[#FF3000] bg-[#fff5f3] text-[#FF3000]'
                      : 'border-border hover:bg-muted'
                  } ${linkStatus === 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

          {/* Generated Link */}
          {linkStatus === 'idle' && (
            <button
              onClick={generateLink}
              className="w-full px-4 py-3 rounded-md bg-[#FF3000] text-white hover:opacity-90 transition-opacity font-medium"
            >
              Generate Shareable Link
            </button>
          )}

          {linkStatus === 'generating' && (
            <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating link...</span>
            </div>
          )}

          {linkStatus === 'active' && (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Link Active</span>
                </div>
                <p className="text-sm text-green-700">
                  Link expires in {linkExpiry} days. Anyone with this link can view your compliance status.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Shareable Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-md border border-border bg-muted text-sm"
                  />
                  <button
                    onClick={copyLink}
                    className="px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={deactivateLink}
                  className="flex-1 px-4 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Deactivate Link
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Shareable links provide read-only access to your compliance status. No data can be modified.
          </p>
        </div>
      </div>
    </div>
  );
}