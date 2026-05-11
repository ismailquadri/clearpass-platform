import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('compliance_scores', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').notNullable().unique().references('id').inTable('companies').onDelete('CASCADE');

    // Components (PRD specified)
    table.integer('component_a').defaultTo(0); // Coverage (0-50): % of required certs present
    table.integer('component_b').defaultTo(0); // Freshness (0-30): % of certs not expiring soon
    table.integer('component_c').defaultTo(0); // Quality (0-20): % of certs verified via API

    table.integer('total_score').defaultTo(0); // Sum of components (0-100)
    table.boolean('procurement_ready').defaultTo(false); // score >= 80 AND nhia active

    table.timestamp('last_calculated');
    table.jsonb('calculation_details'); // Detailed breakdown of score

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.index('company_id');
    table.index('total_score');
    table.index('procurement_ready');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('compliance_scores');
}