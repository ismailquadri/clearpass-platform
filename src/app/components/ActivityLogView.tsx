import {
  CheckCircle2,
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  Mail,
  FileText,
  Clock,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'verification' | 'upload' | 'download' | 'renewal' | 'alert' | 'email' | 'report';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}

export function ActivityLogView() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'verification',
      title: 'NHIA Certificate Verified',
      description: 'Certificate verified successfully via government API',
      timestamp: '9 May 2026, 10:23 AM',
      status: 'success',
    },
    {
      id: '2',
      type: 'alert',
      title: 'NSITF Certificate Expiring Soon',
      description: 'Your NSITF certificate will expire in 6 days',
      timestamp: '9 May 2026, 8:00 AM',
      status: 'warning',
    },
    {
      id: '3',
      type: 'email',
      title: 'Compliance Alert Sent',
      description: 'Email notification sent regarding PCC renewal',
      timestamp: '8 May 2026, 6:15 PM',
      status: 'info',
    },
    {
      id: '4',
      type: 'report',
      title: 'Compliance Report Generated',
      description: 'Monthly compliance report downloaded',
      timestamp: '8 May 2026, 2:30 PM',
      status: 'success',
    },
    {
      id: '5',
      type: 'upload',
      title: 'ITF Certificate Uploaded',
      description: 'New certificate document uploaded for verification',
      timestamp: '7 May 2026, 11:45 AM',
      status: 'info',
    },
    {
      id: '6',
      type: 'verification',
      title: 'PCC Verification Completed',
      description: 'Admin reviewed and approved PCC certificate',
      timestamp: '6 May 2026, 4:20 PM',
      status: 'success',
    },
    {
      id: '7',
      type: 'renewal',
      title: 'FIRS TCC Renewal Started',
      description: 'Renewal process initiated for tax clearance certificate',
      timestamp: '5 May 2026, 9:15 AM',
      status: 'info',
    },
    {
      id: '8',
      type: 'download',
      title: 'Certificate Bundle Downloaded',
      description: 'All active certificates downloaded as PDF bundle',
      timestamp: '4 May 2026, 3:45 PM',
      status: 'success',
    },
    {
      id: '9',
      type: 'alert',
      title: 'Score Drop Warning',
      description: 'Compliance score may drop to 41/100 if NSITF expires',
      timestamp: '3 May 2026, 7:30 AM',
      status: 'warning',
    },
    {
      id: '10',
      type: 'verification',
      title: 'BPP Certificate Re-verified',
      description: 'Automated monthly verification check completed',
      timestamp: '1 May 2026, 12:00 PM',
      status: 'success',
    },
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'verification':
        return CheckCircle2;
      case 'upload':
        return Upload;
      case 'download':
        return Download;
      case 'renewal':
        return RefreshCw;
      case 'alert':
        return AlertTriangle;
      case 'email':
        return Mail;
      case 'report':
        return FileText;
      default:
        return Clock;
    }
  };

  const getStatusConfig = (status?: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return {
          color: 'rgb(31, 193, 107)',
          bgColor: 'rgb(31, 193, 107, 0.1)',
        };
      case 'warning':
        return {
          color: 'rgb(250, 115, 25)',
          bgColor: 'rgb(250, 115, 25, 0.1)',
        };
      case 'info':
      default:
        return {
          color: 'rgb(71, 194, 255)',
          bgColor: 'rgb(71, 194, 255, 0.1)',
        };
    }
  };

  // Group activities by date
  const groupedActivities: { [key: string]: ActivityItem[] } = {};
  activities.forEach((activity) => {
    const date = activity.timestamp.split(',')[0];
    if (!groupedActivities[date]) {
      groupedActivities[date] = [];
    }
    groupedActivities[date].push(activity);
  });

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2" style={{ fontSize: '32px' }}>
            Activity Log
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '16px' }}>
            Track all compliance activities and system events
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <select className="w-full px-4 py-2 bg-input-background border border-border rounded-md">
                <option>All Activities</option>
                <option>Verifications</option>
                <option>Uploads</option>
                <option>Downloads</option>
                <option>Renewals</option>
                <option>Alerts</option>
              </select>
            </div>
            <div className="flex-1">
              <select className="w-full px-4 py-2 bg-input-background border border-border rounded-md">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>All Time</option>
              </select>
            </div>
            <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Log
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <h3 style={{ fontSize: '16px', fontWeight: '500' }}>{date}</h3>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-3">
                {items.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const statusConfig = getStatusConfig(activity.status);

                  return (
                    <div
                      key={activity.id}
                      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: statusConfig.bgColor }}
                        >
                          <Icon className="w-5 h-5" style={{ color: statusConfig.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 style={{ fontSize: '16px', fontWeight: '500' }}>
                              {activity.title}
                            </h4>
                            <span className="caption text-muted-foreground whitespace-nowrap ml-4">
                              {activity.timestamp.split(',')[1]}
                            </span>
                          </div>
                          <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 rounded-md border border-border hover:bg-muted transition-colors">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
}
