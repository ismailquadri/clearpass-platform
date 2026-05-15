import { CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'pending' | 'warning';
  lastChecked: string;
  nextDue: string;
  category: string;
}

const MOCK_CHECKS: ComplianceCheck[] = [
  { id: '1', name: 'NHIA Certificate Status', description: 'Verify NHIA certificate is valid and not expired', status: 'passed', lastChecked: '2025-05-10', nextDue: '2026-05-10', category: 'Health Insurance' },
  { id: '2', name: 'Pension Clearance', description: 'Verify pension contributions are current', status: 'passed', lastChecked: '2025-05-08', nextDue: '2026-03-31', category: 'Labor Compliance' },
  { id: '3', name: 'NSITF Coverage', description: 'Verify NSITF coverage for all employees', status: 'pending', lastChecked: '2025-04-15', nextDue: '2025-05-15', category: 'Labor Compliance' },
  { id: '4', name: 'FIRS Tax Compliance', description: 'Verify tax filings are up to date', status: 'warning', lastChecked: '2025-03-20', nextDue: '2025-04-20', category: 'Tax' },
  { id: '5', name: 'BPP Registration', description: 'Verify BPP registration is current', status: 'passed', lastChecked: '2025-05-01', nextDue: '2026-05-01', category: 'Regulatory' },
  { id: '6', name: 'ITF Compliance', description: 'Verify ITF training fund contributions', status: 'failed', lastChecked: '2025-05-12', nextDue: 'Overdue', category: 'Training' },
];

export function ComplianceView() {
  const [checks] = useState<ComplianceCheck[]>(MOCK_CHECKS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const passedCount = checks.filter(c => c.status === 'passed').length;
  const failedCount = checks.filter(c => c.status === 'failed').length;
  const pendingCount = checks.filter(c => c.status === 'pending').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="cp-page-title">Compliance Checks</h1>
          <p className="text-muted-foreground mt-1">Run and monitor compliance verification checks</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Running checks...' : 'Run All Checks'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{passedCount}</p>
              <p className="text-sm text-muted-foreground">Passed</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{failedCount}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{warningCount}</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Compliance Check Results</h2>
        </div>
        <div className="divide-y divide-border">
          {checks.map((check) => (
            <div key={check.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{check.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
                      {check.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{check.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Last checked: {check.lastChecked}</span>
                    <span>Next due: {check.nextDue}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {check.status === 'passed' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Passed
                    </span>
                  )}
                  {check.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium">
                      <AlertCircle className="h-4 w-4" /> Failed
                    </span>
                  )}
                  {check.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4" /> Pending
                    </span>
                  )}
                  {check.status === 'warning' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm font-medium">
                      <AlertCircle className="h-4 w-4" /> Warning
                    </span>
                  )}
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}