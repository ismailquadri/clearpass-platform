import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('government_api_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('certificate_id').references('id').inTable('certificates').onDelete('SET NULL');

    table.string('api_endpoint', 255); // 'nhia', 'cac', 'firs', etc.
    table.string('request_type', 50); // 'verification', 'lookup', 'batch'
    table.jsonb('request_payload');

    table.integer('response_status'); // HTTP status code
    table.jsonb('response_body');
    table.integer('processing_time_ms'); // Latency
    table.boolean('success');
    table.text('error_message');

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index('certificate_id');
    table.index('api_endpoint');
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('government_api_logs');
}