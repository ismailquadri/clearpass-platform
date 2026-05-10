import {
  Star,
  Trash2,
  Search,
  Bell,
  BellOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface WatchlistCompany {
  id: string;
  companyName: string;
  rcNumber: string;
  score: number;
  status: 'procurement-ready' | 'attention-required' | 'ineligible';
  nearestExpiry: string;
  daysToExpiry: number;
  alertsEnabled: boolean;
  addedDate: string;
  lastVerified: string;
}

const INITIAL_WATCHLIST: WatchlistCompany[] = [
  { id: 'w1', companyName: 'TechVentures Nigeria Ltd', rcNumber: 'RC1234567', score: 92, status: 'procurement-ready', nearestExpiry: 'Jun 7, 2026', daysToExpiry: 28, alertsEnabled: true, addedDate: 'Apr 12, 2026', lastVerified: 'May 10, 2026' },
  { id: 'w2', companyName: 'Lagos Builders Ltd', rcNumber: 'RC7654321', score: 74, status: 'attention-required', nearestExpiry: 'May 22, 2026', daysToExpiry: 12, alertsEnabled: true, addedDate: 'Mar 20, 2026', lastVerified: 'May 9, 2026' },
  { id: 'w3', companyName: 'Delta Contractors', rcNumber: 'RC9876543', score: 41, status: 'ineligible', nearestExpiry: 'May 7, 2026', daysToExpiry: -3, alertsEnabled: false, addedDate: 'May 1, 2026', lastVerified: 'May 8, 2026' },
  { id: 'w4', companyName: 'Abuja Roads Co.', rcNumber: 'RC2345678', score: 88, status: 'procurement-ready', nearestExpiry: 'Sep 15, 2026', daysToExpiry: 128, alertsEnabled: true, addedDate: 'Feb 14, 2026', lastVerified: 'May 7, 2026' },
  { id: 'w5', companyName: 'Niger Works Ltd', rcNumber: 'RC3456789', score: 67, status: 'attention-required', nearestExpiry: 'Jun 30, 2026', daysToExpiry: 51, alertsEnabled: false, addedDate: 'Apr 28, 2026', lastVerified: 'May 6, 2026' },
];

function statusCfg(status: WatchlistCompany['status']) {
  switch (status) {
    case 'procurement-ready':
      return { icon: CheckCircle2, color: '#1FC16B', bg: '#dcfce7', label: 'Procurement Ready' };
    case 'attention-required':
      return { icon: AlertTriangle, color: '#F59E0B', bg: '#fef3c7', label: 'Attention Required' };
    case 'ineligible':
      return { icon: XCircle, color: '#DC2626', bg: '#fee2e2', label: 'Ineligible to Bid' };
  }
}

export function MDAWatchlistView() {
  const { showToast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistCompany[]>(INITIAL_WATCHLIST);
  const [search, setSearch] = useState('');
  const [addRC, setAddRC] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = watchlist.filter(
    (c) =>
      search === '' ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.rcNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!addRC.trim()) return;
    const pattern = /^RC\d{7,}$/i;
    if (!pattern.test(addRC.trim())) {
      showToast('error', 'Invalid RC', 'Please enter a valid RC number (e.g. RC1234567)');
      return;
    }
    if (watchlist.some((c) => c.rcNumber.toLowerCase() === addRC.toLowerCase())) {
      showToast('error', 'Already Added', `${addRC} is already on your watchlist`);
      return;
    }
    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 800));
    const newEntry: WatchlistCompany = {
      id: `w${Date.now()}`,
      companyName: 'Kano Civil Works Ltd',
      rcNumber: addRC.toUpperCase(),
      score: 79,
      status: 'attention-required',
      nearestExpiry: 'Jul 12, 2026',
      daysToExpiry: 63,
      alertsEnabled: true,
      addedDate: 'Today',
      lastVerified: 'Today',
    };
    setWatchlist((prev) => [newEntry, ...prev]);
    setAddRC('');
    setIsAdding(false);
    showToast('success', 'Added to Watchlist', `${addRC} is now being monitored`);
  };

  const toggleAlerts = (id: string) => {
    setWatchlist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, alertsEnabled: !c.alertsEnabled } : c))
    );
    const company = watchlist.find((c) => c.id === id);
    if (company) {
      showToast(
        'info',
        company.alertsEnabled ? 'Alerts Disabled' : 'Alerts Enabled',
        `Certificate expiry alerts ${company.alertsEnabled ? 'off' : 'on'} for ${company.companyName}`
      );
    }
  };

  const handleRemove = (id: string) => {
    const company = watchlist.find((c) => c.id === id);
    setWatchlist((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
    showToast('info', 'Removed', `${company?.companyName} removed from watchlist`);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="mb-2" style={{ fontSize: '28px' }}>Company Watchlist</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Monitor compliance status for vendors you regularly verify
          </p>
        </header>

        {/* Add company */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6">
          <h2 className="mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>Add Company to Watchlist</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={addRC}
                onChange={(e) => setAddRC(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isAdding && handleAdd()}
                placeholder="Enter RC number (e.g. RC1234567)"
                className="w-full pl-9 pr-3 py-2.5 min-h-[44px] border border-border rounded-md bg-input-background"
                style={{ fontSize: '15px' }}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={isAdding || !addRC.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-md text-white hover:opacity-90 transition-opacity disabled:opacity-50 w-full sm:w-auto"
              style={{ backgroundColor: '#FF3000', fontSize: '14px' }}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              {isAdding ? 'Adding…' : 'Add to Watchlist'}
            </button>
          </div>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Watching</p>
            <p style={{ fontSize: '24px', fontWeight: 700 }}>{watchlist.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Alerts On</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1FC16B' }}>{watchlist.filter((c) => c.alertsEnabled).length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Need Attention</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#FF3000' }}>{watchlist.filter((c) => c.status !== 'procurement-ready').length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search watchlist…"
            className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-input-background"
            style={{ fontSize: '14px' }}
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Star className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p style={{ fontSize: '15px', fontWeight: 500 }}>No companies in watchlist</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: '13px' }}>
                Add vendor RC numbers above to track their compliance
              </p>
            </div>
          )}
          {filtered.map((company) => {
            const cfg = statusCfg(company.status);
            const StatusIcon = cfg.icon;
            return (
              <div key={company.id} className="bg-card border border-border rounded-lg p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Star className="w-4 h-4 shrink-0" style={{ color: '#F59E0B' }} />
                      <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{company.companyName}</h3>
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: '11px', fontWeight: 500 }}
                      >
                        <StatusIcon className="w-3 h-3" aria-hidden="true" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                      <span style={{ fontSize: '13px' }}>{company.rcNumber}</span>
                      <span style={{ fontSize: '13px' }}>Score: <strong style={{ color: cfg.color }}>{company.score}</strong>/100</span>
                      <span style={{ fontSize: '13px' }}>
                        {company.daysToExpiry < 0
                          ? `Expired ${Math.abs(company.daysToExpiry)}d ago`
                          : `Next expiry: ${company.daysToExpiry}d`}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: '12px' }}>
                      Added {company.addedDate} · Last verified {company.lastVerified}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleAlerts(company.id)}
                      className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                      aria-label={company.alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
                      title={company.alertsEnabled ? 'Alerts on — click to disable' : 'Alerts off — click to enable'}
                    >
                      {company.alertsEnabled
                        ? <Bell className="w-4 h-4" style={{ color: '#FF3000' }} />
                        : <BellOff className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <button
                      onClick={() => showToast('info', 'Viewing Report', `Opening full report for ${company.companyName}`)}
                      className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                      aria-label="View full report"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {deleteConfirm === company.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleRemove(company.id)} className="px-2 py-1 rounded text-white bg-red-600 text-xs">Remove</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded border text-xs">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(company.id)}
                        className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                        aria-label="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
