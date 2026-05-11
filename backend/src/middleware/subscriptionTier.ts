import { Response, NextFunction } from 'express';
import { db } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../types';

export interface TierLimits {
  maxProfiles: number;
  maxBulkVerifications: number;
  apiAccess: boolean;
  teamMembers: number;
  whiteLabel: boolean;
}

export class SubscriptionTierMiddleware {
  async checkTierLimit(
    userId: string,
    companyId: string,
    resource: 'profiles' | 'bulk_verifications' | 'team_members'
  ): Promise<void> {
    const subscription = await db('subscriptions')
      .where({ company_id: companyId, status: 'active' })
      .first();

    if (!subscription) {
      throw new AppError('NO_ACTIVE_SUBSCRIPTION', 'No active subscription found', 403);
    }

    // Check specific limits
    switch (resource) {
      case 'profiles':
        await this.checkProfileLimit(companyId, subscription.max_profiles || 1);
        break;
      case 'bulk_verifications':
        await this.checkBulkVerificationLimit(companyId, subscription.max_bulk_verifications || 10);
        break;
      case 'team_members':
        await this.checkTeamMemberLimit(companyId, subscription.team_members || 1);
        break;
    }
  }

  async checkApiAccess(userId: string, companyId: string): Promise<void> {
    const subscription = await db('subscriptions')
      .where({ company_id: companyId, status: 'active' })
      .first();

    if (!subscription || !subscription.api_access) {
      throw new AppError(
        'API_ACCESS_DENIED',
        'API access requires Business or Enterprise tier',
        403
      );
    }
  }

  async checkWhiteLabelAccess(userId: string, companyId: string): Promise<void> {
    const subscription = await db('subscriptions')
      .where({ company_id: companyId, status: 'active' })
      .first();

    if (!subscription || !subscription.white_label) {
      throw new AppError('WHITE_LABEL_DENIED', 'White-label features require Enterprise tier', 403);
    }
  }

  private async checkProfileLimit(companyId: string, maxProfiles: number): Promise<void> {
    const count = await db('companies')
      .where('id', companyId) // In production, this would check related companies
      .count('* as count')
      .first();

    if (count && Number(count.count) >= maxProfiles) {
      throw new AppError(
        'PROFILE_LIMIT_EXCEEDED',
        `Maximum ${maxProfiles} profiles allowed for current tier`,
        403
      );
    }
  }

  private async checkBulkVerificationLimit(
    companyId: string,
    maxVerifications: number
  ): Promise<void> {
    // Check current month's usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const count = await db('audit_trail')
      .where({ company_id: companyId, action: 'cert_verify' })
      .where('created_at', '>=', startOfMonth)
      .count('* as count')
      .first();

    if (count && Number(count.count) >= maxVerifications) {
      throw new AppError(
        'BULK_VERIFICATION_LIMIT_EXCEEDED',
        `Maximum ${maxVerifications} bulk verifications per month for current tier`,
        403
      );
    }
  }

  private async checkTeamMemberLimit(companyId: string, maxTeamMembers: number): Promise<void> {
    const count = await db('users')
      .where({ company_id: companyId, status: 'active' })
      .count('* as count')
      .first();

    if (count && Number(count.count) >= maxTeamMembers) {
      throw new AppError(
        'TEAM_MEMBER_LIMIT_EXCEEDED',
        `Maximum ${maxTeamMembers} team members allowed for current tier`,
        403
      );
    }
  }

  getTierLimits(tier: string): TierLimits {
    const limits: Record<string, TierLimits> = {
      starter: {
        maxProfiles: 1,
        maxBulkVerifications: 10,
        apiAccess: false,
        teamMembers: 1,
        whiteLabel: false,
      },
      business: {
        maxProfiles: 5,
        maxBulkVerifications: 100,
        apiAccess: true,
        teamMembers: 5,
        whiteLabel: false,
      },
      enterprise: {
        maxProfiles: 20,
        maxBulkVerifications: 500,
        apiAccess: true,
        teamMembers: 20,
        whiteLabel: true,
      },
    };

    return limits[tier] || limits.starter;
  }
}

export const subscriptionTierMiddleware = new SubscriptionTierMiddleware();

// Middleware factory functions
export const requireApiAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.company_id) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    await subscriptionTierMiddleware.checkApiAccess(req.user.sub, req.user.company_id);
    next();
  } catch (error) {
    next(error);
  }
};

export const requireWhiteLabel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.company_id) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    await subscriptionTierMiddleware.checkWhiteLabelAccess(req.user.sub, req.user.company_id);
    next();
  } catch (error) {
    next(error);
  }
};

export const enforceTierLimit = (resource: 'profiles' | 'bulk_verifications' | 'team_members') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.company_id || !req.user?.sub) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      await subscriptionTierMiddleware.checkTierLimit(req.user.sub, req.user.company_id, resource);
      next();
    } catch (error) {
      next(error);
    }
  };
};
