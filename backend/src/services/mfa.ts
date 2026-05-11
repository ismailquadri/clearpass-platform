import { db } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';

export interface MFASetupResponse {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export class MFAService {
  async setupMFA(userId: string): Promise<MFASetupResponse> {
    // Generate a simple secret (in production, use a proper TOTP library)
    const secret = this.generateSecret();

    // Get user email for label
    const user = await db('users')
      .where({ id: userId })
      .first();

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    // Generate QR code URL (simplified for mock)
    const qrCodeUrl = `otpauth://totp/ClearPass:${user.email}?secret=${secret}&issuer=ClearPass`;

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Store in database (not enabled yet)
    await db('users')
      .where({ id: userId })
      .update({
        mfa_secret: secret,
      });

    return {
      secret,
      qrCodeUrl,
      backupCodes,
    };
  }

  async enableMFA(userId: string, token: string, backupCodes: string[]): Promise<void> {
    const user = await db('users')
      .where({ id: userId })
      .first();

    if (!user || !user.mfa_secret) {
      throw new AppError('MFA_NOT_SETUP', 'MFA not set up', 400);
    }

    // Mock token verification (in production, use proper TOTP verification)
    const isValid = this.mockVerifyToken(token, user.mfa_secret);

    if (!isValid) {
      throw new AppError('INVALID_TOKEN', 'Invalid MFA token', 400);
    }

    // Store backup codes (in production, hash these)
    await db('users')
      .where({ id: userId })
      .update({
        mfa_enabled: true,
      });

    // Store backup codes in a separate table
    for (const code of backupCodes) {
      await db('mfa_backup_codes')
        .insert({
          user_id: userId,
          code: code, // In production, hash this
          used: false,
        });
    }
  }

  async disableMFA(userId: string, password: string): Promise<void> {
    // Verify password first
    const user = await db('users')
      .where({ id: userId })
      .first();

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new AppError('INVALID_PASSWORD', 'Invalid password', 401);
    }

    // Disable MFA
    await db('users')
      .where({ id: userId })
      .update({
        mfa_enabled: false,
        mfa_secret: null,
      });

    // Delete backup codes
    await db('mfa_backup_codes')
      .where({ user_id: userId })
      .delete();
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const user = await db('users')
      .where({ id: userId })
      .first();

    if (!user || !user.mfa_enabled || !user.mfa_secret) {
      return false;
    }

    // Check if it's a backup code
    const backupCode = await db('mfa_backup_codes')
      .where({
        user_id: userId,
        code: token,
        used: false,
      })
      .first();

    if (backupCode) {
      // Mark as used
      await db('mfa_backup_codes')
        .where({ id: backupCode.id })
        .update({ used: true });
      return true;
    }

    // Mock TOTP verification (in production, use proper TOTP library)
    return this.mockVerifyToken(token, user.mfa_secret);
  }

  private generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  private mockVerifyToken(token: string, _secret: string): boolean {
    // Mock verification - in production use proper TOTP
    // For now, accept any 6-digit token for testing
    return token.length === 6 && /^\d+$/.test(token);
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(this.generateRandomCode());
    }
    return codes;
  }

  private generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export const mfaService = new MFAService();