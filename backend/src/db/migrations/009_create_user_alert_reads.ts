import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_alert_reads', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('alert_id', 255).notNullable(); // Can be cert ID or generated alert ID
    table.timestamp('read_at').notNullable().defaultTo(knex.fn.now());

    table.unique(['user_id', 'alert_id']);
    table.index('user_id');
    table.index('alert_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_alert_reads');
}