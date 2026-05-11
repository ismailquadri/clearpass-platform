import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { env } from '../config/env';
import type { JwtPayload } from '../types';
import { AppError } from '../middleware/errorHandler';

export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  company_name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    company_id: string | null;
  };
  token: string;
  refreshToken: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await db('users')
      .where({ email: input.email })
      .first();

    if (existingUser) {
      throw new AppError('EMAIL_EXISTS', 'User with this email already exists', 409);
    }

    // Hash password
    const password_hash = await bcrypt.hash(input.password, 12);

    // Create company if company_name is provided
    let company_id: string | null = null;
    if (input.company_name) {
      const [company] = await db('companies')
        .insert({
          name: input.company_name,
          subscription_tier: 'starter',
          status: 'active',
        })
        .returning('id');

      company_id = company.id;
    }

    // Create user
    const [user] = await db('users')
      .insert({
        email: input.email,
        password_hash,
        first_name: input.first_name,
        last_name: input.last_name,
        phone: input.phone || null,
        role: input.role,
        company_id,
        status: 'active',
      })
      .returning(['id', 'email', 'first_name', 'last_name', 'role', 'company_id']);

    // Generate tokens
    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Log audit trail
    await this.logAudit(user.id, company_id, 'register', 'user', user.id, null, user);

    return {
      user,
      token,
      refreshToken,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await db('users')
      .where({ email: input.email })
      .first();

    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(input.password, user.password_hash);

    if (!isValidPassword) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    // Check user status
    if (user.status !== 'active') {
      throw new AppError('ACCOUNT_SUSPENDED', 'Account is suspended', 403);
    }

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ last_login: new Date() });

    // Prepare user response
    const userResponse = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      company_id: user.company_id,
    };

    // Generate tokens
    const token = this.generateAccessToken(userResponse);
    const refreshToken = this.generateRefreshToken(userResponse);

    // Log audit trail
    await this.logAudit(user.id, user.company_id, 'login', 'user', user.id, null, userResponse);

    return {
      user: userResponse,
      token,
      refreshToken,
    };
  }

  async me(userId: string): Promise<AuthResponse['user']> {
    const user = await db('users')
      .where({ id: userId })
      .first();

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      company_id: user.company_id,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as JwtPayload;

      const user = await db('users')
        .where({ id: decoded.sub })
        .first();

      if (!user || user.status !== 'active') {
        throw new AppError('INVALID_TOKEN', 'Invalid refresh token', 401);
      }

      const userResponse = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        company_id: user.company_id,
      };

      const token = this.generateAccessToken(userResponse);
      const newRefreshToken = this.generateRefreshToken(userResponse);

      return {
        user: userResponse,
        token,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new AppError('INVALID_TOKEN', 'Invalid refresh token', 401);
    }
  }

  private generateAccessToken(user: { id: string; email: string; role: string; company_id: string | null }): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as any,
      company_id: user.company_id,
    };

    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as any,
    });
  }

  private generateRefreshToken(user: { id: string; email: string; role: string; company_id: string | null }): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as any,
      company_id: user.company_id,
    };

    return jwt.sign(payload, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshExpiresIn as any,
    });
  }

  private async logAudit(
    user_id: string,
    company_id: string | null,
    action: string,
    resource: string,
    resource_id: string,
    old_values: unknown,
    new_values: unknown
  ): Promise<void> {
    await db('audit_trail').insert({
      user_id,
      company_id,
      action,
      resource,
      resource_id,
      old_values: old_values as Record<string, unknown>,
      new_values: new_values as Record<string, unknown>,
      status: 'success',
    });
  }
}