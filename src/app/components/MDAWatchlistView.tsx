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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from './ToastProvider';
import { verifyVendor } from '../api';
import '../../app/styles/mda-theme.css';

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

const WATCHLIST_STORAGE_KEY = 'clearpass.mda.watchlist.v1';

function readWatchlist(): WatchlistCompany[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchlistCompany[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeWatchlist(items: WatchlistCompany[]) {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function deriveWatchlistFields(v: {
  score: number;
  status: WatchlistCompany['status'];
  certificates: Array<{ expiryDate: string; status: string }>;
}) {
  const today = new Date();
  const validDates = v.certificates
    .map((c) => c.expiryDate)
    .filter(Boolean)
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));
  const nearest = validDates.length ? validDates.reduce((a, b) => (a < b ? a : b)) : null;
  const days = nearest
    ? Math.ceil((nearest.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  return {
    score: v.score,
    status: v.status,
    nearestExpiry: nearest
      ? nearest.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'N/A',
    daysToExpiry: nearest ? days : 0,
  };
}

function statusCfg(status: WatchlistCompany['status']) {
  switch (status) {
    case 'procurement-ready':
      return {
        icon: CheckCircle2,
        color: 'var(--mda-success)',
        bg: 'var(--mda-success-light)',
        label: 'Procurement Ready',
      };
    case 'attention-required':
      return { icon: AlertTriangle, color: '#F59E0B', bg: '#fef3c7', label: 'Attention Required' };
    case 'ineligible':
      return { icon: XCircle, color: '#DC2626', bg: '#fee2e2', label: 'Ineligible to Bid' };
  }
}

export function MDAWatchlistView() {
  const { showToast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistCompany[]>(() => readWatchlist());
  const [search, setSearch] = useState('');
  const [addRC, setAddRC] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const prevSnapshots = useRef<
    Map<
      string,
      {
        score: number;
        status: WatchlistCompany['status'];
        nearestExpiry: string;
        daysToExpiry: number;
      }
    >
  >(new Map());

  useEffect(() => {
    writeWatchlist(watchlist);
  }, [watchlist]);

  const filtered = useMemo(
    () =>
      watchlist.filter(
        (c) =>
          search === '' ||
          c.companyName.toLowerCase().includes(search.toLowerCase()) ||
          c.rcNumber.toLowerCase().includes(search.toLowerCase())
      ),
    [watchlist, search]
  );

  const refreshOne = async (rcNumber: string, noisy: boolean) => {
    try {
      const v = await verifyVendor(rcNumber);
      const derived = deriveWatchlistFields({
        score: v.score,
        status: v.status,
        certificates: v.certificates.map((c) => ({ expiryDate: c.expiryDate, status: c.status })),
      });

      setWatchlist((prev) =>
        prev.map((c) =>
          c.rcNumber.toUpperCase() === rcNumber.toUpperCase()
            ? {
                ...c,
                companyName: v.companyName || c.companyName,
                score: derived.score,
                status: derived.status,
                nearestExpiry: derived.nearestExpiry,
                daysToExpiry: derived.daysToExpiry,
                lastVerified: new Date().toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }),
              }
            : c
        )
      );

      const prev = prevSnapshots.current.get(rcNumber.toUpperCase());
      if (prev) {
        const changed =
          prev.status !== derived.status ||
          prev.nearestExpiry !== derived.nearestExpiry ||
          prev.daysToExpiry !== derived.daysToExpiry;
        if (changed) {
          const alertsOn =
            watchlist.find((w) => w.rcNumber.toUpperCase() === rcNumber.toUpperCase())
              ?.alertsEnabled ?? true;
          if (alertsOn && noisy) {
            showToast(
              derived.status === 'ineligible'
                ? 'error'
                : derived.status === 'attention-required'
                  ? 'info'
                  : 'success',
              'Watchlist Update',
              `${rcNumber.toUpperCase()} is now ${derived.status.replace('-', ' ')}`
            );
          }
        }
      }
      prevSnapshots.current.set(rcNumber.toUpperCase(), derived);
    } catch (err) {
      if (noisy) {
        const msg = err instanceof Error ? err.message : 'Unable to verify vendor right now';
        showToast('error', 'Verification Failed', msg);
      }
    }
  };

  // Monitor watchlist: periodic refresh. This works both with real API and with mock mode.
  useEffect(() => {
    if (!watchlist.length) return;

    // Seed snapshot map from current state so we can detect changes.
    for (const c of watchlist) {
      prevSnapshots.current.set(c.rcNumber.toUpperCase(), {
        score: c.score,
        status: c.status,
        nearestExpiry: c.nearestExpiry,
        daysToExpiry: c.daysToExpiry,
      });
    }

    const intervalMs = 60_000; // 1 minute polling; safe for demo + light monitoring.
    const t = setInterval(() => {
      // Refresh only items with alerts enabled (monitoring intent).
      const toRefresh = watchlist.filter((w) => w.alertsEnabled).slice(0, 10);
      void Promise.all(toRefresh.map((w) => refreshOne(w.rcNumber, true)));
    }, intervalMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlist.map((w) => `${w.rcNumber}:${w.alertsEnabled}`).join('|')]);

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
    const rc = addRC.toUpperCase();
    try {
      const v = await verifyVendor(rc);
      const derived = deriveWatchlistFields({
        score: v.score,
        status: v.status,
        certificates: v.certificates.map((c) => ({ expiryDate: c.expiryDate, status: c.status })),
      });
      const nowLabel = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const newEntry: WatchlistCompany = {
        id: `w${Date.now()}`,
        companyName: v.companyName || 'Unknown Vendor',
        rcNumber: rc,
        score: derived.score,
        status: derived.status,
        nearestExpiry: derived.nearestExpiry,
        daysToExpiry: derived.daysToExpiry,
        alertsEnabled: true,
        addedDate: nowLabel,
        lastVerified: nowLabel,
      };
      setWatchlist((prev) => [newEntry, ...prev]);
      prevSnapshots.current.set(rc, derived);
      setAddRC('');
      showToast('success', 'Added to Watchlist', `${rc} is now being monitored`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to add vendor';
      showToast('error', 'Add Failed', msg);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleAlerts = (id: string) => {
    const company = watchlist.find((c) => c.id === id);
    setWatchlist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, alertsEnabled: !c.alertsEnabled } : c))
    );
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
          <h1 className="cp-page-title mb-2">Company Watchlist</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Monitor compliance status for vendors you regularly verify
          </p>
        </header>

        {/* Add company */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6">
          <h2 className="cp-section-title mb-3">Add Company to Watchlist</h2>
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
              style={{ backgroundColor: 'var(--mda-primary)', fontSize: '14px' }}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              {isAdding ? 'Adding…' : 'Add to Watchlist'}
            </button>
          </div>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
              Watching
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700 }}>{watchlist.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
              Alerts On
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--mda-success)' }}>
              {watchlist.filter((c) => c.alertsEnabled).length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
              Need Attention
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--mda-primary)' }}>
              {watchlist.filter((c) => c.status !== 'procurement-ready').length}
            </p>
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
                        style={{
                          backgroundColor: cfg.bg,
                          color: cfg.color,
                          fontSize: '11px',
                          fontWeight: 500,
                        }}
                      >
                        <StatusIcon className="w-3 h-3" aria-hidden="true" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                      <span style={{ fontSize: '13px' }}>{company.rcNumber}</span>
                      <span style={{ fontSize: '13px' }}>
                        Score: <strong style={{ color: cfg.color }}>{company.score}</strong>/100
                      </span>
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
                      title={
                        company.alertsEnabled
                          ? 'Alerts on — click to disable'
                          : 'Alerts off — click to enable'
                      }
                    >
                      {company.alertsEnabled ? (
                        <Bell className="w-4 h-4" style={{ color: 'var(--mda-primary)' }} />
                      ) : (
                        <BellOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        try {
                          localStorage.setItem('clearpass.mda.reports.prefillRc', company.rcNumber);
                        } catch {
                          // ignore
                        }
                        window.dispatchEvent(
                          new CustomEvent('clearpass:navigate', {
                            detail: { persona: 'MDA', section: 'reports' },
                          })
                        );
                      }}
                      className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                      aria-label="View full report"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {deleteConfirm === company.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleRemove(company.id)}
                          className="px-2 py-1 rounded text-white bg-red-600 text-xs"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 rounded border text-xs"
                        >
                          Cancel
                        </button>
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
