// @ts-check

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.up = async (knex) => {
  // If already setup, ignore
  if (knex.userParams.isSetup)
    return Promise.resolve()

  // Add new "fullyConnected" boolean column to "user_session" table
  await knex.schema.table('user_session', (table) => {
    table.boolean('fullyConnected').defaultTo(false)
  })
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex) => {
  return knex.schema.table('user_session', (table) => {
    table.dropColumn('fullyConnected')
  })
}
