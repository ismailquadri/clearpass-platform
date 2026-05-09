import { Download, Upload, Plus, CheckCircle2, XCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Vendor {
  id: string;
  rcNumber: string;
  companyName: string;
  score: number;
  status: 'qualified' | 'attention' | 'disqualified';
  submissionDate: string;
}

export function MDAPrequalificationView() {
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

  const qualifiedCount = vendors.filter((v) => v.status === 'qualified').length;
  const attentionCount = vendors.filter((v) => v.status === 'attention').length;
  const disqualifiedCount = vendors.filter((v) => v.status === 'disqualified').length;
  const avgScore = Math.round(vendors.reduce((sum, v) => sum + v.score, 0) / vendors.length);

  const getStatusConfig = (status: Vendor['status']) => {
    switch (status) {
      case 'qualified':
        return {
          icon: CheckCircle2,
          color: 'rgb(31, 193, 107)',
          bgColor: 'rgb(31, 193, 107, 0.1)',
          label: 'Pre-Qualified',
        };
      case 'attention':
        return {
          icon: AlertTriangle,
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
          label: 'Needs Review',
        };
      case 'disqualified':
        return {
          icon: XCircle,
          color: 'rgb(251, 55, 72)',
          bgColor: 'rgb(251, 55, 72, 0.1)',
          label: 'Disqualified',
        };
    }
  };

  const removeVendor = (id: string) => {
    setVendors(vendors.filter((v) => v.id !== id));
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 style={{ fontSize: '32px' }}>Pre-Qualification List</h1>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Bidders
              </button>
              <button
                className="px-4 py-2 rounded-md text-white flex items-center gap-2"
                style={{ backgroundColor: 'rgb(251, 115, 25)' }}
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                Pre-Qualification List Name
              </label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                Tender Number
              </label>
              <input
                type="text"
                value={tenderNumber}
                onChange={(e) => setTenderNumber(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Total Vendors</p>
            <p style={{ fontSize: '32px', fontWeight: '600' }}>{vendors.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Pre-Qualified</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(31, 193, 107)' }}>
              {qualifiedCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Needs Review</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(250, 115, 25)' }}>
              {attentionCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="caption text-muted-foreground mb-1">Disqualified</p>
            <p style={{ fontSize: '32px', fontWeight: '600', color: 'rgb(251, 55, 72)' }}>
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
            <h3 style={{ fontSize: '18px', fontWeight: '500' }}>Vendors ({vendors.length})</h3>
            <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export List
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  >
                    RC NUMBER
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  >
                    COMPANY NAME
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  >
                    SUBMISSION DATE
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  >
                    SCORE
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  >
                    STATUS
                  </th>
                  <th
                    className="px-6 py-3 text-left"
                    style={{ fontSize: '12px', fontWeight: '500' }}
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
                            className="p-1 rounded-md hover:bg-red-100 transition-colors"
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
          <h3 className="mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>
            Finalize Pre-Qualification
          </h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
            Once you've reviewed all vendors, you can generate the official pre-qualification report
            for tender evaluation.
          </p>
          <div className="flex gap-3">
            <button
              className="px-6 py-2 rounded-md text-white"
              style={{ backgroundColor: 'rgb(251, 115, 25)' }}
            >
              Generate Pre-Qualification Report
            </button>
            <button className="px-6 py-2 rounded-md border border-border hover:bg-muted transition-colors">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
