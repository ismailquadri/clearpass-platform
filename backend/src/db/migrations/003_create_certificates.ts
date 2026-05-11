import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('certificates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('company_id')
      .notNullable()
      .references('id')
      .inTable('companies')
      .onDelete('CASCADE');
    table.string('cert_type', 50).notNullable(); // 'nhia', 'pcc', 'nsitf', 'firs', 'bpp', 'itf'
    table.string('cert_number', 100).notNullable();
    table.string('issuing_authority', 255);
    table.date('issued_date');
    table.date('expiry_date');
    table.string('status', 50); // 'active', 'expiring', 'expired', 'pending', 'rejected'
    table.string('verification_method', 50); // 'api', 'manual', 'document', 'batch'
    table.string('document_url', 500); // S3/CloudflareR2 URL
    table.string('document_hash', 255); // SHA-256 for tamper detection
    table.jsonb('verification_data'); // Gov API response data
    table.uuid('verified_by').references('id').inTable('users');
    table.timestamp('verified_at');
    table.date('next_renewal_date');
    table.decimal('renewal_cost', 10, 2);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at');

    table.index('company_id');
    table.index('cert_type');
    table.index('status');
    table.index('expiry_date');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('certificates');
}
