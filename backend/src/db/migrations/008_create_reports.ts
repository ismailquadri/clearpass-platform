import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reports', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE');

    table.string('report_type', 50); // 'compliance', 'audit', 'pre_qual'
    table.uuid('generated_by').references('id').inTable('users');

    table.string('pdf_url', 500); // S3/CloudflareR2 URL
    table.string('pdf_hash', 255);

    table.specificType('included_certificates', 'text[]'); // Array of cert types
    table.integer('compliance_score');
    table.timestamp('generated_at').notNullable();
    table.timestamp('valid_until'); // Expiry for bid submission

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index('company_id');
    table.index('report_type');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reports');
}