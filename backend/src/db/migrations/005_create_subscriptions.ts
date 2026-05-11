import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('subscriptions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('company_id')
      .notNullable()
      .references('id')
      .inTable('companies')
      .onDelete('CASCADE');

    // Subscription details
    table.string('tier', 50).notNullable(); // 'starter', 'business', 'enterprise'
    table.decimal('monthly_amount', 10, 2);
    table.decimal('annual_amount', 10, 2);
    table.string('billing_cycle', 50); // 'monthly', 'annual'

    // Payment info
    table.string('paystack_customer_code', 100); // For recurring charges
    table.string('paystack_authorization_code', 100); // For auto-renew
    table.string('last_payment_reference', 100);
    table.timestamp('last_payment_date');
    table.timestamp('next_billing_date');

    // Status
    table.string('status', 50).defaultTo('active'); // 'active', 'paused', 'cancelled', 'past_due'
    table.timestamp('started_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('ended_at');

    // Features (based on tier)
    table.integer('max_profiles'); // Number of company profiles
    table.integer('max_bulk_verifications').defaultTo(100); // Per month
    table.boolean('api_access').defaultTo(false);
    table.integer('team_members').defaultTo(1);
    table.boolean('white_label').defaultTo(false);

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.index('company_id');
    table.index('status');
    table.index('next_billing_date');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('subscriptions');
}
