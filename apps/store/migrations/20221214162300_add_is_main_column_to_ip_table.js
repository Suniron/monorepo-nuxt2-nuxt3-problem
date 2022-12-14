// @ts-check

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.up = (knex) => {
  // If already setup, ignore
  if (knex.userParams.isSetup)
    return Promise.resolve()

  return knex.schema.table('ip', (table) => {
    table.boolean('is_main').defaultTo(false)
  })
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex) => {
  return knex.schema.table('ip', (table) => {
    table.dropColumn('is_main')
  })
}
