import { X, Upload, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';

interface CertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateType: {
    name: string;
    shortName: string;
  };
  onUploadSuccess: () => void;
  dashboardState?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
}

type UploadMethod = 'file' | 'manual' | 'api';

export function CertificateUploadModal({
  isOpen,
  onClose,
  certificateType,
  onUploadSuccess,
  dashboardState = 'Healthy',
  urgencyLevel = 'low',
}: CertificateUploadModalProps) {
  const { showToast } = useToast();
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('file');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Form fields for manual entry
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isUploading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, isUploading, onClose]);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        showToast('error', 'Invalid File Type', 'Please upload a PDF or image file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        showToast('error', 'Invalid File Type', 'Please upload a PDF or image file');
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      showToast('error', 'No File Selected', 'Please select a file to upload');
      return;
    }

    setIsUploading(true);

    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      showToast(
        'success',
        'Certificate Uploaded',
        `${certificateType.shortName} certificate uploaded successfully`
      );
      onUploadSuccess();
      onClose();
      resetForm();
    }, 2000);
  };

  const handleManualSubmit = async () => {
    if (!certificateNumber || !issuedDate || !expiryDate) {
      showToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    // Simulate manual entry submission
    setTimeout(() => {
      setIsUploading(false);
      showToast(
        'success',
        'Certificate Added',
        `${certificateType.shortName} certificate added successfully`
      );
      onUploadSuccess();
      onClose();
      resetForm();
    }, 1500);
  };

  const handleApiConnect = async () => {
    setIsUploading(true);

    // Simulate API connection
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setIsUploading(false);

      if (success) {
        showToast(
          'success',
          'API Connected',
          `${certificateType.shortName} verified via government API`
        );
        onUploadSuccess();
        onClose();
        resetForm();
      } else {
        showToast(
          'error',
          'Connection Failed',
          'Unable to verify via API. Please try manual upload.'
        );
      }
    }, 2500);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setCertificateNumber('');
    setIssuedDate('');
    setExpiryDate('');
    setIssuingAuthority('');
    setUploadMethod('file');
  };

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      resetForm();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600' }}>
                Connect {certificateType.shortName}
              </h2>
              <p className="text-muted-foreground text-[#404040] mt-1" style={{ fontSize: '14px' }}>
                {certificateType.name}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isUploading}
              aria-label="Close modal"
              className="w-11 h-11 rounded-md hover:bg-muted flex items-center justify-center transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* State-Aware Banner */}
            {urgencyLevel !== 'low' && (
              <div
                className="mb-6 px-4 py-3 rounded-lg border border-[#e5e5e5] flex items-start gap-3"
                style={{
                  backgroundColor:
                    urgencyLevel === 'critical'
                      ? 'rgb(251, 55, 72, 0.1)'
                      : urgencyLevel === 'high'
                        ? 'rgb(250, 115, 25, 0.1)'
                        : 'rgb(71, 194, 255, 0.1)',
                }}
              >
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0"
                  style={{
                    color:
                      urgencyLevel === 'critical'
                        ? 'rgb(251, 55, 72)'
                        : urgencyLevel === 'high'
                          ? 'rgb(250, 115, 25)'
                          : 'rgb(71, 194, 255)',
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color:
                        urgencyLevel === 'critical'
                          ? 'rgb(251, 55, 72)'
                          : urgencyLevel === 'high'
                            ? 'rgb(250, 115, 25)'
                            : 'rgb(71, 194, 255)',
                    }}
                  >
                    {urgencyLevel === 'critical' && 'Critical: Immediate Action Required'}
                    {urgencyLevel === 'high' && 'High Priority Upload'}
                    {urgencyLevel === 'medium' && 'Complete Your Profile'}
                  </p>
                  <p
                    className="text-muted-foreground text-[#404040] mt-1"
                    style={{ fontSize: '13px' }}
                  >
                    {dashboardState === 'New Registration' &&
                      'Complete your certificate setup to activate procurement eligibility.'}
                    {dashboardState === 'Non-Compliant' &&
                      'Upload this certificate to restore your compliance status and procurement eligibility.'}
                    {dashboardState === 'Critical' &&
                      'This certificate is critical for maintaining your compliance score.'}
                    {dashboardState === 'Attention Required' &&
                      'Upload now to prevent your compliance score from dropping.'}
                  </p>
                </div>
              </div>
            )}

            {/* Upload Method Selection */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setUploadMethod('file')}
                disabled={isUploading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  uploadMethod === 'file'
                    ? 'border-[#fb7319] bg-[#ffeee6]'
                    : 'border-border hover:border-[#e5e5e5]'
                }`}
              >
                <Upload
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: uploadMethod === 'file' ? '#fb7319' : '#5c5c5c' }}
                />
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: uploadMethod === 'file' ? '#fb7319' : '#171717',
                  }}
                >
                  Upload File
                </p>
                <p
                  className="text-muted-foreground text-[#404040] mt-1"
                  style={{ fontSize: '11px' }}
                >
                  PDF or Image
                </p>
              </button>

              <button
                onClick={() => setUploadMethod('manual')}
                disabled={isUploading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  uploadMethod === 'manual'
                    ? 'border-[#fb7319] bg-[#ffeee6]'
                    : 'border-border hover:border-[#e5e5e5]'
                }`}
              >
                <FileText
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: uploadMethod === 'manual' ? '#fb7319' : '#5c5c5c' }}
                />
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: uploadMethod === 'manual' ? '#fb7319' : '#171717',
                  }}
                >
                  Manual Entry
                </p>
                <p
                  className="text-muted-foreground text-[#404040] mt-1"
                  style={{ fontSize: '11px' }}
                >
                  Type details
                </p>
              </button>

              <button
                onClick={() => setUploadMethod('api')}
                disabled={isUploading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  uploadMethod === 'api'
                    ? 'border-[#fb7319] bg-[#ffeee6]'
                    : 'border-border hover:border-[#e5e5e5]'
                }`}
              >
                <LinkIcon
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: uploadMethod === 'api' ? '#fb7319' : '#5c5c5c' }}
                />
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: uploadMethod === 'api' ? '#fb7319' : '#171717',
                  }}
                >
                  API Connect
                </p>
                <p
                  className="text-muted-foreground text-[#404040] mt-1"
                  style={{ fontSize: '11px' }}
                >
                  Auto-verify
                </p>
              </button>
            </div>

            {/* File Upload */}
            {uploadMethod === 'file' && (
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-[#fb7319] bg-[#ffeee6]' : 'border-border'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8" style={{ color: '#fb7319' }} />
                      <div className="text-left">
                        <p style={{ fontSize: '14px', fontWeight: '500' }}>{selectedFile.name}</p>
                        <p
                          className="text-muted-foreground text-[#404040]"
                          style={{ fontSize: '13px' }}
                        >
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        aria-label="Remove selected file"
                        className="ml-auto p-2.5 hover:bg-muted rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p style={{ fontSize: '14px', fontWeight: '500' }} className="mb-1">
                        Drop your certificate here or click to browse
                      </p>
                      <p
                        className="text-muted-foreground text-[#404040]"
                        style={{ fontSize: '13px' }}
                      >
                        Supports PDF and image files (max 10MB)
                      </p>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block mt-4 px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                        style={{ fontSize: '13px' }}
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Manual Entry */}
            {uploadMethod === 'manual' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500' }}>
                    Certificate Number *
                  </label>
                  <input
                    type="text"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="e.g., NHIA/2026/FCT/AB12345678"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background"
                    style={{ fontSize: '13px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500' }}>
                      Issued Date *
                    </label>
                    <input
                      type="date"
                      value={issuedDate}
                      onChange={(e) => setIssuedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background"
                      style={{ fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500' }}>
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background"
                      style={{ fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500' }}>
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={issuingAuthority}
                    onChange={(e) => setIssuingAuthority(e.target.value)}
                    placeholder="e.g., Federal Government of Nigeria"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background"
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>
            )}

            {/* API Connect */}
            {uploadMethod === 'api' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-[#e5e5e5] bg-[#c4edff] bg-opacity-30">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#47c2ff' }} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#47c2ff' }}>
                        Auto-Verification Available
                      </p>
                      <p
                        className="text-muted-foreground text-[#404040] mt-1"
                        style={{ fontSize: '13px' }}
                      >
                        Connect directly to the government database to automatically verify and sync
                        your {certificateType.shortName} certificate. This provides real-time
                        updates and instant verification.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500' }}>
                    Certificate Number
                  </label>
                  <input
                    type="text"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="Enter your certificate number for verification"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background"
                    style={{ fontSize: '13px' }}
                  />
                  <p
                    className="text-muted-foreground text-[#404040] mt-1"
                    style={{ fontSize: '11px' }}
                  >
                    We'll securely verify this with the issuing authority
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
                style={{ fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={
                  uploadMethod === 'file'
                    ? handleFileUpload
                    : uploadMethod === 'manual'
                      ? handleManualSubmit
                      : handleApiConnect
                }
                disabled={isUploading}
                className="px-4 py-2 rounded-md text-white flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#fb7319', fontSize: '13px', fontWeight: '500' }}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {uploadMethod === 'api' ? 'Verifying...' : 'Uploading...'}
                  </>
                ) : (
                  <>{uploadMethod === 'api' ? 'Connect & Verify' : 'Upload Certificate'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
