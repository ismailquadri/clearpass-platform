import {
  Upload,
  File,
  FileText,
  Trash2,
  Download,
  Search,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from './ToastProvider';

interface VaultFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'verified' | 'pending' | 'rejected';
}

const INITIAL_FILES: VaultFile[] = [
  {
    id: 'f1',
    name: 'NHIA_Certificate_2026.pdf',
    size: 2.4 * 1024 * 1024,
    type: 'application/pdf',
    category: 'NHIA',
    uploadedAt: 'May 2, 2026',
    uploadedBy: 'Amaka Okoro',
    status: 'verified',
  },
  {
    id: 'f2',
    name: 'PCC_PenCom_Certificate.pdf',
    size: 1.8 * 1024 * 1024,
    type: 'application/pdf',
    category: 'PCC',
    uploadedAt: 'Apr 28, 2026',
    uploadedBy: 'Amaka Okoro',
    status: 'verified',
  },
  {
    id: 'f3',
    name: 'NSITF_Certificate_Jan2026.pdf',
    size: 3.1 * 1024 * 1024,
    type: 'application/pdf',
    category: 'NSITF',
    uploadedAt: 'Apr 15, 2026',
    uploadedBy: 'Emeka Nwosu',
    status: 'pending',
  },
  {
    id: 'f4',
    name: 'ITF_Certificate_2025.pdf',
    size: 0.9 * 1024 * 1024,
    type: 'application/pdf',
    category: 'ITF',
    uploadedAt: 'Mar 10, 2026',
    uploadedBy: 'Amaka Okoro',
    status: 'rejected',
  },
  {
    id: 'f5',
    name: 'BPP_IRR_2026.pdf',
    size: 4.2 * 1024 * 1024,
    type: 'application/pdf',
    category: 'BPP',
    uploadedAt: 'Feb 20, 2026',
    uploadedBy: 'Amaka Okoro',
    status: 'verified',
  },
  {
    id: 'f6',
    name: 'FIRS_TaxClearance_2026.pdf',
    size: 2.1 * 1024 * 1024,
    type: 'application/pdf',
    category: 'FIRS TIN',
    uploadedAt: 'Jan 15, 2026',
    uploadedBy: 'Adaeze Finance',
    status: 'verified',
  },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VAULT_SIZE = 500 * 1024 * 1024; // 500MB
const CATEGORIES = ['All', 'NHIA', 'PCC', 'NSITF', 'ITF', 'FIRS TIN', 'BPP', 'Other'];

function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function DocumentVaultView() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<VaultFile[]>(INITIAL_FILES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalUsed = files.reduce((s, f) => s + f.size, 0);
  const usedPct = (totalUsed / MAX_VAULT_SIZE) * 100;

  const filtered = files.filter((f) => {
    const matchSearch = search === '' || f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || f.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        showToast('error', 'File Too Large', `${file.name} exceeds the 10MB limit`);
        return;
      }
      if (totalUsed + file.size > MAX_VAULT_SIZE) {
        showToast('error', 'Vault Full', 'Storage limit reached. Delete files to free space.');
        return;
      }
      const newFile: VaultFile = {
        id: `f${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        category: 'Other',
        uploadedAt: 'Just now',
        uploadedBy: 'You',
        status: 'pending',
      };
      setFiles((prev) => [newFile, ...prev]);
      showToast('success', 'Uploaded', `${file.name} uploaded. Awaiting admin review.`);
    });
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setDeleteConfirm(null);
    showToast('success', 'Deleted', 'File removed from vault');
  };

  const statusBadge = (status: VaultFile['status']) => {
    if (status === 'verified')
      return (
        <span
          className="px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px' }}
        >
          Verified
        </span>
      );
    if (status === 'pending')
      return (
        <span
          className="px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '11px' }}
        >
          Pending Review
        </span>
      );
    return (
      <span
        className="px-2 py-0.5 rounded-full"
        style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '11px' }}
      >
        Rejected
      </span>
    );
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="cp-page-title mb-2">Document Vault</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Secure storage for all your compliance certificate documents
          </p>
        </header>

        {/* Storage usage */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Storage Used</span>
            <span style={{ fontSize: '13px' }}>
              {fmtSize(totalUsed)} / {fmtSize(MAX_VAULT_SIZE)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${usedPct}%`,
                backgroundColor: usedPct > 80 ? '#FF3000' : '#1FC16B',
              }}
            />
          </div>
          {usedPct > 80 && (
            <p
              className="flex items-center gap-1 mt-2"
              style={{ fontSize: '12px', color: '#FF3000' }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Storage nearly full. Delete old files to avoid upload failures.
            </p>
          )}
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-6 ${
            isDragging
              ? 'border-[#FF3000] bg-[#FF3000]/5'
              : 'border-border hover:border-[#FF3000]/50 hover:bg-muted/30'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" aria-hidden="true" />
          <p style={{ fontSize: '15px', fontWeight: 500 }}>Drop files here or click to upload</p>
          <p className="text-muted-foreground mt-1" style={{ fontSize: '13px' }}>
            PDF, JPG, PNG · Max 10MB per file
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
              className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-input-background"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                  categoryFilter === cat
                    ? 'border-[#FF3000] text-[#FF3000] bg-[#FF3000]/5'
                    : 'border-border text-muted-foreground hover:border-foreground'
                }`}
                style={{ fontSize: '12px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* File list */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p style={{ fontSize: '15px', fontWeight: 500 }}>No files found</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '13px' }}>
              Upload your first document above
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Desktop */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="border-b border-border">
                  {['Name', 'Category', 'Size', 'Uploaded', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-muted-foreground"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{f.name}</span>
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                        By {f.uploadedBy}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full bg-muted"
                        style={{ fontSize: '11px' }}
                      >
                        {f.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                      {fmtSize(f.size)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '13px' }}>
                      {f.uploadedAt}
                    </td>
                    <td className="px-4 py-3">{statusBadge(f.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            showToast('success', 'Downloading', `${f.name} downloading…`)
                          }
                          className="p-1.5 rounded hover:bg-muted"
                          aria-label="Download"
                        >
                          <Download className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        {deleteConfirm === f.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(f.id)}
                              className="px-2 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                              style={{ fontSize: '11px' }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 rounded border"
                              style={{ fontSize: '11px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(f.id)}
                            className="p-1.5 rounded hover:bg-muted"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile */}
            <div className="sm:hidden divide-y divide-border">
              {filtered.map((f) => (
                <div key={f.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <File className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="truncate" style={{ fontSize: '13px', fontWeight: 500 }}>
                          {f.name}
                        </p>
                        <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                          {fmtSize(f.size)} · {f.uploadedAt}
                        </p>
                      </div>
                    </div>
                    {statusBadge(f.status)}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => showToast('success', 'Downloading', `${f.name} downloading…`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border"
                      style={{ fontSize: '12px' }}
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                    {deleteConfirm === f.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="px-3 py-1.5 rounded-md text-white bg-red-600"
                          style={{ fontSize: '12px' }}
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-md border"
                          style={{ fontSize: '12px' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(f.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border text-red-500"
                        style={{ fontSize: '12px' }}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-muted-foreground mt-4" style={{ fontSize: '12px' }}>
          {files.length} file{files.length !== 1 ? 's' : ''} · {fmtSize(totalUsed)} used of{' '}
          {fmtSize(MAX_VAULT_SIZE)}
        </p>
      </div>
    </div>
  );
}
