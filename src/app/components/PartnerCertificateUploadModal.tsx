import { X, Upload, Users, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { validateFile, validateCertificateUploadForm, type CertificateUploadFormData } from '../utils/validation';

interface Client {
  id: string;
  companyName: string;
  rcNumber: string;
  complianceScore: number;
  activeCertificates: number;
  totalCertificates: number;
}

interface PartnerCertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockClients: Client[] = [
  {
    id: '1',
    companyName: 'TechBuild Nigeria Ltd',
    rcNumber: 'RC1234567',
    complianceScore: 73,
    activeCertificates: 4,
    totalCertificates: 6,
  },
  {
    id: '2',
    companyName: 'GreenEnergy Solutions Ltd',
    rcNumber: 'RC7654321',
    complianceScore: 92,
    activeCertificates: 6,
    totalCertificates: 6,
  },
  {
    id: '3',
    companyName: 'BuildCorp Infrastructure',
    rcNumber: 'RC9988776',
    complianceScore: 34,
    activeCertificates: 1,
    totalCertificates: 6,
  },
  {
    id: '4',
    companyName: 'AgriTech Farms Ltd',
    rcNumber: 'RC5544332',
    complianceScore: 85,
    activeCertificates: 5,
    totalCertificates: 6,
  },
];

const availableCertificates = [
  'NHIA - National Health Insurance Authority',
  'PCC - Pension Clearance Certificate',
  'NSITF - Nigeria Social Insurance Trust Fund',
  'FIRS TCC - Tax Clearance Certificate',
  'BPP - Bureau of Public Procurement',
  'ITF - Industrial Training Fund',
];

export function PartnerCertificateUploadModal({
  isOpen,
  onClose,
}: PartnerCertificateUploadModalProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<'client' | 'certificate' | 'upload'>('client');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  const filteredClients = mockClients.filter(
    (client) =>
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.rcNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setStep('certificate');
  };

  const handleCertificateSelect = (certificate: string) => {
    setSelectedCertificate(certificate);
    setStep('upload');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      
      if (validation.isValid) {
        setSelectedFile(file);
      } else {
        setError(validation.error || 'Invalid file');
        setSelectedFile(null);
        showToast('error', 'Invalid File', validation.error || 'Please upload a valid file');
      }
    }
  };

  const handleUpload = async () => {
    setError(null);

    const formData: CertificateUploadFormData = {
      clientId: selectedClient?.id || '',
      certificateType: selectedCertificate,
      file: selectedFile,
    };

    const validation = validateCertificateUploadForm(formData);
    
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError || 'Please correct the errors before uploading');
      showToast('error', 'Validation Error', firstError || 'Please correct the errors before uploading');
      return;
    }

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      showToast(
        'success',
        'Certificate Uploaded',
        `${selectedCertificate} uploaded for ${selectedClient?.companyName}`
      );
      handleReset();
      onClose();
    }, 2000);
  };

  const handleReset = () => {
    setStep('client');
    setSelectedClient(null);
    setSelectedCertificate('');
    setSelectedFile(null);
    setSearchQuery('');
    setError(null);
  };

  const handleClose = () => {
    if (!isUploading) {
      handleReset();
      onClose();
    }
  };

  const handleBack = () => {
    if (step === 'upload') {
      setStep('certificate');
      setSelectedFile(null);
    } else if (step === 'certificate') {
      setStep('client');
      setSelectedCertificate('');
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
          className="bg-card rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div>
              <h2 id="modal-title" style={{ fontSize: '24px', fontWeight: '600' }}>
                Upload Client Certificate
              </h2>
              <p className="text-muted-foreground text-[#404040] mt-1" style={{ fontSize: '14px' }}>
                {step === 'client' && 'Step 1 of 3: Select client'}
                {step === 'certificate' && 'Step 2 of 3: Select certificate type'}
                {step === 'upload' && 'Step 3 of 3: Upload document'}
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

          {/* Breadcrumb */}
          <div className="px-6 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => step !== 'client' && setStep('client')}
                className={`${
                  step === 'client' ? 'text-[#FF3000] font-medium' : 'text-muted-foreground'
                }`}
                style={{ fontSize: '13px' }}
              >
                Select Client
              </button>
              <span className="text-muted-foreground">›</span>
              <button
                onClick={() => step === 'upload' && setStep('certificate')}
                className={`${
                  step === 'certificate' ? 'text-[#FF3000] font-medium' : 'text-muted-foreground'
                }`}
                style={{ fontSize: '13px' }}
                disabled={!selectedClient}
              >
                Select Certificate
              </button>
              <span className="text-muted-foreground">›</span>
              <span
                className={`${step === 'upload' ? 'text-[#FF3000] font-medium' : 'text-muted-foreground'}`}
                style={{ fontSize: '13px' }}
              >
                Upload
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Client Selection */}
            {step === 'client' && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="partner-search-input"
                    className="block mb-2"
                    style={{ fontSize: '13px', fontWeight: '500' }}
                  >
                    Search Clients
                  </label>
                  <input
                    id="partner-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by company name or RC number..."
                    className="w-full px-3 py-2 rounded-md border border-border bg-background"
                    style={{ fontSize: '13px' }}
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className="w-full p-4 rounded-lg border border-border hover:border-[#FF3000] hover:bg-[#ffe6e6] transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 style={{ fontSize: '15px', fontWeight: '500' }}>
                            {client.companyName}
                          </h3>
                          <p
                            className="text-muted-foreground text-[#404040]"
                            style={{ fontSize: '13px' }}
                          >
                            {client.rcNumber}
                          </p>
                        </div>
                        <div
                          className="px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor:
                              client.complianceScore >= 80
                                ? 'rgba(255, 48, 0, 0.1)'
                                : client.complianceScore >= 60
                                  ? 'rgba(255, 48, 0, 0.1)'
                                  : 'rgba(255, 48, 0, 0.1)',
                            color:
                              client.complianceScore >= 80
                                ? '#FF3000'
                                : client.complianceScore >= 60
                                  ? '#FF3000'
                                  : '#FF3000',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          {client.complianceScore}/100
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span style={{ fontSize: '13px' }}>
                          {client.activeCertificates}/{client.totalCertificates} certificates active
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Certificate Selection */}
            {step === 'certificate' && selectedClient && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
                    >
                      <Users className="w-5 h-5" style={{ color: '#FF3000' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>
                        {selectedClient.companyName}
                      </p>
                      <p
                        className="text-muted-foreground text-[#404040]"
                        style={{ fontSize: '13px' }}
                      >
                        {selectedClient.rcNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-3" style={{ fontSize: '13px', fontWeight: '500' }}>
                    Select Certificate Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {availableCertificates.map((cert) => (
                      <button
                        key={cert}
                        onClick={() => handleCertificateSelect(cert)}
                        className="p-3 rounded-lg border border-border hover:border-[#FF3000] hover:bg-[#ffe6e6] transition-all text-left flex items-center gap-3"
                      >
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{cert}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: File Upload */}
            {step === 'upload' && selectedClient && selectedCertificate && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '500' }} className="mb-1">
                        Client
                      </p>
                      <p
                        className="text-muted-foreground text-[#404040]"
                        style={{ fontSize: '13px' }}
                      >
                        {selectedClient.companyName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: '13px', fontWeight: '500' }} className="mb-1">
                        Certificate
                      </p>
                      <p
                        className="text-muted-foreground text-[#404040]"
                        style={{ fontSize: '13px' }}
                      >
                        {selectedCertificate.split(' - ')[0]}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    error ? 'border-red-500' : 'border-border'
                  }`}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'partner-upload-error' : undefined}
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
                        Drop certificate here or click to browse
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
                        id="partner-file-upload"
                      />
                      <label
                        htmlFor="partner-file-upload"
                        className="inline-block mt-4 px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                        style={{ fontSize: '13px' }}
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
                {error && (
                  <p
                    id="partner-upload-error"
                    className="text-red-500 text-sm mt-3 flex items-center gap-2"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
              <button
                onClick={step === 'client' ? handleClose : handleBack}
                disabled={isUploading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
                style={{ fontSize: '13px' }}
              >
                {step === 'client' ? 'Cancel' : 'Back'}
              </button>
              {step === 'upload' && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile}
                  aria-live="polite"
                  aria-busy={isUploading}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-md text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: '#FF3000', fontSize: '13px', fontWeight: '500' }}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                      <span className="sr-only" aria-live="polite">
                        Uploading certificate, please wait
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Upload Certificate
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
