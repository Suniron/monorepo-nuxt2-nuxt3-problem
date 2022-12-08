// @ts-check

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.up = (knex: any) => {
  // If already setup, ignore
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.createTable('setting', (table: any) => {
    table.increments('id').primary()
    table.integer('company_id').references('id').inTable('public.company')
    table.string('key')
    table.string('value')
  });
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex: any) => {
  return knex.schema.dropTable('setting')
}
