import {
  Download,
  Upload,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from './ToastProvider';
import { AddVendorModal } from './AddVendorModal';
import { ImportBiddersModal } from './ImportBiddersModal';
import '../../app/styles/mda-theme.css';

interface Vendor {
  id: string;
  rcNumber: string;
  companyName: string;
  score: number;
  status: 'qualified' | 'attention' | 'disqualified';
  submissionDate: string;
}

interface TenderList {
  id: string;
  name: string;
  tenderNumber: string;
  vendors: Vendor[];
}

const INITIAL_TENDERS: TenderList[] = [
  {
    id: 'tender-1',
    name: 'Infrastructure Project Q2 2026',
    tenderNumber: 'FGN/MDA/2026/045',
    vendors: [
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
    ],
  },
  {
    id: 'tender-2',
    name: 'NHIA Medical Supplies & Equipment 2026',
    tenderNumber: 'NHIA/PROC/2026/012',
    vendors: [
      {
        id: 't2-1',
        rcNumber: 'RC2255667',
        companyName: 'Apex Healthcare Ltd',
        score: 96,
        status: 'qualified',
        submissionDate: '12 May 2026',
      },
      {
        id: 't2-2',
        rcNumber: 'RC9988776',
        companyName: 'GreenEnergy Solutions',
        score: 95,
        status: 'qualified',
        submissionDate: '12 May 2026',
      },
      {
        id: 't2-3',
        rcNumber: 'RC6677889',
        companyName: 'Sunrise Pharmaceuticals Ltd',
        score: 91,
        status: 'qualified',
        submissionDate: '11 May 2026',
      },
      {
        id: 't2-4',
        rcNumber: 'RC3344556',
        companyName: 'FinTech Innovations Ltd',
        score: 88,
        status: 'qualified',
        submissionDate: '11 May 2026',
      },
      {
        id: 't2-5',
        rcNumber: 'RC5577889',
        companyName: 'Sterling Medical Supplies',
        score: 84,
        status: 'qualified',
        submissionDate: '11 May 2026',
      },
      {
        id: 't2-6',
        rcNumber: 'RC4455667',
        companyName: 'MediCare Health Services Ltd',
        score: 82,
        status: 'qualified',
        submissionDate: '10 May 2026',
      },
      {
        id: 't2-7',
        rcNumber: 'RC7788990',
        companyName: 'EduPrime Schools Ltd',
        score: 79,
        status: 'qualified',
        submissionDate: '10 May 2026',
      },
      {
        id: 't2-8',
        rcNumber: 'RC1188990',
        companyName: 'NovaMed Industries Ltd',
        score: 77,
        status: 'qualified',
        submissionDate: '10 May 2026',
      },
      {
        id: 't2-9',
        rcNumber: 'RC8899001',
        companyName: 'GoldLine Engineering Works',
        score: 72,
        status: 'attention',
        submissionDate: '9 May 2026',
      },
      {
        id: 't2-10',
        rcNumber: 'RC2233445',
        companyName: 'AgriGrow Nigeria Ltd',
        score: 64,
        status: 'attention',
        submissionDate: '9 May 2026',
      },
      {
        id: 't2-11',
        rcNumber: 'RC7788001',
        companyName: 'Atlantic Distributors Ltd',
        score: 68,
        status: 'attention',
        submissionDate: '9 May 2026',
      },
      {
        id: 't2-12',
        rcNumber: 'RC6677001',
        companyName: 'Beacon Pharmaceuticals',
        score: 61,
        status: 'attention',
        submissionDate: '8 May 2026',
      },
      {
        id: 't2-13',
        rcNumber: 'RC3366778',
        companyName: 'Gateway ICT Solutions',
        score: 57,
        status: 'attention',
        submissionDate: '8 May 2026',
      },
      {
        id: 't2-14',
        rcNumber: 'RC4477002',
        companyName: 'Pinnacle Contractors Ltd',
        score: 41,
        status: 'disqualified',
        submissionDate: '7 May 2026',
      },
      {
        id: 't2-15',
        rcNumber: 'RC1144556',
        companyName: 'Coastal Freight Nigeria',
        score: 32,
        status: 'disqualified',
        submissionDate: '7 May 2026',
      },
      {
        id: 't2-16',
        rcNumber: 'RC2255001',
        companyName: 'Omega Health Logistics',
        score: 25,
        status: 'disqualified',
        submissionDate: '6 May 2026',
      },
      {
        id: 't2-17',
        rcNumber: 'RC9876543',
        companyName: 'Alpha Services Ltd',
        score: 28,
        status: 'disqualified',
        submissionDate: '6 May 2026',
      },
      {
        id: 't2-18',
        rcNumber: 'RC0011223',
        companyName: 'MaxCon Building Solutions',
        score: 18,
        status: 'disqualified',
        submissionDate: '5 May 2026',
      },
    ],
  },
];

export function MDAPrequalificationView() {
  const { showToast } = useToast();
  const [tenders, setTenders] = useState<TenderList[]>(INITIAL_TENDERS);
  const [activeTenderIdx, setActiveTenderIdx] = useState(0);
  const [errors, setErrors] = useState<{ listName?: string; tenderNumber?: string }>({});

  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [isImportBiddersModalOpen, setIsImportBiddersModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const activeTender = tenders[activeTenderIdx];
  const vendors = activeTender.vendors;
  const listName = activeTender.name;
  const tenderNumber = activeTender.tenderNumber;

  const setVendors = (updater: Vendor[] | ((prev: Vendor[]) => Vendor[])) => {
    setTenders((prev) =>
      prev.map((t, i) =>
        i === activeTenderIdx
          ? { ...t, vendors: typeof updater === 'function' ? updater(t.vendors) : updater }
          : t
      )
    );
  };

  const setListName = (name: string) =>
    setTenders((prev) => prev.map((t, i) => (i === activeTenderIdx ? { ...t, name } : t)));

  const setTenderNumber = (tn: string) =>
    setTenders((prev) =>
      prev.map((t, i) => (i === activeTenderIdx ? { ...t, tenderNumber: tn } : t))
    );

  const qualifiedCount = vendors.filter((v) => v.status === 'qualified').length;
  const attentionCount = vendors.filter((v) => v.status === 'attention').length;
  const disqualifiedCount = vendors.filter((v) => v.status === 'disqualified').length;
  const avgScore = vendors.length
    ? Math.round(vendors.reduce((sum, v) => sum + v.score, 0) / vendors.length)
    : 0;

  useEffect(() => {
    try {
      const raw = localStorage.getItem('clearpass.mda.prequalification.pendingVendor');
      if (!raw) return;
      localStorage.removeItem('clearpass.mda.prequalification.pendingVendor');
      const pending = JSON.parse(raw) as Pick<
        Vendor,
        'rcNumber' | 'companyName' | 'score' | 'status'
      >;
      if (!pending.rcNumber || vendors.some((v) => v.rcNumber === pending.rcNumber)) return;
      const submissionDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      queueMicrotask(() => {
        setVendors((prev) => [
          {
            id: Date.now().toString(),
            rcNumber: pending.rcNumber,
            companyName: pending.companyName,
            score: pending.score,
            status: pending.status,
            submissionDate,
          },
          ...prev,
        ]);
        showToast('success', 'Vendor Added', `${pending.companyName} added to this list.`);
      });
    } catch {
      // ignore malformed pending data
    }
    // Run once when this view opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      newErrors.tenderNumber =
        'Please enter a valid tender number format (e.g., FGN/MDA/2026/045)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateReport = () => {
    if (!validateForm()) {
      showToast('error', 'Validation Error', 'Please correct the errors in the form');
      return;
    }
    exportPrequalificationCsv('report');
  };

  const exportPrequalificationCsv = (kind: 'report' | 'draft' | 'list') => {
    const header = 'Tender Number,List Name,RC Number,Company Name,Score,Status,Submission Date\n';
    const rows = vendors
      .map(
        (v) =>
          `${tenderNumber},${listName},${v.rcNumber},${v.companyName},${v.score},${v.status},${v.submissionDate}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mda-prequalification-${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      'success',
      kind === 'draft' ? 'Draft Saved' : 'Export Complete',
      kind === 'draft'
        ? 'Pre-qualification draft downloaded.'
        : 'Pre-qualification list downloaded.'
    );
  };

  const getStatusConfig = (status: Vendor['status']) => {
    switch (status) {
      case 'qualified':
        return {
          icon: CheckCircle2,
          color: 'var(--mda-success)',
          bgColor: 'var(--mda-success-light)',
          label: 'Pre-Qualified',
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          color: 'var(--mda-warning)',
          bgColor: 'var(--mda-warning-light)',
          label: 'Needs Review',
        };
      case 'disqualified':
        return {
          icon: XCircle,
          color: 'var(--mda-error)',
          bgColor: 'var(--mda-error-light)',
          label: 'Disqualified',
        };
    }
  };

  const removeVendor = (id: string) => {
    const vendor = vendors.find((v) => v.id === id);
    setVendors(vendors.filter((v) => v.id !== id));
    showToast(
      'success',
      'Vendor Removed',
      `${vendor?.companyName} has been removed from the list`
    );
  };

  const handleAddVendor = (vendorData: { rcNumber: string; companyName: string }) => {
    if (vendors.some((v) => v.rcNumber === vendorData.rcNumber)) {
      showToast('error', 'Duplicate Vendor', 'A vendor with this RC Number already exists');
      return;
    }

    const newVendor: Vendor = {
      id: Date.now().toString(),
      rcNumber: vendorData.rcNumber,
      companyName: vendorData.companyName,
      score: 0,
      status: 'attention',
      submissionDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setVendors([...vendors, newVendor]);
  };

  const handleImportBidders = (bidders: Array<{ rcNumber: string; companyName: string }>) => {
    const existingRcNumbers = new Set(vendors.map((v) => v.rcNumber));
    const newBidders = bidders.filter((b) => !existingRcNumbers.has(b.rcNumber));

    if (newBidders.length === 0) {
      showToast('info', 'No New Vendors', 'All bidders already exist in the list');
      return;
    }

    const vendorsToAdd: Vendor[] = newBidders.map((bidder) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      rcNumber: bidder.rcNumber,
      companyName: bidder.companyName,
      score: 0,
      status: 'attention',
      submissionDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    }));

    setVendors([...vendors, ...vendorsToAdd]);
    showToast(
      'success',
      'Bidders Imported',
      `${vendorsToAdd.length} bidder${vendorsToAdd.length !== 1 ? 's' : ''} imported successfully`
    );
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <h1 className="cp-page-title">Pre-Qualification Lists</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsImportBiddersModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Bidders
              </button>
              <button
                onClick={() => setIsAddVendorModalOpen(true)}
                className="cp-shimmer w-full sm:w-auto px-4 py-2.5 rounded-md text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--mda-primary)' }}
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

        {/* Tender tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tenders.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTenderIdx(i);
                setErrors({});
              }}
              className="px-4 py-2 rounded-md whitespace-nowrap transition-colors"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor:
                  activeTenderIdx === i ? 'var(--mda-primary)' : undefined,
                color: activeTenderIdx === i ? 'white' : undefined,
                border: activeTenderIdx === i ? 'none' : '1px solid var(--border)',
              }}
            >
              {t.name}
            </button>
          ))}
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
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'var(--mda-success)' }}>
              {qualifiedCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Needs Review</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'var(--mda-warning)' }}>
              {attentionCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Disqualified</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'var(--mda-error)' }}>
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
            <h2 className="cp-section-title">Vendors ({vendors.length})</h2>
            <button
              onClick={() => exportPrequalificationCsv('list')}
              className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
            >
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
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="px-3 py-1 rounded-md border border-border hover:bg-muted transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
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
              style={{ backgroundColor: 'var(--mda-primary)' }}
            >
              Generate Pre-Qualification Report
            </button>
            <button
              onClick={() => {
                if (!validateForm()) {
                  showToast('error', 'Validation Error', 'Please correct the errors in the form');
                  return;
                }
                exportPrequalificationCsv('draft');
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
            >
              Save as Draft
            </button>
          </div>
        </div>

        {/* Modals */}
        <AddVendorModal
          isOpen={isAddVendorModalOpen}
          onClose={() => setIsAddVendorModalOpen(false)}
          onAddVendor={handleAddVendor}
        />

        <ImportBiddersModal
          isOpen={isImportBiddersModalOpen}
          onClose={() => setIsImportBiddersModalOpen(false)}
          onImportBidders={handleImportBidders}
        />

        {selectedVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card border border-border rounded-lg w-full max-w-md p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-semibold">Vendor Details</h2>
                  <p className="text-muted-foreground text-sm mt-1">{selectedVendor.rcNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="p-2 rounded-md hover:bg-muted"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium text-right">{selectedVendor.companyName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-medium">{selectedVendor.score}/100</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">
                    {getStatusConfig(selectedVendor.status).label}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Submission Date</span>
                  <span className="font-medium">{selectedVendor.submissionDate}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="mt-6 w-full px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
