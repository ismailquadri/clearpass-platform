/**
 * Comprehensive Audit Trail System
 * Provides immutable logging of all compliance-related actions
 */

export type AuditActionType =
  | 'certificate.created'
  | 'certificate.updated'
  | 'certificate.deleted'
  | 'certificate.verified'
  | 'certificate.expired'
  | 'certificate.renewed'
  | 'certificate.uploaded'
  | 'company.created'
  | 'company.updated'
  | 'company.rc_verified'
  | 'company.bvn_verified'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.login'
  | 'user.logout'
  | 'user.role_changed'
  | 'compliance.check_run'
  | 'compliance.score_changed'
  | 'mda.verification_performed'
  | 'mda.prequalification_created'
  | 'document.uploaded'
  | 'document.deleted'
  | 'document.verified'
  | 'notification.sent'
  | 'export.generated'
  | 'settings.changed'
  | 'api.rate_limit_exceeded'
  | 'security.suspicious_activity';

export type EntityType = 'certificate' | 'company' | 'user' | 'document' | 'compliance' | 'mda_verification' | 'prequalification' | 'notification' | 'export' | 'settings' | 'system';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actionType: AuditActionType;
  entityType: EntityType;
  entityId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  description: string;
  details?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes?: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;
    metadata?: Record<string, any>;
  };
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'compliance' | 'security' | 'user_management' | 'system' | 'business';
}

export interface AuditTrailFilters {
  startDate?: string;
  endDate?: string;
  actionType?: AuditActionType;
  entityType?: EntityType;
  userId?: string;
  severity?: AuditLogEntry['severity'];
  category?: AuditLogEntry['category'];
  searchQuery?: string;
}

export interface AuditTrailStats {
  totalEntries: number;
  entriesByAction: Record<AuditActionType, number>;
  entriesBySeverity: Record<AuditLogEntry['severity'], number>;
  entriesByCategory: Record<AuditLogEntry['category'], number>;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

class AuditTrailService {
  private storageKey = 'clearpass_audit_trail';
  private maxEntries = 10000; // Prevent unlimited growth

  /**
   * Log an audit event
   */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    this.saveEntry(auditEntry);
    return auditEntry;
  }

  /**
   * Log certificate-related actions
   */
  logCertificateAction(
    action: 'created' | 'updated' | 'deleted' | 'verified' | 'expired' | 'renewed' | 'uploaded',
    certificateId: string,
    certificateName: string,
    user: { id: string; name: string; email: string; role: string },
    details?: AuditLogEntry['details']
  ) {
    return this.log({
      actionType: `certificate.${action}` as AuditActionType,
      entityType: 'certificate',
      entityId: certificateId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      description: this.getCertificateDescription(action, certificateName),
      details,
      severity: this.getCertificateSeverity(action),
      category: 'compliance',
    });
  }

  /**
   * Log company-related actions
   */
  logCompanyAction(
    action: 'created' | 'updated' | 'rc_verified' | 'bvn_verified',
    companyId: string,
    companyName: string,
    user: { id: string; name: string; email: string; role: string },
    details?: AuditLogEntry['details']
  ) {
    return this.log({
      actionType: `company.${action}` as AuditActionType,
      entityType: 'company',
      entityId: companyId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      description: this.getCompanyDescription(action, companyName),
      details,
      severity: action === 'created' ? 'info' : 'warning',
      category: 'business',
    });
  }

  /**
   * Log user-related actions
   */
  logUserAction(
    action: 'created' | 'updated' | 'deleted' | 'login' | 'logout' | 'role_changed',
    targetUserId: string,
    targetUserName: string,
    actor: { id: string; name: string; email: string; role: string },
    details?: AuditLogEntry['details']
  ) {
    return this.log({
      actionType: `user.${action}` as AuditActionType,
      entityType: 'user',
      entityId: targetUserId,
      userId: actor.id,
      userName: actor.name,
      userEmail: actor.email,
      userRole: actor.role,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      description: this.getUserDescription(action, targetUserName),
      details,
      severity: action === 'deleted' ? 'error' : action === 'login' || action === 'logout' ? 'info' : 'warning',
      category: 'user_management',
    });
  }

  /**
   * Log compliance-related actions
   */
  logComplianceAction(
    action: 'check_run' | 'score_changed',
    complianceId: string,
    user: { id: string; name: string; email: string; role: string },
    details?: AuditLogEntry['details']
  ) {
    return this.log({
      actionType: `compliance.${action}` as AuditActionType,
      entityType: 'compliance',
      entityId: complianceId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      description: action === 'check_run' ? 'Compliance check performed' : 'Compliance score changed',
      details,
      severity: 'info',
      category: 'compliance',
    });
  }

  /**
   * Log MDA verification actions
   */
  logMDAAction(
    action: 'verification_performed' | 'prequalification_created',
    entityId: string,
    entityName: string,
    user: { id: string; name: string; email: string; role: string },
    details?: AuditLogEntry['details']
  ) {
    return this.log({
      actionType: `mda.${action}` as AuditActionType,
      entityType: action === 'verification_performed' ? 'mda_verification' : 'prequalification',
      entityId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      description: action === 'verification_performed'
        ? `MDA verification performed for ${entityName}`
        : `Pre-qualification list created: ${entityName}`,
      details,
      severity: 'info',
      category: 'business',
    });
  }

  /**
   * Log security events
   */
  logSecurityEvent(
    action: 'api.rate_limit_exceeded' | 'security.suspicious_activity',
    description: string,
    user?: { id: string; name: string; email: string; role: string },
    details?: AuditLogEntry['details']
  ) {
    return this.log({
      actionType: action,
      entityType: 'system',
      entityId: 'system',
      userId: user?.id || 'system',
      userName: user?.name || 'System',
      userEmail: user?.email || 'system@clearpass',
      userRole: user?.role || 'system',
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      description,
      details,
      severity: action === 'security.suspicious_activity' ? 'critical' : 'warning',
      category: 'security',
    });
  }

  /**
   * Retrieve audit trail entries with optional filters
   */
  getEntries(filters?: AuditTrailFilters): AuditLogEntry[] {
    const entries = this.getAllEntries();

    let filtered = [...entries];

    if (filters?.startDate) {
      filtered = filtered.filter(entry => entry.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter(entry => entry.timestamp <= filters.endDate!);
    }

    if (filters?.actionType) {
      filtered = filtered.filter(entry => entry.actionType === filters.actionType);
    }

    if (filters?.entityType) {
      filtered = filtered.filter(entry => entry.entityType === filters.entityType);
    }

    if (filters?.userId) {
      filtered = filtered.filter(entry => entry.userId === filters.userId);
    }

    if (filters?.severity) {
      filtered = filtered.filter(entry => entry.severity === filters.severity);
    }

    if (filters?.category) {
      filtered = filtered.filter(entry => entry.category === filters.category);
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.description.toLowerCase().includes(query) ||
        entry.userName.toLowerCase().includes(query) ||
        entry.entityId.toLowerCase().includes(query)
      );
    }

    // Sort by timestamp descending (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get audit trail statistics
   */
  getStats(): AuditTrailStats {
    const entries = this.getAllEntries();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats: AuditTrailStats = {
      totalEntries: entries.length,
      entriesByAction: {} as Record<AuditActionType, number>,
      entriesBySeverity: { info: 0, warning: 0, error: 0, critical: 0 },
      entriesByCategory: { compliance: 0, security: 0, user_management: 0, system: 0, business: 0 },
      todayCount: 0,
      weekCount: 0,
      monthCount: 0,
    };

    entries.forEach(entry => {
      // Count by action type
      stats.entriesByAction[entry.actionType] = (stats.entriesByAction[entry.actionType] || 0) + 1;

      // Count by severity
      stats.entriesBySeverity[entry.severity]++;

      // Count by category
      stats.entriesByCategory[entry.category]++;

      // Count by time period
      const entryDate = new Date(entry.timestamp);
      if (entryDate >= today) {
        stats.todayCount++;
      }
      if (entryDate >= weekAgo) {
        stats.weekCount++;
      }
      if (entryDate >= monthAgo) {
        stats.monthCount++;
      }
    });

    return stats;
  }

  /**
   * Export audit trail to CSV
   */
  exportToCSV(filters?: AuditTrailFilters): string {
    const entries = this.getEntries(filters);

    const headers = [
      'Timestamp',
      'Action Type',
      'Entity Type',
      'Entity ID',
      'User',
      'User Email',
      'User Role',
      'IP Address',
      'Description',
      'Severity',
      'Category',
    ];

    const rows = entries.map(entry => [
      entry.timestamp,
      entry.actionType,
      entry.entityType,
      entry.entityId,
      entry.userName,
      entry.userEmail,
      entry.userRole,
      entry.ipAddress,
      entry.description,
      entry.severity,
      entry.category,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Clear old audit trail entries (maintenance)
   */
  clearOldEntries(olderThanDays: number = 90): number {
    const entries = this.getAllEntries();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const filtered = entries.filter(entry => new Date(entry.timestamp) >= cutoffDate);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));

    return entries.length - filtered.length;
  }

  // Private helper methods

  private getAllEntries(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveEntry(entry: AuditLogEntry): void {
    const entries = this.getAllEntries();

    // Add new entry
    entries.push(entry);

    // Enforce max entries limit
    if (entries.length > this.maxEntries) {
      entries.splice(0, entries.length - this.maxEntries);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(entries));
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getClientIP(): string {
    // In a real implementation, this would come from the server
    // For now, return a placeholder
    return 'client_ip_placeholder';
  }

  private getCertificateDescription(action: string, certificateName: string): string {
    const descriptions: Record<string, string> = {
      created: `Certificate "${certificateName}" created`,
      updated: `Certificate "${certificateName}" updated`,
      deleted: `Certificate "${certificateName}" deleted`,
      verified: `Certificate "${certificateName}" verified`,
      expired: `Certificate "${certificateName}" has expired`,
      renewed: `Certificate "${certificateName}" renewed`,
      uploaded: `Document uploaded for certificate "${certificateName}"`,
    };
    return descriptions[action] || `Certificate action: ${action} on "${certificateName}"`;
  }

  private getCertificateSeverity(action: string): AuditLogEntry['severity'] {
    const severities: Record<string, AuditLogEntry['severity']> = {
      created: 'info',
      updated: 'info',
      deleted: 'error',
      verified: 'info',
      expired: 'warning',
      renewed: 'info',
      uploaded: 'info',
    };
    return severities[action] || 'info';
  }

  private getCompanyDescription(action: string, companyName: string): string {
    const descriptions: Record<string, string> = {
      created: `Company "${companyName}" registered`,
      updated: `Company "${companyName}" profile updated`,
      rc_verified: `RC Number verified for "${companyName}"`,
      bvn_verified: `BVN verified for "${companyName}"`,
    };
    return descriptions[action] || `Company action: ${action} on "${companyName}"`;
  }

  private getUserDescription(action: string, targetUserName: string): string {
    const descriptions: Record<string, string> = {
      created: `User "${targetUserName}" created`,
      updated: `User "${targetUserName}" updated`,
      deleted: `User "${targetUserName}" deleted`,
      login: `User "${targetUserName}" logged in`,
      logout: `User "${targetUserName}" logged out`,
      role_changed: `Role changed for user "${targetUserName}"`,
    };
    return descriptions[action] || `User action: ${action} on "${targetUserName}"`;
  }
}

// Singleton instance
export const auditTrail = new AuditTrailService();