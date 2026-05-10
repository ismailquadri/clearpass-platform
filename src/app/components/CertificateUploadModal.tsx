import { X, Upload, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { uploadCertificate } from '../api/certificates';

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

  // Form validation errors
  const [errors, setErrors] = useState<{
    certificateNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
  }>({});

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

  const modalRef = useFocusTrap(isOpen);

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

    // Validate required fields
    if (!certificateNumber.trim()) {
      showToast('error', 'Missing Information', 'Please enter the certificate number');
      return;
    }
    if (!issuedDate) {
      showToast('error', 'Missing Information', 'Please enter the issue date');
      return;
    }
    if (!expiryDate) {
      showToast('error', 'Missing Information', 'Please enter the expiry date');
      return;
    }
    if (!issuingAuthority.trim()) {
      showToast('error', 'Missing Information', 'Please enter the issuing authority');
      return;
    }

    setIsUploading(true);

    try {
      await uploadCertificate({
        shortName: certificateType.shortName,
        certificateNumber: certificateNumber.trim(),
        issuedDate: issuedDate,
        expiryDate: expiryDate,
        issuingAuthority: issuingAuthority.trim(),
        file: selectedFile,
      });

      showToast(
        'success',
        'Certificate Uploaded',
        `${certificateType.shortName} certificate uploaded successfully`
      );
      onUploadSuccess();
      onClose();
      resetForm();
    } catch (error) {
      showToast(
        'error',
        'Upload Failed',
        error instanceof Error ? error.message : 'Failed to upload certificate'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualSubmit = async () => {
    const newErrors: typeof errors = {};

    // Validate certificate number
    if (!certificateNumber.trim()) {
      newErrors.certificateNumber = 'Certificate number is required';
    } else if (certificateNumber.length < 5) {
      newErrors.certificateNumber = 'Certificate number must be at least 5 characters';
    }

    // Validate issued date
    if (!issuedDate) {
      newErrors.issuedDate = 'Issued date is required';
    } else {
      const issued = new Date(issuedDate);
      if (isNaN(issued.getTime()) || issued > new Date()) {
        newErrors.issuedDate = 'Please enter a valid past date';
      }
    }

    // Validate expiry date
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) {
        newErrors.expiryDate = 'Please enter a valid date';
      } else if (expiry <= new Date()) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      } else if (issuedDate && new Date(issuedDate) >= expiry) {
        newErrors.expiryDate = 'Expiry date must be after issued date';
      }
    }

    // Validate issuing authority
    if (!issuingAuthority.trim()) {
      newErrors.issuingAuthority = 'Issuing authority is required';
    } else if (issuingAuthority.length < 3) {
      newErrors.issuingAuthority = 'Please enter a valid issuing authority name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Validation Error', 'Please correct the errors in the form');
      return;
    }

    setErrors({});
    setIsUploading(true);

    try {
      // Create a placeholder file for manual entry
      const placeholderFile = new File(
        [`Manual entry: ${certificateNumber}`],
        `${certificateType.shortName}_manual_entry.txt`,
        { type: 'text/plain' }
      );

      await uploadCertificate({
        shortName: certificateType.shortName,
        certificateNumber: certificateNumber.trim(),
        issuedDate: issuedDate,
        expiryDate: expiryDate,
        issuingAuthority: issuingAuthority.trim(),
        file: placeholderFile,
      });

      showToast(
        'success',
        'Certificate Added',
        `${certificateType.shortName} certificate added successfully`
      );
      onUploadSuccess();
      onClose();
      resetForm();
    } catch (error) {
      showToast(
        'error',
        'Submission Failed',
        error instanceof Error ? error.message : 'Failed to add certificate'
      );
    } finally {
      setIsUploading(false);
    }
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
    setErrors({});
  };

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      resetForm();
    }
  };

  return (
    <>
      {/* Backdrop - non-focusable */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
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
          className="bg-card rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div>
              <h2 id="modal-title" style={{ fontSize: '24px', fontWeight: '600' }}>
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
              autoFocus={!isUploading}
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
                      ? 'rgba(255, 48, 0, 0.1)'
                      : urgencyLevel === 'high'
                        ? 'rgba(255, 48, 0, 0.1)'
                        : 'rgba(255, 48, 0, 0.1)',
                }}
              >
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0"
                  style={{
                    color:
                      urgencyLevel === 'critical'
                        ? '#FF3000'
                        : urgencyLevel === 'high'
                          ? '#FF3000'
                          : '#FF3000',
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color:
                        urgencyLevel === 'critical'
                          ? '#FF3000'
                          : urgencyLevel === 'high'
                            ? '#FF3000'
                            : '#FF3000',
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
                    ? 'border-[#FF3000] bg-[#ffe6e6]'
                    : 'border-border hover:border-[#e5e5e5]'
                }`}
              >
                <Upload
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: uploadMethod === 'file' ? '#FF3000' : '#5c5c5c' }}
                />
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: uploadMethod === 'file' ? '#FF3000' : '#171717',
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
                    ? 'border-[#FF3000] bg-[#ffe6e6]'
                    : 'border-border hover:border-[#e5e5e5]'
                }`}
              >
                <FileText
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: uploadMethod === 'manual' ? '#FF3000' : '#5c5c5c' }}
                />
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: uploadMethod === 'manual' ? '#FF3000' : '#171717',
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
                    ? 'border-[#FF3000] bg-[#ffe6e6]'
                    : 'border-border hover:border-[#e5e5e5]'
                }`}
              >
                <LinkIcon
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: uploadMethod === 'api' ? '#FF3000' : '#5c5c5c' }}
                />
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: uploadMethod === 'api' ? '#FF3000' : '#171717',
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
                    dragActive ? 'border-[#FF3000] bg-[#ffe6e6]' : 'border-border'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8" style={{ color: '#FF3000' }} />
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

                {/* Required fields for file upload */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="cert-number-file"
                      className="block mb-2"
                      style={{ fontSize: '13px', fontWeight: '500' }}
                    >
                      Certificate Number *
                    </label>
                    <input
                      type="text"
                      id="cert-number-file"
                      value={certificateNumber}
                      onChange={(e) => setCertificateNumber(e.target.value)}
                      placeholder="e.g., NHIA/2026/FCT/AB12345678"
                      className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-md"
                      style={{ fontSize: '14px' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="issue-date-file"
                        className="block mb-2"
                        style={{ fontSize: '13px', fontWeight: '500' }}
                      >
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        id="issue-date-file"
                        value={issuedDate}
                        onChange={(e) => setIssuedDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-md"
                        style={{ fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="expiry-date-file"
                        className="block mb-2"
                        style={{ fontSize: '13px', fontWeight: '500' }}
                      >
                        Expiry Date *
                      </label>
                      <input
                        type="date"
                        id="expiry-date-file"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-md"
                        style={{ fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="issuing-authority-file"
                      className="block mb-2"
                      style={{ fontSize: '13px', fontWeight: '500' }}
                    >
                      Issuing Authority *
                    </label>
                    <input
                      type="text"
                      id="issuing-authority-file"
                      value={issuingAuthority}
                      onChange={(e) => setIssuingAuthority(e.target.value)}
                      placeholder="e.g., National Pension Commission, Federal Government of Nigeria"
                      className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-md"
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Manual Entry */}
            {uploadMethod === 'manual' && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="cert-number"
                    className="block mb-2"
                    style={{ fontSize: '13px', fontWeight: '500' }}
                  >
                    Certificate Number *
                  </label>
                  <input
                    id="cert-number"
                    type="text"
                    value={certificateNumber}
                    onChange={(e) => {
                      setCertificateNumber(e.target.value);
                      setErrors({ ...errors, certificateNumber: undefined });
                    }}
                    placeholder="e.g., NHIA/2026/FCT/AB12345678"
                    required
                    aria-invalid={!!errors.certificateNumber}
                    aria-describedby={errors.certificateNumber ? 'cert-number-error' : undefined}
                    className={`w-full px-3 py-2 rounded-md border bg-background ${
                      errors.certificateNumber ? 'border-red-500' : 'border-border'
                    }`}
                    style={{ fontSize: '13px' }}
                  />
                  {errors.certificateNumber && (
                    <p
                      id="cert-number-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                      aria-live="assertive"
                    >
                      {errors.certificateNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cert-issued-date"
                      className="block mb-2"
                      style={{ fontSize: '13px', fontWeight: '500' }}
                    >
                      Issued Date *
                    </label>
                    <input
                      id="cert-issued-date"
                      type="date"
                      value={issuedDate}
                      onChange={(e) => {
                        setIssuedDate(e.target.value);
                        setErrors({ ...errors, issuedDate: undefined });
                      }}
                      required
                      aria-invalid={!!errors.issuedDate}
                      aria-describedby={errors.issuedDate ? 'cert-issued-date-error' : undefined}
                      className={`w-full px-3 py-2 rounded-md border bg-background ${
                        errors.issuedDate ? 'border-red-500' : 'border-border'
                      }`}
                      style={{ fontSize: '13px' }}
                    />
                    {errors.issuedDate && (
                      <p
                        id="cert-issued-date-error"
                        className="text-red-500 text-xs mt-1"
                        role="alert"
                        aria-live="assertive"
                      >
                        {errors.issuedDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cert-expiry-date"
                      className="block mb-2"
                      style={{ fontSize: '13px', fontWeight: '500' }}
                    >
                      Expiry Date *
                    </label>
                    <input
                      id="cert-expiry-date"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => {
                        setExpiryDate(e.target.value);
                        setErrors({ ...errors, expiryDate: undefined });
                      }}
                      required
                      aria-invalid={!!errors.expiryDate}
                      aria-describedby={errors.expiryDate ? 'cert-expiry-date-error' : undefined}
                      className={`w-full px-3 py-2 rounded-md border bg-background ${
                        errors.expiryDate ? 'border-red-500' : 'border-border'
                      }`}
                      style={{ fontSize: '13px' }}
                    />
                    {errors.expiryDate && (
                      <p
                        id="cert-expiry-date-error"
                        className="text-red-500 text-xs mt-1"
                        role="alert"
                        aria-live="assertive"
                      >
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cert-issuing-authority"
                    className="block mb-2"
                    style={{ fontSize: '13px', fontWeight: '500' }}
                  >
                    Issuing Authority *
                  </label>
                  <input
                    id="cert-issuing-authority"
                    type="text"
                    value={issuingAuthority}
                    onChange={(e) => {
                      setIssuingAuthority(e.target.value);
                      setErrors({ ...errors, issuingAuthority: undefined });
                    }}
                    placeholder="e.g., Federal Government of Nigeria"
                    required
                    aria-invalid={!!errors.issuingAuthority}
                    aria-describedby={
                      errors.issuingAuthority ? 'cert-issuing-authority-error' : undefined
                    }
                    className={`w-full px-3 py-2 rounded-md border bg-background ${
                      errors.issuingAuthority ? 'border-red-500' : 'border-border'
                    }`}
                    style={{ fontSize: '13px' }}
                  />
                  {errors.issuingAuthority && (
                    <p
                      id="cert-issuing-authority-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                      aria-live="assertive"
                    >
                      {errors.issuingAuthority}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* API Connect */}
            {uploadMethod === 'api' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-[#e5e5e5] bg-[#ffe6e6] bg-opacity-30">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#FF3000' }} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#FF3000' }}>
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
                  <label
                    htmlFor="api-cert-number"
                    className="block mb-2"
                    style={{ fontSize: '13px', fontWeight: '500' }}
                  >
                    Certificate Number
                  </label>
                  <input
                    id="api-cert-number"
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
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
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
                aria-live="polite"
                aria-busy={isUploading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-md text-white flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#FF3000', fontSize: '13px', fontWeight: '500' }}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {uploadMethod === 'api' ? 'Verifying...' : 'Uploading...'}
                    <span className="sr-only" aria-live="polite">
                      {uploadMethod === 'api'
                        ? 'Verifying certificate, please wait'
                        : 'Uploading certificate, please wait'}
                    </span>
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
