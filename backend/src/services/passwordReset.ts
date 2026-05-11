import { db } from '../config/database';
import { emailService } from './email';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface RequestResetInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export class PasswordResetService {
  private resetTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();
  private readonly TOKEN_EXPIRY_HOURS = 1;

  async requestReset(input: RequestResetInput): Promise<void> {
    const user = await db('users')
      .where({ email: input.email })
      .first();

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Store token
    this.resetTokens.set(token, {
      userId: user.id,
      expiresAt,
    });

    // Send email
    await emailService.sendPasswordResetEmail(input.email, token);
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const tokenData = this.resetTokens.get(input.token);

    if (!tokenData) {
      throw new AppError('INVALID_TOKEN', 'Invalid or expired reset token', 400);
    }

    if (new Date() > tokenData.expiresAt) {
      this.resetTokens.delete(input.token);
      throw new AppError('TOKEN_EXPIRED', 'Reset token has expired', 400);
    }

    // Hash new password
    const password_hash = await bcrypt.hash(input.newPassword, 12);

    // Update password
    await db('users')
      .where({ id: tokenData.userId })
      .update({
        password_hash,
        updated_at: new Date(),
      });

    // Delete token
    this.resetTokens.delete(input.token);

    // Log audit trail
    await db('audit_trail').insert({
      user_id: tokenData.userId,
      action: 'password_reset',
      resource: 'user',
      resource_id: tokenData.userId,
      changes: 'Password was reset',
      status: 'success',
    });
  }

  async validateToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    const tokenData = this.resetTokens.get(token);

    if (!tokenData) {
      return { valid: false };
    }

    if (new Date() > tokenData.expiresAt) {
      this.resetTokens.delete(token);
      return { valid: false };
    }

    return { valid: true, userId: tokenData.userId };
  }

  // Clean up expired tokens
  cleanupExpiredTokens(): void {
    const now = new Date();
    for (const [token, data] of this.resetTokens.entries()) {
      if (now > data.expiresAt) {
        this.resetTokens.delete(token);
      }
    }
  }
}

export const passwordResetService = new PasswordResetService();