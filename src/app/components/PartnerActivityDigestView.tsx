import { AlertCircle, Clock, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { usePartnerClients } from '../api';

interface ActivityItem {
  id: string;
  clientId: string;
  clientName: string;
  type: 'certificate_expiry' | 'certificate_renewed' | 'score_change' | 'verification_complete';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  daysAgo: number;
}

interface ClientAlertSummary {
  clientId: string;
  clientName: string;
  rcNumber: string;
  healthScore: number;
  criticalIssues: number;
  warnings: number;
  lastActivity: string;
  urgency: 'high' | 'medium' | 'low';
}

export function PartnerActivityDigestView() {
  const clientsQuery = usePartnerClients();

  // Mock activity data - in real implementation, this would come from the backend
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      clientId: '1',
      clientName: 'TechVentures Nigeria Ltd',
      type: 'certificate_expiry',
      severity: 'critical',
      title: 'NHIA Certificate Expiring Soon',
      description: 'Certificate expires in 5 days',
      timestamp: '2026-01-15T09:30:00Z',
      daysAgo: 1,
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'BuildWell Construction',
      type: 'score_change',
      severity: 'warning',
      title: 'Compliance Score Dropped',
      description: 'Score decreased from 85 to 72 due to NSITF expiry',
      timestamp: '2026-01-14T14:20:00Z',
      daysAgo: 2,
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'GreenEnergy Solutions',
      type: 'certificate_renewed',
      severity: 'success',
      title: 'Pension Certificate Renewed',
      description: 'Successfully renewed and verified',
      timestamp: '2026-01-13T11:00:00Z',
      daysAgo: 3,
    },
    {
      id: '4',
      clientId: '1',
      clientName: 'TechVentures Nigeria Ltd',
      type: 'verification_complete',
      severity: 'info',
      title: 'NSITF Verification Complete',
      description: 'Certificate verified via government API',
      timestamp: '2026-01-12T16:45:00Z',
      daysAgo: 4,
    },
    {
      id: '5',
      clientId: '4',
      clientName: 'Logistics Plus Ltd',
      type: 'certificate_expiry',
      severity: 'critical',
      title: 'ITF Certificate Expired',
      description: 'Certificate expired 2 days ago - immediate action required',
      timestamp: '2026-01-11T08:00:00Z',
      daysAgo: 5,
    },
    {
      id: '6',
      clientId: '2',
      clientName: 'BuildWell Construction',
      type: 'certificate_expiry',
      severity: 'warning',
      title: 'FIRS TIN Expiring Soon',
      description: 'Certificate expires in 12 days',
      timestamp: '2026-01-10T13:30:00Z',
      daysAgo: 6,
    },
  ];

  // Calculate client alert summaries for urgency ranking
  const clientAlertSummaries = useMemo(() => {
    if (!clientsQuery.data) return [];

    const summaries: ClientAlertSummary[] = clientsQuery.data.map((client) => {
      const clientActivities = mockActivities.filter((a) => a.clientId === client.id);
      const criticalIssues = clientActivities.filter((a) => a.severity === 'critical').length;
      const warnings = clientActivities.filter((a) => a.severity === 'warning').length;

      let urgency: 'high' | 'medium' | 'low' = 'low';
      if (client.score < 50 || criticalIssues > 0 || client.daysToExpiry < 7) {
        urgency = 'high';
      } else if (client.score < 80 || warnings > 0 || client.daysToExpiry < 30) {
        urgency = 'medium';
      }

      return {
        clientId: client.id,
        clientName: client.companyName,
        rcNumber: client.rcNumber,
        healthScore: client.score,
        criticalIssues,
        warnings,
        lastActivity: clientActivities[0]?.timestamp || '',
        urgency,
      };
    });

    // Sort by urgency (high first), then by health score (lowest first)
    return summaries.sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return a.healthScore - b.healthScore;
    });
  }, [clientsQuery.data]);

  // Group activities by severity
  const activitiesBySeverity = useMemo(() => {
    return {
      critical: mockActivities.filter((a) => a.severity === 'critical'),
      warning: mockActivities.filter((a) => a.severity === 'warning'),
      info: mockActivities.filter((a) => a.severity === 'info'),
      success: mockActivities.filter((a) => a.severity === 'success'),
    };
  }, []);

  const getSeverityIcon = (severity: ActivityItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5" style={{ color: '#FF3000' }} />;
      case 'warning':
        return <Clock className="w-5 h-5" style={{ color: '#FFA500' }} />;
      case 'info':
        return <FileText className="w-5 h-5" style={{ color: 'rgb(92, 92, 92)' }} />;
      case 'success':
        return <CheckCircle className="w-5 h-5" style={{ color: '#FF3000' }} />;
    }
  };

  const getSeverityColor = (severity: ActivityItem['severity']) => {
    switch (severity) {
      case 'critical':
        return '#FF3000';
      case 'warning':
        return '#FFA500';
      case 'info':
        return 'rgb(92, 92, 92)';
      case 'success':
        return '#FF3000';
    }
  };

  const getUrgencyBadge = (urgency: ClientAlertSummary['urgency']) => {
    switch (urgency) {
      case 'high':
        return { color: '#FF3000', bgColor: 'rgba(255, 48, 0, 0.1)', label: 'High Priority' };
      case 'medium':
        return { color: '#FFA500', bgColor: 'rgba(255, 165, 0, 0.1)', label: 'Medium Priority' };
      case 'low':
        return {
          color: 'rgb(92, 92, 92)',
          bgColor: 'rgba(92, 92, 92, 0.1)',
          label: 'Low Priority',
        };
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="cp-page-title">Client Activity Digest</h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Consolidated updates and urgency ranking across all your clients
          </p>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
                Total Activities
              </span>
              <TrendingUp className="w-5 h-5" style={{ color: '#FF3000' }} />
            </div>
            <p style={{ fontSize: '28px', fontWeight: 600 }}>{mockActivities.length}</p>
            <p className="caption text-muted-foreground mt-1">Last 7 days</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
                Critical Issues
              </span>
              <AlertCircle className="w-5 h-5" style={{ color: '#FF3000' }} />
            </div>
            <p style={{ fontSize: '28px', fontWeight: 600, color: '#FF3000' }}>
              {activitiesBySeverity.critical.length}
            </p>
            <p className="caption text-muted-foreground mt-1">Requires action</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
                Warnings
              </span>
              <Clock className="w-5 h-5" style={{ color: '#FFA500' }} />
            </div>
            <p style={{ fontSize: '28px', fontWeight: 600, color: '#FFA500' }}>
              {activitiesBySeverity.warning.length}
            </p>
            <p className="caption text-muted-foreground mt-1">Attention needed</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground" style={{ fontSize: '13px' }}>
                Success
              </span>
              <CheckCircle className="w-5 h-5" style={{ color: '#FF3000' }} />
            </div>
            <p style={{ fontSize: '28px', fontWeight: 600, color: '#FF3000' }}>
              {activitiesBySeverity.success.length}
            </p>
            <p className="caption text-muted-foreground mt-1">Completed</p>
          </div>
        </div>

        {/* Client Urgency Ranking */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6">
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Client Urgency Ranking
          </h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
            Clients ranked by urgency and compliance health score
          </p>
          <div className="space-y-3">
            {clientAlertSummaries.map((client, index) => {
              const urgencyBadge = getUrgencyBadge(client.urgency);
              return (
                <div
                  key={client.clientId}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Rank */}
                    <div
                      className="px-2 py-1 rounded text-xs font-bold min-w-[32px] text-center"
                      style={{
                        backgroundColor:
                          index < 3 ? 'rgba(255, 48, 0, 0.1)' : 'rgba(92, 92, 92, 0.1)',
                        color: index < 3 ? '#FF3000' : 'rgb(92, 92, 92)',
                      }}
                    >
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{client.clientName}</p>
                      <p className="caption text-muted-foreground">{client.rcNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p style={{ fontSize: '14px', fontWeight: 600 }}>{client.healthScore}/100</p>
                      <p className="caption text-muted-foreground">Score</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#FF3000' }}>
                        {client.criticalIssues}
                      </p>
                      <p className="caption text-muted-foreground">Critical</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#FFA500' }}>
                        {client.warnings}
                      </p>
                      <p className="caption text-muted-foreground">Warnings</p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: urgencyBadge.bgColor,
                        color: urgencyBadge.color,
                      }}
                    >
                      {urgencyBadge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Recent Activity Across All Clients
          </h3>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                <div className="mt-1">{getSeverityIcon(activity.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600 }}>{activity.title}</p>
                      <p className="caption text-muted-foreground">{activity.clientName}</p>
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: `${getSeverityColor(activity.severity)}20`,
                        color: getSeverityColor(activity.severity),
                      }}
                    >
                      {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: '13px' }}>
                    {activity.description}
                  </p>
                  <p className="caption text-muted-foreground mt-1">
                    {activity.daysAgo} {activity.daysAgo === 1 ? 'day' : 'days'} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Digest Summary */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mt-6">
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Weekly Digest Summary
          </h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '14px' }}>
            Your weekly digest email is scheduled for Mondays at 8:00 AM WAT
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-muted rounded-md">
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Email Delivery</p>
              <p className="caption text-muted-foreground mt-1">Next: Monday, Jan 20</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Recipients</p>
              <p className="caption text-muted-foreground mt-1">Your email + team members</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Format</p>
              <p className="caption text-muted-foreground mt-1">Consolidated client ranking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
