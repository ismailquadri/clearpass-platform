/**
 * Validation utilities for forms and user input
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// File validation
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a PDF or image file (JPEG, PNG)',
    };
  }

  return { isValid: true };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone number validation (Nigeria format)
export function validatePhoneNumber(phone: string): boolean {
  // Accept formats: +234 XXX XXX XXXX, 0XXX XXX XXXX, XXX XXX XXXX
  const phoneRegex = /^(\+234|0)?[789]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// RC Number validation (Nigeria company registration)
export function validateRCNumber(rcNumber: string): boolean {
  // Format: RC followed by 7 digits
  const rcRegex = /^RC\d{7}$/i;
  return rcRegex.test(rcNumber.toUpperCase().replace(/\s/g, ''));
}

// Company name validation
export function validateCompanyName(name: string): boolean {
  return name.trim().length >= 3 && name.trim().length <= 200;
}

// Certificate number validation
export function validateCertificateNumber(certNumber: string): boolean {
  return certNumber.trim().length >= 5 && certNumber.trim().length <= 50;
}

// Form validation helpers
export function getErrorMessage(errors: Record<string, string>): string | null {
  const errorKeys = Object.keys(errors);
  if (errorKeys.length === 0) return null;
  return errors[errorKeys[0]];
}

export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}

// Certificate upload form validation
export interface CertificateUploadFormData {
  clientId: string;
  certificateType: string;
  file: File | null;
}

export function validateCertificateUploadForm(data: CertificateUploadFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.clientId) {
    errors.clientId = 'Please select a client';
  }

  if (!data.certificateType) {
    errors.certificateType = 'Please select a certificate type';
  }

  if (!data.file) {
    errors.file = 'Please select a file to upload';
  } else {
    const fileValidation = validateFile(data.file);
    if (!fileValidation.isValid) {
      errors.file = fileValidation.error || 'Invalid file';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Client management form validation
export interface ClientManagementFormData {
  permissions: string[];
}

export function validateClientManagementForm(data: ClientManagementFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.permissions || data.permissions.length === 0) {
    errors.permissions = 'Please select at least one permission';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Report generation form validation
export interface ReportGenerationFormData {
  reportType: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  clientId?: string;
}

export function validateReportGenerationForm(data: ReportGenerationFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.reportType) {
    errors.reportType = 'Please select a report type';
  }

  if (!data.dateRange.startDate) {
    errors.startDate = 'Please select a start date';
  }

  if (!data.dateRange.endDate) {
    errors.endDate = 'Please select an end date';
  }

  if (data.dateRange.startDate && data.dateRange.endDate) {
    const startDate = new Date(data.dateRange.startDate);
    const endDate = new Date(data.dateRange.endDate);

    if (startDate > endDate) {
      errors.dateRange = 'Start date must be before end date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Settings form validation
export interface SettingsFormData {
  email: string;
  phone: string;
  companyName: string;
  rcNumber: string;
}

export function validateSettingsForm(data: SettingsFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhoneNumber(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.companyName) {
    errors.companyName = 'Company name is required';
  } else if (!validateCompanyName(data.companyName)) {
    errors.companyName = 'Company name must be between 3 and 200 characters';
  }

  if (!data.rcNumber) {
    errors.rcNumber = 'RC number is required';
  } else if (!validateRCNumber(data.rcNumber)) {
    errors.rcNumber = 'Please enter a valid RC number (e.g., RC1234567)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}