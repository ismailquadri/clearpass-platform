import { auditTrail } from './auditTrail';

/**
 * Populate sample audit data for testing
 */
export function populateSampleAuditData() {
  const testUser = {
    id: 'user_123',
    name: 'Amaka Okoro',
    email: 'amaka@techventures.ng',
    role: 'Admin',
  };

  const testUser2 = {
    id: 'user_456',
    name: 'Chidi Obi',
    email: 'chidi@techventures.ng',
    role: 'Editor',
  };

  // Sample certificate actions
  auditTrail.logCertificateAction('created', 'cert_001', 'NHIA Certificate', testUser, {
    before: {},
    after: { certificateNumber: 'NHIA-2024-001', status: 'active' },
  });

  auditTrail.logCertificateAction('verified', 'cert_001', 'NHIA Certificate', testUser, {
    before: { status: 'pending' },
    after: { status: 'active', verifiedBy: 'Amaka Okoro' },
  });

  auditTrail.logCertificateAction('updated', 'cert_002', 'PCC Certificate', testUser2, {
    changes: [
      { field: 'expiryDate', oldValue: '2024-12-31', newValue: '2025-12-31' },
    ],
  });

  auditTrail.logCertificateAction('expired', 'cert_003', 'NSITF Certificate', testUser, {
    metadata: { daysOverdue: 5 },
  });

  // Sample company actions
  auditTrail.logCompanyAction('created', 'company_001', 'TechBuild Nigeria Ltd', testUser, {
    before: {},
    after: { rcNumber: 'RC1234567', status: 'active' },
  });

  auditTrail.logCompanyAction('rc_verified', 'company_001', 'TechBuild Nigeria Ltd', testUser, {
    metadata: { verifiedBy: 'CAC', verificationDate: '2024-01-15' },
  });

  auditTrail.logCompanyAction('bvn_verified', 'company_001', 'TechBuild Nigeria Ltd', testUser, {
    metadata: { bvn: '12345678901', verifiedBy: 'Bank' },
  });

  // Sample user actions
  auditTrail.logUserAction('created', 'user_456', 'Chidi Obi', testUser, {
    before: {},
    after: { role: 'Editor', department: 'Compliance' },
  });

  auditTrail.logUserAction('login', 'user_123', 'Amaka Okoro', testUser, {
    metadata: { loginMethod: 'email', device: 'Chrome on macOS' },
  });

  auditTrail.logUserAction('role_changed', 'user_456', 'Chidi Obi', testUser, {
    changes: [
      { field: 'role', oldValue: 'Viewer', newValue: 'Editor' },
    ],
  });

  // Sample compliance actions
  auditTrail.logComplianceAction('check_run', 'compliance_001', testUser, {
    metadata: {
      score: 85,
      certificatesChecked: 6,
      duration: '2.3s',
    },
  });

  auditTrail.logComplianceAction('score_changed', 'compliance_001', testUser, {
    changes: [
      { field: 'score', oldValue: 78, newValue: 85 },
    ],
    metadata: { reason: 'NHIA certificate verified' },
  });

  // Sample MDA actions
  auditTrail.logMDAAction(
    'verification_performed',
    'verification_001',
    'TechBuild Nigeria Ltd',
    testUser,
    {
      metadata: {
        rcNumber: 'RC1234567',
        result: 'compliant',
        checkedBy: 'Federal Ministry of Works',
      },
    }
  );

  auditTrail.logMDAAction(
    'prequalification_created',
    'prequal_001',
    'Infrastructure Project Q2 2026',
    testUser,
    {
      metadata: {
        tenderNumber: 'FGN/MDA/2026/045',
        vendorsCount: 5,
      },
    }
  );

  // Sample security events
  auditTrail.logSecurityEvent('api.rate_limit_exceeded', 'API rate limit exceeded for user_456', testUser2, {
    metadata: {
      endpoint: '/api/certificates',
      requestsPerMinute: 150,
      limit: 100,
    },
  });

  // Add some older entries for testing date filtering
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 15);

  // Manually add an entry with a past date
  const pastEntry = {
    id: `audit_${pastDate.getTime()}_test`,
    timestamp: pastDate.toISOString(),
    actionType: 'certificate.created' as const,
    entityType: 'certificate' as const,
    entityId: 'cert_004',
    userId: testUser.id,
    userName: testUser.name,
    userEmail: testUser.email,
    userRole: testUser.role,
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    description: 'Certificate "FIRS TCC" created (15 days ago)',
    severity: 'info' as const,
    category: 'compliance' as const,
  };

  // Store it directly in localStorage
  const existingEntries = JSON.parse(localStorage.getItem('clearpass_audit_trail') || '[]');
  existingEntries.push(pastEntry);
  localStorage.setItem('clearpass_audit_trail', JSON.stringify(existingEntries));

  console.log('Sample audit data populated successfully');
}
