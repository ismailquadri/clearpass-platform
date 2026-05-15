import { useState } from 'react';
import {
  Building2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from './ToastProvider';

interface CompanyProfileProps {
  onSave?: () => void;
}

interface CompanyData {
  companyName: string;
  rcNumber: string;
  taxId: string;
  businessAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website: string;
  sector: string;
  companySize: string;
  yearEstablished: string;
}

interface VerificationStatus {
  rcNumber: 'verified' | 'pending' | 'failed' | 'unverified';
  cacDocument: 'verified' | 'pending' | 'failed' | 'unverified';
  taxDocument: 'verified' | 'pending' | 'failed' | 'unverified';
}

export function CompanyProfile({ onSave }: CompanyProfileProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyData, string>>>({});
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: '',
    rcNumber: '',
    taxId: '',
    businessAddress: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    website: '',
    sector: '',
    companySize: '',
    yearEstablished: '',
  });

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    rcNumber: 'unverified',
    cacDocument: 'unverified',
    taxDocument: 'unverified',
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    cacDocument?: File;
    taxDocument?: File;
  }>({});

  const sectors = [
    'Construction',
    'Technology',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Agriculture',
    'Energy',
    'Transportation',
    'Financial Services',
    'Professional Services',
    'Other',
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees',
  ];

  const validateRCNumber = (rc: string): boolean => {
    return /^RC\d{7,}$/i.test(rc);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^0[789]\d{9}$/.test(phone);
  };

  const verifyRCNumber = async () => {
    if (!validateRCNumber(companyData.rcNumber)) {
      setErrors((prev) => ({
        ...prev,
        rcNumber: 'RC number must be in format RC1234567',
      }));
      return;
    }

    setIsVerifying(true);
    setVerificationStatus((prev) => ({ ...prev, rcNumber: 'pending' }));

    try {
      // Simulate API call to CAC
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, we'll accept any valid format
      setVerificationStatus((prev) => ({ ...prev, rcNumber: 'verified' }));
      showToast('success', 'RC Number Verified', 'Company successfully verified with CAC');
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.rcNumber;
        return newErrors;
      });
    } catch {
      setVerificationStatus((prev) => ({ ...prev, rcNumber: 'failed' }));
      showToast(
        'error',
        'Verification Failed',
        'Could not verify RC number with CAC. Please check the number and try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileUpload = (type: 'cacDocument' | 'taxDocument', file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: file }));
    setVerificationStatus((prev) => ({ ...prev, [type]: 'pending' }));

    // Simulate document verification
    setTimeout(() => {
      setVerificationStatus((prev) => ({ ...prev, [type]: 'verified' }));
      showToast('success', 'Document Uploaded', `${type === 'cacDocument' ? 'CAC' : 'Tax'} document uploaded successfully`);
    }, 1500);
  };

  const handleRemoveFile = (type: 'cacDocument' | 'taxDocument') => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
    setVerificationStatus((prev) => ({ ...prev, [type]: 'unverified' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyData, string>> = {};

    if (!companyData.companyName) {
      newErrors.companyName = 'Company name is required';
    }

    if (!companyData.rcNumber) {
      newErrors.rcNumber = 'RC number is required';
    } else if (!validateRCNumber(companyData.rcNumber)) {
      newErrors.rcNumber = 'RC number must be in format RC1234567';
    } else if (verificationStatus.rcNumber !== 'verified') {
      newErrors.rcNumber = 'Please verify your RC number';
    }

    if (!companyData.businessAddress) {
      newErrors.businessAddress = 'Business address is required';
    }

    if (!companyData.city) {
      newErrors.city = 'City is required';
    }

    if (!companyData.state) {
      newErrors.state = 'State is required';
    }

    if (!companyData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(companyData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Nigerian phone number';
    }

    if (!companyData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(companyData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!companyData.sector) {
      newErrors.sector = 'Sector is required';
    }

    if (!companyData.companySize) {
      newErrors.companySize = 'Company size is required';
    }

    if (!companyData.yearEstablished) {
      newErrors.yearEstablished = 'Year established is required';
    } else {
      const year = parseInt(companyData.yearEstablished);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        newErrors.yearEstablished = 'Please enter a valid year';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call to save company profile
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast('success', 'Profile Saved', 'Your company profile has been updated successfully');
      onSave?.();
    } catch (error) {
      showToast(
        'error',
        'Save Failed',
        error instanceof Error ? error.message : 'An error occurred while saving your profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompanyData = (field: keyof CompanyData, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Reset RC verification if RC number changes
    if (field === 'rcNumber') {
      setVerificationStatus((prev) => ({ ...prev, rcNumber: 'unverified' }));
    }
  };

  const getStatusIcon = (status: VerificationStatus[keyof VerificationStatus]) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: VerificationStatus[keyof VerificationStatus]) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Verifying...';
      case 'failed':
        return 'Verification Failed';
      default:
        return 'Not Verified';
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-[#FF3000]" />
            <h1 className="cp-page-title">Company Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your company information and verify your business details
          </p>
        </header>

        {/* Verification Status Banner */}
        {(verificationStatus.rcNumber === 'verified' ||
          verificationStatus.cacDocument === 'verified' ||
          verificationStatus.taxDocument === 'verified') && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Verification Progress</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationStatus.rcNumber)}
                <span className="text-green-800">RC Number: {getStatusText(verificationStatus.rcNumber)}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationStatus.cacDocument)}
                <span className="text-green-800">CAC Document: {getStatusText(verificationStatus.cacDocument)}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationStatus.taxDocument)}
                <span className="text-green-800">Tax Document: {getStatusText(verificationStatus.taxDocument)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Company Information */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Company Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block mb-2 text-sm font-medium">
                Company Name *
              </label>
              <input
                id="companyName"
                type="text"
                value={companyData.companyName}
                onChange={(e) => updateCompanyData('companyName', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.companyName ? 'border-red-500' : 'border-border'
                } bg-input-background`}
                placeholder="Your Company Limited"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* RC Number */}
            <div>
              <label htmlFor="rcNumber" className="block mb-2 text-sm font-medium">
                RC Number *
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    id="rcNumber"
                    type="text"
                    value={companyData.rcNumber}
                    onChange={(e) => updateCompanyData('rcNumber', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 rounded-md border ${
                      errors.rcNumber ? 'border-red-500' : 'border-border'
                    } bg-input-background`}
                    placeholder="RC1234567"
                  />
                  {verificationStatus.rcNumber !== 'unverified' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getStatusIcon(verificationStatus.rcNumber)}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={verifyRCNumber}
                  disabled={isVerifying || verificationStatus.rcNumber === 'verified'}
                  className="px-4 py-3 rounded-md bg-[#FF3000] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
              {errors.rcNumber && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.rcNumber}
                </p>
              )}
            </div>

            {/* Tax ID */}
            <div>
              <label htmlFor="taxId" className="block mb-2 text-sm font-medium">
                Tax ID
              </label>
              <input
                id="taxId"
                type="text"
                value={companyData.taxId}
                onChange={(e) => updateCompanyData('taxId', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-md border border-border bg-input-background"
                placeholder="12345678-0001"
              />
            </div>

            {/* Sector */}
            <div>
              <label htmlFor="sector" className="block mb-2 text-sm font-medium">
                Business Sector *
              </label>
              <select
                id="sector"
                value={companyData.sector}
                onChange={(e) => updateCompanyData('sector', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.sector ? 'border-red-500' : 'border-border'
                } bg-input-background`}
              >
                <option value="">Select sector</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              {errors.sector && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.sector}
                </p>
              )}
            </div>

            {/* Company Size */}
            <div>
              <label htmlFor="companySize" className="block mb-2 text-sm font-medium">
                Company Size *
              </label>
              <select
                id="companySize"
                value={companyData.companySize}
                onChange={(e) => updateCompanyData('companySize', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.companySize ? 'border-red-500' : 'border-border'
                } bg-input-background`}
              >
                <option value="">Select company size</option>
                {companySizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {errors.companySize && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.companySize}
                </p>
              )}
            </div>

            {/* Year Established */}
            <div>
              <label htmlFor="yearEstablished" className="block mb-2 text-sm font-medium">
                Year Established *
              </label>
              <input
                id="yearEstablished"
                type="number"
                value={companyData.yearEstablished}
                onChange={(e) => updateCompanyData('yearEstablished', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.yearEstablished ? 'border-red-500' : 'border-border'
                } bg-input-background`}
                placeholder="2010"
                min="1900"
                max={new Date().getFullYear()}
              />
              {errors.yearEstablished && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.yearEstablished}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Address */}
            <div className="md:col-span-2">
              <label htmlFor="businessAddress" className="block mb-2 text-sm font-medium">
                Business Address *
              </label>
              <input
                id="businessAddress"
                type="text"
                value={companyData.businessAddress}
                onChange={(e) => updateCompanyData('businessAddress', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.businessAddress ? 'border-red-500' : 'border-border'
                } bg-input-background`}
                placeholder="123 Business Street, Ikeja"
              />
              {errors.businessAddress && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.businessAddress}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block mb-2 text-sm font-medium">
                City *
              </label>
              <input
                id="city"
                type="text"
                value={companyData.city}
                onChange={(e) => updateCompanyData('city', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.city ? 'border-red-500' : 'border-border'
                } bg-input-background`}
                placeholder="Lagos"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.city}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block mb-2 text-sm font-medium">
                State *
              </label>
              <input
                id="state"
                type="text"
                value={companyData.state}
                onChange={(e) => updateCompanyData('state', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.state ? 'border-red-500' : 'border-border'
                } bg-input-background`}
                placeholder="Lagos State"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.state}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block mb-2 text-sm font-medium">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                value={companyData.postalCode}
                onChange={(e) => updateCompanyData('postalCode', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border bg-input-background"
                placeholder="100001"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium">
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={companyData.phoneNumber}
                onChange={(e) => updateCompanyData('phoneNumber', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-border'
                } bg-input-background`}
                placeholder="08012345678"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={companyData.email}
                onChange={(e) => updateCompanyData('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-border'
                } bg-input-background`}
                placeholder="info@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block mb-2 text-sm font-medium">
                Website
              </label>
              <input
                id="website"
                type="url"
                value={companyData.website}
                onChange={(e) => updateCompanyData('website', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border bg-input-background"
                placeholder="https://www.company.com"
              />
            </div>
          </div>
        </div>

        {/* Document Uploads */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Document Uploads</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CAC Document */}
            <div>
              <label className="block mb-2 text-sm font-medium">CAC Certificate</label>
              {uploadedFiles.cacDocument ? (
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#FF3000]" />
                      <span className="text-sm font-medium">{uploadedFiles.cacDocument.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(verificationStatus.cacDocument)}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('cacDocument')}
                        className="p-1 hover:bg-muted rounded-md"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload CAC registration certificate
                  </p>
                  <label className="inline-block px-4 py-2 rounded-md bg-[#FF3000] text-white hover:opacity-90 transition-opacity cursor-pointer text-sm">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('cacDocument', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Tax Document */}
            <div>
              <label className="block mb-2 text-sm font-medium">Tax Clearance Certificate</label>
              {uploadedFiles.taxDocument ? (
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#FF3000]" />
                      <span className="text-sm font-medium">{uploadedFiles.taxDocument.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(verificationStatus.taxDocument)}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('taxDocument')}
                        className="p-1 hover:bg-muted rounded-md"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload tax clearance certificate
                  </p>
                  <label className="inline-block px-4 py-2 rounded-md bg-[#FF3000] text-white hover:opacity-90 transition-opacity cursor-pointer text-sm">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('taxDocument', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#FF3000] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}