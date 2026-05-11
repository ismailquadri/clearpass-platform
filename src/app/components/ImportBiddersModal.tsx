import { useState, useRef } from 'react';
import { X, Upload, FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from './ToastProvider';

interface ImportBiddersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBidders: (bidders: Array<{ rcNumber: string; companyName: string }>) => void;
}

interface ParsedBidder {
  rcNumber: string;
  companyName: string;
  error?: string;
}

export function ImportBiddersModal({ isOpen, onClose, onImportBidders }: ImportBiddersModalProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedBidders, setParsedBidders] = useState<ParsedBidder[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'review' | 'success'>('upload');

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };

    reader.onerror = () => {
      showToast('error', 'File Error', 'Failed to read the file');
    };

    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter((line) => line.trim());
    const bidders: ParsedBidder[] = [];

    // Skip header if it exists
    const startIndex = lines[0].toLowerCase().includes('rc') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle comma-separated values
      const parts = line.split(',').map((part) => part.trim().replace(/^"|"$/g, ''));

      if (parts.length >= 2) {
        const rcNumber = parts[0].toUpperCase();
        const companyName = parts[1];

        // Validate
        if (!/^RC\d{7,}$/.test(rcNumber)) {
          bidders.push({
            rcNumber,
            companyName,
            error: 'Invalid RC Number format',
          });
        } else if (companyName.length < 3) {
          bidders.push({
            rcNumber,
            companyName,
            error: 'Company name too short',
          });
        } else {
          bidders.push({ rcNumber, companyName });
        }
      }
    }

    setParsedBidders(bidders);

    if (bidders.length === 0) {
      showToast('error', 'No Data', 'No valid bidders found in the file');
    } else {
      setImportStep('review');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        showToast('error', 'Invalid File', 'Please upload a CSV file');
        return;
      }
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleImport = () => {
    const validBidders = parsedBidders.filter((b) => !b.error);
    if (validBidders.length === 0) {
      showToast('error', 'No Valid Bidders', 'No valid bidders to import');
      return;
    }

    onImportBidders(validBidders);
    setImportStep('success');

    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    const template = 'RC Number,Company Name\nRC1234567,Example Company Ltd\nRC7654321,Another Corp';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bidders-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setParsedBidders([]);
    setImportStep('upload');
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  const validCount = parsedBidders.filter((b) => !b.error).length;
  const errorCount = parsedBidders.filter((b) => b.error).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-bidders-title"
    >
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
            >
              <Upload className="w-5 h-5" style={{ color: '#FF3000' }} />
            </div>
            <h2 id="import-bidders-title" style={{ fontSize: '18px', fontWeight: 600 }}>
              Import Bidders
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {importStep === 'upload' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                  Upload a CSV file with bidder RC Numbers and Company Names
                </p>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#FF3000] bg-[#fff5f3]'
                    : 'border-border hover:border-[#FF3000]/40 hover:bg-muted/50'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p style={{ fontSize: '16px', fontWeight: 500 }} className="mb-2">
                  Drop your CSV file here
                </p>
                <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>

              {/* Template Download */}
              <button
                onClick={handleDownloadTemplate}
                className="w-full px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV Template</span>
              </button>

              {/* Format Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p style={{ fontSize: '13px', fontWeight: 500 }} className="mb-2">
                  CSV Format:
                </p>
                <code className="text-sm text-muted-foreground">RC Number, Company Name</code>
                <p className="text-muted-foreground text-sm mt-2">
                  Example: RC1234567, TechBuild Nigeria Ltd
                </p>
              </div>
            </div>
          )}

          {importStep === 'review' && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Valid</span>
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: 600 }}>{validCount}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Errors</span>
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: 600 }}>{errorCount}</p>
                </div>
              </div>

              {/* Bidders List */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium">RC Number</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Company Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedBidders.map((bidder, index) => (
                        <tr key={index} className="border-b border-border last:border-b-0">
                          <td className="px-4 py-2 text-sm font-mono">{bidder.rcNumber}</td>
                          <td className="px-4 py-2 text-sm">{bidder.companyName}</td>
                          <td className="px-4 py-2">
                            {bidder.error ? (
                              <span className="text-red-600 text-xs">{bidder.error}</span>
                            ) : (
                              <span className="text-green-600 text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Valid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {importStep === 'success' && (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
              >
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="mb-2">
                Import Successful!
              </h3>
              <p className="text-muted-foreground">
                {validCount} bidder{validCount !== 1 ? 's' : ''} imported successfully
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {importStep !== 'success' && (
          <div className="p-6 border-t border-border shrink-0">
            {importStep === 'upload' && (
              <button
                onClick={handleClose}
                className="w-full px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            )}
            {importStep === 'review' && (
              <div className="flex gap-3">
                <button
                  onClick={() => setImportStep('upload')}
                  className="flex-1 px-4 py-2.5 rounded-md border border-border hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleImport}
                  disabled={validCount === 0}
                  className="flex-1 px-4 py-2.5 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#FF3000' }}
                >
                  Import {validCount} Bidder{validCount !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}