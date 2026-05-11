import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Session {
  id: string;
  userId: string;
  token: string;
  userAgent: string;
  ipAddress: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
}

export class SessionService {
  private readonly SESSION_EXPIRY_HOURS = 24;
  private readonly MAX_SESSIONS_PER_USER = 5;

  async createSession(
    userId: string,
    token: string,
    userAgent: string,
    ipAddress: string
  ): Promise<Session> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

    // Check max sessions limit
    const sessionCount = await db('user_sessions')
      .where({ user_id: userId })
      .where('expires_at', '>', new Date())
      .count('* as count')
      .first();

    if (sessionCount && Number(sessionCount.count) >= this.MAX_SESSIONS_PER_USER) {
      // Delete oldest session
      await db('user_sessions')
        .where({ user_id: userId })
        .where('expires_at', '>', new Date())
        .orderBy('created_at', 'asc')
        .limit(1)
        .delete();
    }

    const [session] = await db('user_sessions').insert({
      id: uuidv4(),
      user_id: userId,
      token,
      user_agent: userAgent,
      ip_address: ipAddress,
      created_at: now,
      last_activity: now,
      expires_at: expiresAt,
    }).returning('*');

    return session;
  }

  async getSession(token: string): Promise<Session | null> {
    const session = await db('user_sessions')
      .where({ token })
      .where('expires_at', '>', new Date())
      .first();

    if (session) {
      // Update last activity
      await db('user_sessions')
        .where({ id: session.id })
        .update({ last_activity: new Date() });
    }

    return session;
  }

  async deleteSession(token: string): Promise<void> {
    await db('user_sessions')
      .where({ token })
      .delete();
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    await db('user_sessions')
      .where({ user_id: userId })
      .delete();
  }

  async deleteOtherSessions(userId: string, currentToken: string): Promise<void> {
    await db('user_sessions')
      .where({ user_id: userId })
      .whereNot('token', currentToken)
      .delete();
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return await db('user_sessions')
      .where({ user_id: userId })
      .where('expires_at', '>', new Date())
      .orderBy('last_activity', 'desc')
      .select('*');
  }

  async cleanupExpiredSessions(): Promise<void> {
    await db('user_sessions')
      .where('expires_at', '<', new Date())
      .delete();
  }
}

export const sessionService = new SessionService();