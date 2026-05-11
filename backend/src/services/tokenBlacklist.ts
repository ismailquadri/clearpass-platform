export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();
  private tokenExpiry: Map<string, number> = new Map();

  addToken(token: string, expiresIn: number = 24 * 60 * 60 * 1000): void {
    this.blacklistedTokens.add(token);
    this.tokenExpiry.set(token, Date.now() + expiresIn);
  }

  isTokenBlacklisted(token: string): boolean {
    if (!this.blacklistedTokens.has(token)) {
      return false;
    }

    const expiry = this.tokenExpiry.get(token);
    if (!expiry || Date.now() > expiry) {
      // Token expired, remove from blacklist
      this.blacklistedTokens.delete(token);
      this.tokenExpiry.delete(token);
      return false;
    }

    return true;
  }

  removeToken(token: string): void {
    this.blacklistedTokens.delete(token);
    this.tokenExpiry.delete(token);
  }

  blacklistUserTokens(userId: string): void {
    // In a real implementation, you would store user-specific tokens
    // For now, this is a placeholder
    console.log(`Blacklisting all tokens for user: ${userId}`);
  }

  cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, expiry] of this.tokenExpiry.entries()) {
      if (now > expiry) {
        this.blacklistedTokens.delete(token);
        this.tokenExpiry.delete(token);
      }
    }
  }
}

export const tokenBlacklistService = new TokenBlacklistService();