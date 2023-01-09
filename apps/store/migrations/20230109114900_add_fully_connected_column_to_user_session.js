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

  // Add new "fullyConnectedAt" timestamp column to "user_session" table
  await knex.raw('ALTER TABLE user_session ADD fullyConnectedAt timestamptz NULL;')
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex) => {
  return knex.schema.table('user_session', (table) => {
    table.dropColumn('fullyConnectedAt')
  })
}
