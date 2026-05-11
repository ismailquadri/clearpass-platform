export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface SendWelcomeEmailOptions {
  email: string;
  firstName: string;
  companyName: string;
}

export interface SendExpiryReminderOptions {
  email: string;
  firstName: string;
  certificateName: string;
  expiryDate: string;
  daysToExpiry: number;
}

export interface SendReportEmailOptions {
  email: string;
  firstName: string;
  reportUrl: string;
  companyName: string;
}

export class EmailService {
  private mockEmailLog: Array<{
    to: string;
    subject: string;
    sentAt: Date;
  }> = [];

  async sendEmail(options: EmailOptions): Promise<{ messageId: string }> {
    // Log email for mock purposes
    this.mockEmailLog.push({
      to: options.to,
      subject: options.subject,
      sentAt: new Date(),
    });

    console.log(`📧 Mock Email Sent:`, {
      to: options.to,
      subject: options.subject,
      from: options.from || 'noreply@clearpass.com.ng',
    });

    // Return mock message ID
    return {
      messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  async sendWelcomeEmail(options: SendWelcomeEmailOptions): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Welcome to ClearPass!</h2>
        <p>Hi ${options.firstName},</p>
        <p>Welcome to ClearPass! We're excited to help ${options.companyName} stay compliant with Nigerian federal contractor requirements.</p>
        <p>With ClearPass, you can:</p>
        <ul>
          <li>Manage all your compliance certificates in one place</li>
          <li>Get real-time compliance scores</li>
          <li>Receive automatic expiry reminders</li>
          <li>Generate bid-ready reports</li>
        </ul>
        <p>Get started by uploading your certificates on your dashboard.</p>
        <p>If you have any questions, don't hesitate to reach out.</p>
        <p>Best regards,<br>The ClearPass Team</p>
      </div>
    `;

    await this.sendEmail({
      to: options.email,
      subject: 'Welcome to ClearPass!',
      html,
    });
  }

  async sendExpiryReminder(options: SendExpiryReminderOptions): Promise<void> {
    const urgency = options.daysToExpiry <= 7 ? 'URGENT' : options.daysToExpiry <= 14 ? 'Important' : 'Reminder';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${options.daysToExpiry <= 7 ? '#EF4444' : '#F59E0B'};">${urgency}: Certificate Expiring Soon</h2>
        <p>Hi ${options.firstName},</p>
        <p>This is a reminder that your <strong>${options.certificateName}</strong> will expire on <strong>${options.expiryDate}</strong> (${options.daysToExpiry} days from now).</p>
        <p>To maintain your compliance status, please renew this certificate before it expires.</p>
        <p>You can upload the renewed certificate directly from your dashboard.</p>
        <p>Best regards,<br>The ClearPass Team</p>
      </div>
    `;

    await this.sendEmail({
      to: options.email,
      subject: `${urgency}: ${options.certificateName} Expiring in ${options.daysToExpiry} Days`,
      html,
    });
  }

  async sendReportEmail(options: SendReportEmailOptions): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Your Compliance Report is Ready</h2>
        <p>Hi ${options.firstName},</p>
        <p>Your compliance report for <strong>${options.companyName}</strong> has been generated and is ready for download.</p>
        <p>You can download it from your dashboard or use the link below:</p>
        <p><a href="${options.reportUrl}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Download Report</a></p>
        <p>This report can be used for bid submissions and compliance verification.</p>
        <p>Best regards,<br>The ClearPass Team</p>
      </div>
    `;

    await this.sendEmail({
      to: options.email,
      subject: 'Your Compliance Report is Ready',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `https://clearpass.com.ng/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Password Reset Request</h2>
        <p>You requested a password reset for your ClearPass account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The ClearPass Team</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Reset Your ClearPass Password',
      html,
    });
  }

  getMockEmailLog() {
    return this.mockEmailLog;
  }

  clearMockEmailLog() {
    this.mockEmailLog = [];
  }
}

export const emailService = new EmailService();