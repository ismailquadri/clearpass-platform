import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('audit_trail', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL');

    table.string('action', 100).notNullable(); // 'login', 'cert_upload', 'cert_verify', 'payment', 'score_update'
    table.string('resource', 100); // 'user', 'certificate', 'company', 'subscription'
    table.uuid('resource_id');

    table.jsonb('old_values'); // Before change
    table.jsonb('new_values'); // After change
    table.text('changes'); // Human-readable description

    table.specificType('ip_address', 'inet');
    table.text('user_agent');
    table.string('status', 50); // 'success', 'failure'
    table.text('error_message');

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('company_id');
    table.index('created_at');
    table.index('action');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audit_trail');
}