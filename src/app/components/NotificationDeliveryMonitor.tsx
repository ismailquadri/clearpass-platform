import { useState, useEffect } from 'react';
import { Mail, MessageSquare, RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from './ToastProvider';
import { notificationService, type NotificationDelivery } from '../utils/notificationService';

export function NotificationDeliveryMonitor() {
  const { showToast } = useToast();
  const [queue, setQueue] = useState(notificationService.getQueue());
  const [history, setHistory] = useState<NotificationDelivery[]>([]);
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setQueue(notificationService.getQueue());
    setHistory(notificationService.getDeliveryHistory().slice(0, 50)); // Last 50
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  const processQueue = async () => {
    setIsRefreshing(true);
    await notificationService.processQueue();
    refreshData();
    showToast('success', 'Queue Processed', 'Pending notifications have been processed');
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear notification history older than 30 days?')) {
      const deletedCount = notificationService.clearHistory(30);
      refreshData();
      showToast('success', 'History Cleared', `${deletedCount} old entries deleted`);
    }
  };

  const getStatusIcon = (status: NotificationDelivery['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'sent':
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'retrying':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: NotificationDelivery['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'sent':
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'retrying':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPending = queue.emails.filter((e) => e.status === 'pending').length +
    queue.sms.filter((e) => e.status === 'pending').length;
  const totalRetrying = queue.emails.filter((e) => e.status === 'retrying').length +
    queue.sms.filter((e) => e.status === 'retrying').length;
  const totalFailed = queue.emails.filter((e) => e.status === 'failed').length +
    queue.sms.filter((e) => e.status === 'failed').length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
          >
            <Mail className="w-5 h-5" style={{ color: '#FF3000' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Notification Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Email and SMS delivery status
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={processQueue}
            disabled={totalPending === 0 && totalRetrying === 0}
            className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Process Queue
          </button>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Email Queue</p>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 600 }}>{queue.emails.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">SMS Queue</p>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 600 }}>{queue.sms.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 600 }}>{totalPending}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-600" />
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 600 }}>{totalFailed}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'queue'
              ? 'bg-[#FF3000] text-white'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
          style={{ fontSize: '13px', fontWeight: 500 }}
        >
          Queue ({queue.emails.length + queue.sms.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'history'
              ? 'bg-[#FF3000] text-white'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
          style={{ fontSize: '13px', fontWeight: 500 }}
        >
          History ({history.length})
        </button>
      </div>

      {/* Queue Content */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Email Queue */}
          {queue.emails.length > 0 && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Queue ({queue.emails.length})
              </h4>
              <div className="space-y-2">
                {queue.emails.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="p-4 border border-border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(delivery.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          {delivery.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Attempt {delivery.attempts}/{3}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{delivery.metadata?.subject || 'No subject'}</p>
                      <p className="text-muted-foreground">To: {delivery.metadata?.to}</p>
                      {delivery.error && (
                        <p className="text-red-600 text-xs mt-1">{delivery.error}</p>
                      )}
                    </div>
                    {delivery.scheduledFor && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Retry scheduled: {formatDate(delivery.scheduledFor)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SMS Queue */}
          {queue.sms.length > 0 && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                SMS Queue ({queue.sms.length})
              </h4>
              <div className="space-y-2">
                {queue.sms.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="p-4 border border-border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(delivery.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          {delivery.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Attempt {delivery.attempts}/{3}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{delivery.metadata?.message || 'No message'}</p>
                      <p className="text-muted-foreground">To: {delivery.metadata?.to}</p>
                      {delivery.error && (
                        <p className="text-red-600 text-xs mt-1">{delivery.error}</p>
                      )}
                    </div>
                    {delivery.scheduledFor && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Retry scheduled: {formatDate(delivery.scheduledFor)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {queue.emails.length === 0 && queue.sms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No notifications in queue</p>
            </div>
          )}
        </div>
      )}

      {/* History Content */}
      {activeTab === 'history' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing last {history.length} notifications
            </p>
            <button
              onClick={clearHistory}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear Old History
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No delivery history available</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((delivery) => (
                <div
                  key={delivery.id}
                  className="p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {delivery.type === 'email' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                      {getStatusIcon(delivery.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          delivery.status
                        )}`}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(delivery.lastAttempt)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Recipient ID: {delivery.recipientId}
                    </p>
                    <p className="text-muted-foreground">
                      Attempts: {delivery.attempts}
                    </p>
                    {delivery.error && (
                      <p className="text-red-600 text-xs mt-1">{delivery.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}