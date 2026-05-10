import { Download, Upload, Plus, CheckCircle2, XCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface Vendor {
  id: string;
  rcNumber: string;
  companyName: string;
  score: number;
  status: 'qualified' | 'attention' | 'disqualified';
  submissionDate: string;
}

export function MDAPrequalificationView() {
  const { showToast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      rcNumber: 'RC1234567',
      companyName: 'TechBuild Nigeria Ltd',
      score: 73,
      status: 'attention',
      submissionDate: '8 May 2026',
    },
    {
      id: '2',
      rcNumber: 'RC7654321',
      companyName: 'BuildCo Construction Ltd',
      score: 92,
      status: 'qualified',
      submissionDate: '8 May 2026',
    },
    {
      id: '3',
      rcNumber: 'RC9876543',
      companyName: 'Alpha Services Ltd',
      score: 28,
      status: 'disqualified',
      submissionDate: '8 May 2026',
    },
    {
      id: '4',
      rcNumber: 'RC1122334',
      companyName: 'ProServe Engineering',
      score: 88,
      status: 'qualified',
      submissionDate: '7 May 2026',
    },
    {
      id: '5',
      rcNumber: 'RC5566778',
      companyName: 'Delta Logistics Ltd',
      score: 65,
      status: 'attention',
      submissionDate: '7 May 2026',
    },
  ]);

  const [listName, setListName] = useState('Infrastructure Project Q2 2026');
  const [tenderNumber, setTenderNumber] = useState('FGN/MDA/2026/045');
  const [errors, setErrors] = useState<{
    listName?: string;
    tenderNumber?: string;
  }>({});

  const qualifiedCount = vendors.filter((v) => v.status === 'qualified').length;
  const attentionCount = vendors.filter((v) => v.status === 'attention').length;
  const disqualifiedCount = vendors.filter((v) => v.status === 'disqualified').length;
  const avgScore = Math.round(vendors.reduce((sum, v) => sum + v.score, 0) / vendors.length);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!listName.trim()) {
      newErrors.listName = 'List name is required';
    } else if (listName.length < 5) {
      newErrors.listName = 'List name must be at least 5 characters';
    }

    if (!tenderNumber.trim()) {
      newErrors.tenderNumber = 'Tender number is required';
    } else if (!tenderNumber.includes('/')) {
      newErrors.tenderNumber = 'Please enter a valid tender number format (e.g., FGN/MDA/2026/045)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateReport = () => {
    if (!validateForm()) {
      showToast('error', 'Validation Error', 'Please correct the errors in the form');
      return;
    }
    // ... existing generate logic
  };

  const getStatusConfig = (status: Vendor['status']) => {
    switch (status) {
      case 'qualified':
        return {
          icon: CheckCircle2,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.1)',
          label: 'Pre-Qualified',
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.1)',
          label: 'Needs Review',
        };
      case 'disqualified':
        return {
          icon: XCircle,
          color: '#FF3000',
          bgColor: 'rgba(255, 48, 0, 0.1)',
          label: 'Disqualified',
        };
    }
  };

  const removeVendor = (id: string) => {
    const vendor = vendors.find((v) => v.id === id);
    if (
      window.confirm(
        `Are you sure you want to remove ${vendor?.companyName} from the pre-qualification list? This action cannot be undone.`
      )
    ) {
      setVendors(vendors.filter((v) => v.id !== id));
      showToast(
        'success',
        'Vendor Removed',
        `${vendor?.companyName} has been removed from the list`
      );
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <h1 style={{ fontSize: '32px' }}>Pre-Qualification List</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Import Bidders
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2.5 rounded-md text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#FF3000' }}
              >
                <Plus className="w-4 h-4" />
                Add Vendor
              </button>
            </div>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Manage vendor pre-qualification lists for tender evaluation
          </p>
        </div>

        {/* List Details */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="list-name-input"
                className="block mb-2"
                style={{ fontSize: '14px', fontWeight: '500' }}
              >
                Pre-Qualification List Name{' '}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="list-name-input"
                type="text"
                value={listName}
                onChange={(e) => {
                  setListName(e.target.value);
                  setErrors({ ...errors, listName: undefined });
                }}
                required
                aria-invalid={!!errors.listName}
                aria-describedby={errors.listName ? 'list-name-error' : undefined}
                className={`w-full px-4 py-2 bg-input-background border rounded-md ${
                  errors.listName ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.listName && (
                <p
                  id="list-name-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.listName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="tender-number-input"
                className="block mb-2"
                style={{ fontSize: '14px', fontWeight: '500' }}
              >
                Tender Number{' '}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="tender-number-input"
                type="text"
                value={tenderNumber}
                onChange={(e) => {
                  setTenderNumber(e.target.value);
                  setErrors({ ...errors, tenderNumber: undefined });
                }}
                required
                aria-invalid={!!errors.tenderNumber}
                aria-describedby={errors.tenderNumber ? 'tender-number-error' : undefined}
                className={`w-full px-4 py-2 bg-input-background border rounded-md ${
                  errors.tenderNumber ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.tenderNumber && (
                <p
                  id="tender-number-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.tenderNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Total Vendors</p>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>{vendors.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Pre-Qualified</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: '#FF3000' }}>
              {qualifiedCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Needs Review</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: '#FF3000' }}>
              {attentionCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Disqualified</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: '#FF3000' }}>
              {disqualifiedCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Avg Score</p>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>{avgScore}</p>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 style={{ fontSize: '18px', fontWeight: '500' }}>Vendors ({vendors.length})</h2>
            <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export List
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">
                List of vendors in pre-qualification with their RC numbers, company names,
                submission dates, and scores
              </caption>
              <thead className="bg-muted/50">
                <tr>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    scope="col"
                  >
                    RC NUMBER
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    scope="col"
                  >
                    COMPANY NAME
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    scope="col"
                  >
                    SUBMISSION DATE
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    scope="col"
                  >
                    SCORE
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    scope="col"
                  >
                    STATUS
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    scope="col"
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => {
                  const config = getStatusConfig(vendor.status);
                  const StatusIcon = config.icon;

                  return (
                    <tr
                      key={vendor.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>
                          {vendor.rcNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {vendor.companyName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="caption text-muted-foreground">
                          {vendor.submissionDate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: config.color,
                          }}
                        >
                          {vendor.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full flex items-center gap-2 w-fit"
                          style={{
                            backgroundColor: config.bgColor,
                            color: config.color,
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 rounded-md border border-border hover:bg-muted transition-colors">
                            <span style={{ fontSize: '12px' }}>View Details</span>
                          </button>
                          <button
                            onClick={() => removeVendor(vendor.id)}
                            aria-label="Remove vendor"
                            className="p-2.5 rounded-md hover:bg-red-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <h2 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
            Finalize Pre-Qualification
          </h2>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
            Once you've reviewed all vendors, you can generate the official pre-qualification report
            for tender evaluation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGenerateReport}
              className="w-full sm:w-auto px-6 py-2.5 rounded-md text-white"
              style={{ backgroundColor: '#FF3000' }}
            >
              Generate Pre-Qualification Report
            </button>
            <button
              onClick={handleGenerateReport}
              className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
