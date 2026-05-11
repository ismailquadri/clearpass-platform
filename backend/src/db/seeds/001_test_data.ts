import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Clean existing data
  await knex('audit_trail').del();
  await knex('user_alert_reads').del();
  await knex('government_api_logs').del();
  await knex('reports').del();
  await knex('compliance_scores').del();
  await knex('certificates').del();
  await knex('subscriptions').del();
  await knex('users').del();
  await knex('companies').del();

  // Create test companies
  const companies = await knex('companies')
    .insert([
      {
        name: 'TechBuild Nigeria Ltd',
        rc_number: 'RC1234567',
        email: 'info@techbuild.com.ng',
        phone: '+234 8012345678',
        address: '123 Ademola Adetokunbo Crescent, Abuja',
        city: 'Abuja',
        state: 'FCT',
        company_size: 'medium',
        industry: 'Technology',
        subscription_tier: 'business',
        status: 'active',
        verified: true,
        verification_date: new Date(),
      },
      {
        name: 'Construction Masters Ltd',
        rc_number: 'RC7654321',
        email: 'info@constructionmasters.com',
        phone: '+234 8023456789',
        address: '45 Awolowo Road, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        company_size: 'large',
        industry: 'Construction',
        subscription_tier: 'enterprise',
        status: 'active',
        verified: true,
        verification_date: new Date(),
      },
      {
        name: 'StartUp Hub Nigeria',
        rc_number: 'RC9876543',
        email: 'hello@startuphub.ng',
        phone: '+234 8034567890',
        address: '78 Herbert Macaulay Way, Yaba',
        city: 'Lagos',
        state: 'Lagos',
        company_size: 'small',
        industry: 'Technology',
        subscription_tier: 'starter',
        status: 'active',
        verified: false,
      },
    ])
    .returning('*');

  // Create test users
  const passwordHash = await bcrypt.hash('Password123!', 12);

  const users = await knex('users')
    .insert([
      {
        email: 'amaka@techbuild.com.ng',
        password_hash: passwordHash,
        first_name: 'Amaka',
        last_name: 'Okoro',
        phone: '+234 8012345678',
        role: 'contractor',
        company_id: companies[0].id,
        status: 'active',
      },
      {
        email: 'chinedu@constructionmasters.com',
        password_hash: passwordHash,
        first_name: 'Chinedu',
        last_name: 'Adeyemi',
        phone: '+234 8023456789',
        role: 'contractor',
        company_id: companies[1].id,
        status: 'active',
      },
      {
        email: 'tunde@startuphub.ng',
        password_hash: passwordHash,
        first_name: 'Tunde',
        last_name: 'Bakare',
        phone: '+234 8034567890',
        role: 'contractor',
        company_id: companies[2].id,
        status: 'active',
      },
      {
        email: 'mda.officer@gov.ng',
        password_hash: passwordHash,
        first_name: 'Fatima',
        last_name: 'Mohammed',
        phone: '+234 8045678901',
        role: 'mda',
        company_id: null,
        status: 'active',
      },
      {
        email: 'consultant@partner.ng',
        password_hash: passwordHash,
        first_name: 'Emeka',
        last_name: 'Okafor',
        phone: '+234 8056789012',
        role: 'consultant',
        company_id: null,
        status: 'active',
      },
    ])
    .returning('*');

  // Create subscriptions
  await knex('subscriptions').insert([
    {
      company_id: companies[0].id,
      tier: 'business',
      monthly_amount: 700000,
      annual_amount: 6000000,
      billing_cycle: 'monthly',
      status: 'active',
      started_at: new Date(),
      max_profiles: 5,
      max_bulk_verifications: 100,
      api_access: true,
      team_members: 5,
      white_label: false,
    },
    {
      company_id: companies[1].id,
      tier: 'enterprise',
      monthly_amount: 1800000,
      annual_amount: 20000000,
      billing_cycle: 'annual',
      status: 'active',
      started_at: new Date(),
      max_profiles: 20,
      max_bulk_verifications: 500,
      api_access: true,
      team_members: 20,
      white_label: true,
    },
    {
      company_id: companies[2].id,
      tier: 'starter',
      monthly_amount: 0,
      annual_amount: 0,
      billing_cycle: 'monthly',
      status: 'active',
      started_at: new Date(),
      max_profiles: 1,
      max_bulk_verifications: 10,
      api_access: false,
      team_members: 1,
      white_label: false,
    },
  ]);

  // Create certificates for TechBuild (good compliance)
  const today = new Date();
  const futureDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

  const techbuildCerts = await knex('certificates')
    .insert([
      {
        company_id: companies[0].id,
        cert_type: 'nhia',
        cert_number: 'NHIA/2024/001234',
        issuing_authority: 'National Health Insurance Authority',
        issued_date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        expiry_date: futureDate,
        status: 'active',
        verification_method: 'api',
        document_url: 'https://example.com/docs/nhia.pdf',
      },
      {
        company_id: companies[0].id,
        cert_type: 'pcc',
        cert_number: 'PCC/2024/005678',
        issuing_authority: 'Nigeria Police Force',
        issued_date: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
        expiry_date: futureDate,
        status: 'active',
        verification_method: 'manual',
        document_url: 'https://example.com/docs/pcc.pdf',
      },
      {
        company_id: companies[0].id,
        cert_type: 'nsitf',
        cert_number: 'NSITF/2024/009012',
        issuing_authority: 'Nigeria Social Insurance Trust Fund',
        issued_date: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
        expiry_date: futureDate,
        status: 'active',
        verification_method: 'api',
        document_url: 'https://example.com/docs/nsitf.pdf',
      },
      {
        company_id: companies[0].id,
        cert_type: 'firs',
        cert_number: 'FIRS/2024/013456',
        issuing_authority: 'Federal Inland Revenue Service',
        issued_date: new Date(today.getTime() - 120 * 24 * 60 * 60 * 1000),
        expiry_date: futureDate,
        status: 'active',
        verification_method: 'api',
        document_url: 'https://example.com/docs/firs.pdf',
      },
    ])
    .returning('*');

  // Create certificates for Construction Masters (some expiring)
  const expiringSoon = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now

  await knex('certificates')
    .insert([
      {
        company_id: companies[1].id,
        cert_type: 'nhia',
        cert_number: 'NHIA/2024/002345',
        issuing_authority: 'National Health Insurance Authority',
        issued_date: new Date(today.getTime() - 350 * 24 * 60 * 60 * 1000),
        expiry_date: expiringSoon,
        status: 'expiring-critical',
        verification_method: 'api',
        document_url: 'https://example.com/docs/nhia2.pdf',
      },
      {
        company_id: companies[1].id,
        cert_type: 'pcc',
        cert_number: 'PCC/2024/006789',
        issuing_authority: 'Nigeria Police Force',
        issued_date: new Date(today.getTime() - 300 * 24 * 60 * 60 * 1000),
        expiry_date: futureDate,
        status: 'active',
        verification_method: 'manual',
        document_url: 'https://example.com/docs/pcc2.pdf',
      },
      {
        company_id: companies[1].id,
        cert_type: 'nsitf',
        cert_number: 'NSITF/2024/010123',
        issuing_authority: 'Nigeria Social Insurance Trust Fund',
        issued_date: new Date(today.getTime() - 250 * 24 * 60 * 60 * 1000),
        expiry_date: futureDate,
        status: 'active',
        verification_method: 'api',
        document_url: 'https://example.com/docs/nsitf2.pdf',
      },
    ])
    .returning('*');

  // Create compliance scores
  await knex('compliance_scores').insert([
    {
      company_id: companies[0].id,
      component_a: 33, // 4/6 certs = 67% of 50
      component_b: 30, // All fresh = 100% of 30
      component_c: 15, // 75% API verified = 75% of 20
      total_score: 78,
      procurement_ready: false,
      last_calculated: new Date(),
      calculation_details: {
        total_required: 6,
        total_present: 4,
        coverage_percentage: 67,
        active_certificates: 4,
        expiring_certificates: 0,
        api_verified: 3,
        nhia_active: true,
      },
    },
    {
      company_id: companies[1].id,
      component_a: 25, // 3/6 certs = 50% of 50
      component_b: 20, // 67% fresh = 67% of 30
      component_c: 13, // 67% API verified = 67% of 20
      total_score: 58,
      procurement_ready: false,
      last_calculated: new Date(),
      calculation_details: {
        total_required: 6,
        total_present: 3,
        coverage_percentage: 50,
        active_certificates: 2,
        expiring_certificates: 1,
        api_verified: 2,
        nhia_active: false,
      },
    },
    {
      company_id: companies[2].id,
      component_a: 0, // 0/6 certs = 0% of 50
      component_b: 0, // 0% fresh = 0% of 30
      component_c: 0, // 0% API verified = 0% of 20
      total_score: 0,
      procurement_ready: false,
      last_calculated: new Date(),
      calculation_details: {
        total_required: 6,
        total_present: 0,
        coverage_percentage: 0,
        active_certificates: 0,
        expiring_certificates: 0,
        api_verified: 0,
        nhia_active: false,
      },
    },
  ]);

  // Create audit trail entries
  await knex('audit_trail').insert([
    {
      user_id: users[0].id,
      company_id: companies[0].id,
      action: 'register',
      resource: 'user',
      resource_id: users[0].id,
      changes: 'User registered',
      status: 'success',
    },
    {
      user_id: users[0].id,
      company_id: companies[0].id,
      action: 'cert_upload',
      resource: 'certificate',
      resource_id: techbuildCerts[0].id,
      changes: 'NHIA certificate uploaded',
      status: 'success',
    },
    {
      user_id: users[0].id,
      company_id: companies[0].id,
      action: 'login',
      resource: 'user',
      resource_id: users[0].id,
      changes: 'User logged in',
      status: 'success',
    },
  ]);

  console.log('✅ Seed data completed successfully');
}
