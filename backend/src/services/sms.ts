export interface SendSmsOptions {
  phoneNumber: string;
  message: string;
}

export interface SendExpiryReminderSmsOptions {
  phoneNumber: string;
  firstName: string;
  certificateName: string;
  expiryDate: string;
  daysToExpiry: number;
}

export class SmsService {
  private mockSmsLog: Array<{
    to: string;
    message: string;
    sentAt: Date;
  }> = [];

  async sendSms(options: SendSmsOptions): Promise<{ messageId: string }> {
    // Log SMS for mock purposes
    this.mockSmsLog.push({
      to: options.phoneNumber,
      message: options.message,
      sentAt: new Date(),
    });

    console.log(`📱 Mock SMS Sent:`, {
      to: options.phoneNumber,
      message: options.message,
    });

    // Return mock message ID
    return {
      messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  async sendExpiryReminder(options: SendExpiryReminderSmsOptions): Promise<void> {
    const urgency = options.daysToExpiry <= 7 ? 'URGENT' : options.daysToExpiry <= 14 ? 'Important' : 'Reminder';

    const message = `${urgency}: Your ${options.certificateName} expires in ${options.daysToExpiry} days (${options.expiryDate}). Please renew to maintain compliance. - ClearPass`;

    await this.sendSms({
      phoneNumber: options.phoneNumber,
      message,
    });
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    const message = `Your ClearPass verification code is: ${code}. Valid for 10 minutes.`;

    await this.sendSms({
      phoneNumber,
      message,
    });
  }

  getMockSmsLog() {
    return this.mockSmsLog;
  }

  clearMockSmsLog() {
    this.mockSmsLog = [];
  }
}

export const smsService = new SmsService();