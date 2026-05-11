import { db } from '../config/database';
import { EXPIRY_THRESHOLDS, CERT_TYPES } from '../config/constants';
import type { CertificateRow } from '../types';

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  certificateName?: string;
  daysToExpiry?: number;
  actionRequired: boolean;
  isRead: boolean;
  canDismiss: boolean;
}

const CERTIFICATE_NAMES: Record<string, string> = {
  nhia: 'NHIA Certificate',
  pcc: 'Police Character Certificate',
  nsitf: 'NSITF Certificate',
  firs: 'FIRS Tax Clearance',
  bpp: 'BPP Certificate',
  itf: 'ITF Certificate',
};

export class AlertsService {
  async getAlerts(companyId: string, userId?: string): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Get all certificates for the company
    const certificates = await db('certificates')
      .where({ company_id: companyId })
      .whereNull('deleted_at');

    // Generate alerts for expiring/expired certificates
    for (const cert of certificates) {
      const alert = this.generateCertificateAlert(cert);
      if (alert) {
        alerts.push(alert);
      }
    }

    // Generate alerts for missing certificates
    const presentTypes = certificates.map(c => c.cert_type);
    const missingTypes = CERT_TYPES.filter(type => !presentTypes.includes(type));

    for (const type of missingTypes) {
      alerts.push({
        id: `missing-${type}`,
        type: 'warning',
        title: 'Missing Certificate',
        message: `${CERTIFICATE_NAMES[type]} is not uploaded`,
        timestamp: new Date().toISOString(),
        certificateName: CERTIFICATE_NAMES[type],
        actionRequired: true,
        isRead: false,
        canDismiss: false,
      });
    }

    // Get user-specific read status if userId is provided
    if (userId) {
      const readAlertIds = await db('user_alert_reads')
        .where({ user_id: userId })
        .pluck('alert_id');

      return alerts.map(alert => ({
        ...alert,
        isRead: readAlertIds.includes(alert.id),
      }));
    }

    return alerts;
  }

  async markAsRead(alertId: string, userId: string): Promise<void> {
    await db('user_alert_reads')
      .insert({
        user_id: userId,
        alert_id: alertId,
        read_at: new Date(),
      })
      .onConflict(['user_id', 'alert_id'])
      .ignore();
  }

  async markAllAsRead(companyId: string, userId: string): Promise<void> {
    const alerts = await this.getAlerts(companyId);
    const alertIds = alerts.map(a => a.id);

    for (const alertId of alertIds) {
      await db('user_alert_reads')
        .insert({
          user_id: userId,
          alert_id: alertId,
          read_at: new Date(),
        })
        .onConflict(['user_id', 'alert_id'])
        .ignore();
    }
  }

  async dismissAlert(alertId: string, userId: string): Promise<void> {
    // In a real implementation, this might delete the alert from a database
    // For now, we'll just mark it as read and log the dismissal
    await db('user_alert_reads')
      .insert({
        user_id: userId,
        alert_id: alertId,
        read_at: new Date(),
      })
      .onConflict(['user_id', 'alert_id'])
      .ignore();
  }

  private generateCertificateAlert(cert: CertificateRow): Alert | null {
    if (!cert.expiry_date) {
      return null;
    }

    const expiry = new Date(cert.expiry_date);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const certName = CERTIFICATE_NAMES[cert.cert_type] || cert.cert_type.toUpperCase();

    if (diffDays < 0) {
      return {
        id: cert.id,
        type: 'critical',
        title: 'Certificate Expired',
        message: `${certName} expired on ${this.formatDate(expiry)}`,
        timestamp: new Date().toISOString(),
        certificateName: certName,
        daysToExpiry: diffDays,
        actionRequired: true,
        isRead: false,
        canDismiss: false,
      };
    } else if (diffDays <= EXPIRY_THRESHOLDS.critical) {
      return {
        id: cert.id,
        type: 'critical',
        title: 'Certificate Expiring Soon',
        message: `${certName} expires in ${diffDays} days`,
        timestamp: new Date().toISOString(),
        certificateName: certName,
        daysToExpiry: diffDays,
        actionRequired: true,
        isRead: false,
        canDismiss: false,
      };
    } else if (diffDays <= EXPIRY_THRESHOLDS.urgent) {
      return {
        id: cert.id,
        type: 'warning',
        title: 'Certificate Expiring Soon',
        message: `${certName} expires in ${diffDays} days`,
        timestamp: new Date().toISOString(),
        certificateName: certName,
        daysToExpiry: diffDays,
        actionRequired: true,
        isRead: false,
        canDismiss: true,
      };
    } else if (diffDays <= EXPIRY_THRESHOLDS.soon) {
      return {
        id: cert.id,
        type: 'info',
        title: 'Certificate Expiring Soon',
        message: `${certName} expires in ${diffDays} days`,
        timestamp: new Date().toISOString(),
        certificateName: certName,
        daysToExpiry: diffDays,
        actionRequired: false,
        isRead: false,
        canDismiss: true,
      };
    }

    return null;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}