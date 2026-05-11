import { db } from '../config/database';

export interface ActivityItem {
  id: string;
  type: 'verification' | 'upload' | 'download' | 'renewal' | 'alert' | 'email' | 'report';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}

export class ActivityService {
  async getActivityLog(companyId: string, limit: number = 50): Promise<ActivityItem[]> {
    const auditLogs = await db('audit_trail')
      .where({ company_id: companyId })
      .orderBy('created_at', 'desc')
      .limit(limit);

    return auditLogs.map((log) => this.formatActivityItem(log));
  }

  private formatActivityItem(log: any): ActivityItem {
    const type = this.mapActionToType(log.action);
    const { title, description } = this.generateTitleAndDescription(log);

    return {
      id: log.id,
      type,
      title,
      description,
      timestamp: new Date(log.created_at).toISOString(),
      status: log.status === 'success' ? 'success' : log.status === 'failure' ? 'warning' : 'info',
    };
  }

  private mapActionToType(action: string): ActivityItem['type'] {
    const actionMap: Record<string, ActivityItem['type']> = {
      cert_verify: 'verification',
      cert_upload: 'upload',
      cert_update: 'verification',
      cert_delete: 'upload',
      login: 'verification',
      register: 'verification',
      payment: 'renewal',
      score_update: 'verification',
      report: 'report',
    };

    return actionMap[action] || 'verification';
  }

  private generateTitleAndDescription(log: any): { title: string; description: string } {
    switch (log.action) {
      case 'cert_upload':
        return {
          title: 'Certificate Uploaded',
          description: `Certificate ${log.resource_id} was uploaded`,
        };
      case 'cert_verify':
        return {
          title: 'Certificate Verified',
          description: `Certificate ${log.resource_id} was verified`,
        };
      case 'cert_update':
        return {
          title: 'Certificate Updated',
          description: `Certificate ${log.resource_id} was updated`,
        };
      case 'cert_delete':
        return {
          title: 'Certificate Deleted',
          description: `Certificate ${log.resource_id} was deleted`,
        };
      case 'login':
        return {
          title: 'User Login',
          description: 'User logged into the system',
        };
      case 'register':
        return {
          title: 'User Registration',
          description: 'New user registered',
        };
      case 'payment':
        return {
          title: 'Payment Processed',
          description: 'Payment was processed successfully',
        };
      case 'score_update':
        return {
          title: 'Compliance Score Updated',
          description: 'Compliance score was recalculated',
        };
      default:
        return {
          title: log.action,
          description: log.changes || 'Action completed',
        };
    }
  }
}
