/**
 * Email and SMS Notification Delivery Service
 * Provides comprehensive notification delivery with tracking and retry logic
 */

export interface EmailTemplate {
  id: string;
  subject: string;
  body: string;
  variables?: Record<string, string>;
}

export interface SMSMessage {
  to: string;
  message: string;
  variables?: Record<string, string>;
}

export interface NotificationRecipient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferences: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

export interface NotificationDelivery {
  id: string;
  type: 'email' | 'sms';
  recipientId: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  lastAttempt?: string;
  error?: string;
  scheduledFor?: string;
  metadata?: Record<string, any>;
}

export interface NotificationQueue {
  emails: NotificationDelivery[];
  sms: NotificationDelivery[];
}

class NotificationService {
  private emailQueueKey = 'clearpass_email_queue';
  private smsQueueKey = 'clearpass_sms_queue';
  private deliveryHistoryKey = 'clearpass_notification_history';
  private maxRetries = 3;
  private retryDelay = 5 * 60 * 1000; // 5 minutes

  /**
   * Email Templates
   */
  private emailTemplates: Record<string, EmailTemplate> = {
    certificateExpiry: {
      id: 'certificateExpiry',
      subject: 'Certificate Expiry Alert: {{certificateName}}',
      body: `Dear {{name}},

This is a reminder that your {{certificateName}} certificate will expire on {{expiryDate}}.

Certificate Details:
- Certificate: {{certificateName}}
- Expiry Date: {{expiryDate}}
- Days Remaining: {{daysRemaining}}

Please ensure you renew this certificate before the expiry date to maintain your compliance status.

If you have already renewed this certificate, please update it in your ClearPass dashboard.

Best regards,
ClearPass Compliance Team`,
    },

    complianceScoreChange: {
      id: 'complianceScoreChange',
      subject: 'Compliance Score Update: {{companyName}}',
      body: `Dear {{name}},

Your compliance score has been {{changeDirection}} from {{oldScore}} to {{newScore}}.

Company: {{companyName}}
Previous Score: {{oldScore}}
New Score: {{newScore}}
Change: {{changeDirection === 'decreased' ? '-' : '+'}}{{Math.abs(newScore - oldScore)}}

{{message}}

Please review your dashboard for more details.

Best regards,
ClearPass Compliance Team`,
    },

    verificationComplete: {
      id: 'verificationComplete',
      subject: 'Certificate Verification Complete: {{certificateName}}',
      body: `Dear {{name},

Your {{certificateName}} certificate has been successfully verified.

Certificate Details:
- Certificate: {{certificateName}}
- Certificate Number: {{certificateNumber}}
- Verification Date: {{verificationDate}}
- Status: {{status}}

You can view the verified certificate in your ClearPass dashboard.

Best regards,
ClearPass Compliance Team`,
    },

    weeklySummary: {
      id: 'weeklySummary',
      subject: 'Weekly Compliance Summary: {{companyName}}',
      body: `Dear {{name},

Here's your weekly compliance summary for {{companyName}}.

Overall Compliance Score: {{score}}
Active Certificates: {{activeCertificates}}
Expiring Soon: {{expiringSoon}}
Expired Certificates: {{expiredCertificates}}

Actions Required:
{{actionsRequired}}

Please review your dashboard for detailed information.

Best regards,
ClearPass Compliance Team`,
    },

    welcomeEmail: {
      id: 'welcomeEmail',
      subject: 'Welcome to ClearPass - {{companyName}}',
      body: `Dear {{name},

Welcome to ClearPass! We're excited to help you manage your compliance requirements.

Your account has been successfully created with the following details:
- Company: {{companyName}}
- Email: {{email}}
- Account Type: {{accountType}}

Next Steps:
1. Complete your company profile
2. Upload your compliance certificates
3. Run your first compliance check

If you have any questions, please don't hesitate to reach out to our support team.

Best regards,
ClearPass Team`,
    },
  };

  /**
   * SMS Templates
   */
  private smsTemplates: Record<string, SMSMessage> = {
    criticalExpiry: {
      to: '',
      message:
        'ALERT: Your {{certificateName}} expires in {{daysRemaining}} days. Renew now to maintain compliance. ClearPass',
    },

    scoreDrop: {
      to: '',
      message:
        'Your compliance score dropped to {{score}}. Please check your ClearPass dashboard for details.',
    },

    verificationComplete: {
      to: '',
      message: 'Your {{certificateName}} has been verified. View details in ClearPass.',
    },
  };

  /**
   * Send email notification
   */
  async sendEmail(
    templateId: string,
    recipient: NotificationRecipient,
    variables: Record<string, string> = {}
  ): Promise<NotificationDelivery> {
    if (!recipient.preferences.email) {
      throw new Error('Email notifications are disabled for this recipient');
    }

    const template = this.emailTemplates[templateId];
    if (!template) {
      throw new Error(`Email template ${templateId} not found`);
    }

    // Replace variables in template
    const subject = this.replaceVariables(template.subject, { ...variables, name: recipient.name });
    this.replaceVariables(template.body, {
      ...variables,
      name: recipient.name,
      email: recipient.email,
    });

    const delivery: NotificationDelivery = {
      id: this.generateId(),
      type: 'email',
      recipientId: recipient.id,
      status: 'pending',
      attempts: 0,
      metadata: {
        templateId,
        subject,
        to: recipient.email,
      },
    };

    // Add to queue
    this.addToQueue(delivery);

    // Simulate sending (in production, this would call an email API)
    await this.simulateDelivery(delivery);

    return delivery;
  }

  /**
   * Send SMS notification
   */
  async sendSMS(
    templateId: string,
    recipient: NotificationRecipient,
    variables: Record<string, string> = {}
  ): Promise<NotificationDelivery> {
    if (!recipient.preferences.sms) {
      throw new Error('SMS notifications are disabled for this recipient');
    }

    if (!recipient.phone) {
      throw new Error('Recipient phone number not provided');
    }

    const template = this.smsTemplates[templateId];
    if (!template) {
      throw new Error(`SMS template ${templateId} not found`);
    }

    // Replace variables in template
    const message = this.replaceVariables(template.message, variables);

    const delivery: NotificationDelivery = {
      id: this.generateId(),
      type: 'sms',
      recipientId: recipient.id,
      status: 'pending',
      attempts: 0,
      metadata: {
        templateId,
        message,
        to: recipient.phone,
      },
    };

    // Add to queue
    this.addToQueue(delivery);

    // Simulate sending (in production, this would call an SMS API)
    await this.simulateDelivery(delivery);

    return delivery;
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmail(
    templateId: string,
    recipients: NotificationRecipient[],
    variables: Record<string, string> = {}
  ): Promise<NotificationDelivery[]> {
    const deliveries: NotificationDelivery[] = [];

    for (const recipient of recipients) {
      try {
        const delivery = await this.sendEmail(templateId, recipient, variables);
        deliveries.push(delivery);
      } catch (error) {
        console.error(`Failed to queue email for ${recipient.email}:`, error);
      }
    }

    return deliveries;
  }

  /**
   * Get notification queue
   */
  getQueue(): NotificationQueue {
    return {
      emails: this.getQueueItems(this.emailQueueKey),
      sms: this.getQueueItems(this.smsQueueKey),
    };
  }

  /**
   * Get delivery history
   */
  getDeliveryHistory(recipientId?: string): NotificationDelivery[] {
    const history = this.getDeliveryHistoryItems();

    if (recipientId) {
      return history.filter((item) => item.recipientId === recipientId);
    }

    return history;
  }

  /**
   * Process pending notifications
   */
  async processQueue(): Promise<void> {
    const queue = this.getQueue();
    const now = Date.now();

    // Process email queue
    for (const delivery of queue.emails) {
      if (
        delivery.status === 'pending' ||
        (delivery.status === 'retrying' && this.shouldRetry(delivery, now))
      ) {
        await this.simulateDelivery(delivery);
      }
    }

    // Process SMS queue
    for (const delivery of queue.sms) {
      if (
        delivery.status === 'pending' ||
        (delivery.status === 'retrying' && this.shouldRetry(delivery, now))
      ) {
        await this.simulateDelivery(delivery);
      }
    }
  }

  /**
   * Clear delivery history
   */
  clearHistory(olderThanDays: number = 30): number {
    const history = this.getDeliveryHistoryItems();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const filtered = history.filter((item) => {
      const lastAttempt = item.lastAttempt
        ? new Date(item.lastAttempt)
        : new Date(item.scheduledFor || Date.now());
      return lastAttempt >= cutoffDate;
    });

    localStorage.setItem(this.deliveryHistoryKey, JSON.stringify(filtered));

    return history.length - filtered.length;
  }

  // Private helper methods

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }

  private addToQueue(delivery: NotificationDelivery): void {
    const queueKey = delivery.type === 'email' ? this.emailQueueKey : this.smsQueueKey;
    const queue = this.getQueueItems(queueKey);
    queue.push(delivery);
    localStorage.setItem(queueKey, JSON.stringify(queue));
  }

  private getQueueItems(key: string): NotificationDelivery[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private getDeliveryHistoryItems(): NotificationDelivery[] {
    try {
      const data = localStorage.getItem(this.deliveryHistoryKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private async simulateDelivery(delivery: NotificationDelivery): Promise<void> {
    const queueKey = delivery.type === 'email' ? this.emailQueueKey : this.smsQueueKey;
    const queue = this.getQueueItems(queueKey);

    // Update delivery status
    const index = queue.findIndex((item) => item.id === delivery.id);
    if (index === -1) return;

    delivery.attempts++;
    delivery.lastAttempt = new Date().toISOString();

    // Simulate success/failure (90% success rate)
    const success = Math.random() > 0.1;

    if (success) {
      delivery.status = 'delivered';
    } else {
      if (delivery.attempts >= this.maxRetries) {
        delivery.status = 'failed';
        delivery.error = 'Max retries exceeded';
      } else {
        delivery.status = 'retrying';
        delivery.scheduledFor = new Date(Date.now() + this.retryDelay).toISOString();
      }
    }

    queue[index] = delivery;
    localStorage.setItem(queueKey, JSON.stringify(queue));

    // Add to history
    const history = this.getDeliveryHistoryItems();
    history.push(delivery);
    localStorage.setItem(this.deliveryHistoryKey, JSON.stringify(history));

    // Remove from queue if delivered or failed
    if (delivery.status === 'delivered' || delivery.status === 'failed') {
      const updatedQueue = queue.filter((item) => item.id !== delivery.id);
      localStorage.setItem(queueKey, JSON.stringify(updatedQueue));
    }
  }

  private shouldRetry(delivery: NotificationDelivery, now: number): boolean {
    if (!delivery.scheduledFor) return false;
    return new Date(delivery.scheduledFor).getTime() <= now;
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const notificationService = new NotificationService();

/**
 * Convenience functions for common notifications
 */
export const notifications = {
  sendCertificateExpiryAlert: (
    recipient: NotificationRecipient,
    certificateName: string,
    expiryDate: string,
    daysRemaining: number
  ) =>
    notificationService.sendEmail('certificateExpiry', recipient, {
      certificateName,
      expiryDate,
      daysRemaining: daysRemaining.toString(),
    }),

  sendComplianceScoreChange: (
    recipient: NotificationRecipient,
    companyName: string,
    oldScore: number,
    newScore: number,
    message: string
  ) =>
    notificationService.sendEmail('complianceScoreChange', recipient, {
      companyName,
      oldScore: oldScore.toString(),
      newScore: newScore.toString(),
      changeDirection: newScore < oldScore ? 'decreased' : 'increased',
      message,
    }),

  sendCriticalExpirySMS: (
    recipient: NotificationRecipient,
    certificateName: string,
    daysRemaining: number
  ) =>
    notificationService.sendSMS('criticalExpiry', recipient, {
      certificateName,
      daysRemaining: daysRemaining.toString(),
    }),

  sendWelcomeEmail: (recipient: NotificationRecipient, companyName: string, accountType: string) =>
    notificationService.sendEmail('welcomeEmail', recipient, {
      companyName,
      accountType,
    }),
};
