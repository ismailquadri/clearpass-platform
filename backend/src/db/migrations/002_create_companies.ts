import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('companies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('rc_number', 50).unique(); // CAC Registration Number
    table.string('bvn', 20); // Bank Verification Number (hashed)
    table.string('email', 255);
    table.string('phone', 20);
    table.text('address');
    table.string('city', 100);
    table.string('state', 100);
    table.string('postal_code', 20);
    table.string('country', 100).defaultTo('Nigeria');
    table.string('company_size', 50); // 'startup', 'small', 'medium', 'large', 'enterprise'
    table.string('industry', 100);
    table.string('website', 255);
    table.string('subscription_tier', 50).defaultTo('starter'); // 'starter', 'business', 'enterprise'
    table.string('status', 50).defaultTo('active'); // 'active', 'suspended', 'deleted'
    table.boolean('verified').defaultTo(false);
    table.timestamp('verification_date');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at');

    table.index('rc_number');
    table.index('subscription_tier');
    table.index('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('companies');
}
