// @ts-check

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.up = (knex) => {
  // If already setup, ignore
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  return knex.schema.createTable('setting', (table) => {
    table.increments('id').primary()
    table.integer('company_id').references('id').inTable('public.company')
    table.string('key')
    table.string('value')
  })
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex) => {
  return knex.schema.dropTable('setting')
}
