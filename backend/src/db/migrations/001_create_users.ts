import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100);
    table.string('last_name', 100);
    table.string('phone', 20);
    table.string('role', 50).notNullable(); // 'contractor', 'mda', 'consultant', 'admin'
    table.uuid('company_id');
    table.string('status', 50).defaultTo('active'); // 'active', 'suspended', 'deleted'
    table.boolean('mfa_enabled').defaultTo(false);
    table.string('mfa_secret', 255);
    table.timestamp('last_login');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at');

    table.index('email');
    table.index('company_id');
    table.index('role');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
