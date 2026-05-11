import { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { useToast } from './ToastProvider';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVendor: (vendor: { rcNumber: string; companyName: string }) => void;
}

export function AddVendorModal({ isOpen, onClose, onAddVendor }: AddVendorModalProps) {
  const { showToast } = useToast();
  const [rcNumber, setRcNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errors, setErrors] = useState<{ rcNumber?: string; companyName?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!rcNumber.trim()) {
      newErrors.rcNumber = 'RC Number is required';
    } else if (!/^RC\d{7,}$/.test(rcNumber.toUpperCase())) {
      newErrors.rcNumber = 'RC Number must be in format RC1234567';
    }

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (companyName.length < 3) {
      newErrors.companyName = 'Company name must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('error', 'Validation Error', 'Please correct the errors in the form');
      return;
    }

    onAddVendor({
      rcNumber: rcNumber.toUpperCase(),
      companyName: companyName.trim(),
    });

    // Reset form
    setRcNumber('');
    setCompanyName('');
    setErrors({});
    onClose();

    showToast('success', 'Vendor Added', `${companyName} has been added to the list`);
  };

  const handleClose = () => {
    setRcNumber('');
    setCompanyName('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-vendor-title"
    >
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
            >
              <Building2 className="w-5 h-5" style={{ color: '#FF3000' }} />
            </div>
            <h2 id="add-vendor-title" style={{ fontSize: '18px', fontWeight: 600 }}>
              Add Vendor
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="rc-number"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              RC Number <span className="text-red-500">*</span>
            </label>
            <input
              id="rc-number"
              type="text"
              value={rcNumber}
              onChange={(e) => {
                setRcNumber(e.target.value);
                setErrors({ ...errors, rcNumber: undefined });
              }}
              placeholder="RC1234567"
              className="w-full px-4 py-2 bg-input-background border rounded-md"
              style={{ borderColor: errors.rcNumber ? '#ef4444' : 'var(--border)' }}
              aria-invalid={!!errors.rcNumber}
              aria-describedby={errors.rcNumber ? 'rc-number-error' : undefined}
            />
            {errors.rcNumber && (
              <p id="rc-number-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.rcNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="company-name"
              className="block mb-2"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="company-name"
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors({ ...errors, companyName: undefined });
              }}
              placeholder="Enter company name"
              className="w-full px-4 py-2 bg-input-background border rounded-md"
              style={{ borderColor: errors.companyName ? '#ef4444' : 'var(--border)' }}
              aria-invalid={!!errors.companyName}
              aria-describedby={errors.companyName ? 'company-name-error' : undefined}
            />
            {errors.companyName && (
              <p id="company-name-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.companyName}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-md text-white"
              style={{ backgroundColor: '#FF3000' }}
            >
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}