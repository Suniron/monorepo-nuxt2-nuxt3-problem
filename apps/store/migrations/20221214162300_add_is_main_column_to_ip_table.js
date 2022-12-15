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

  // Add new "is_main" boolean column to "ip" table
  await knex.schema.table('ip', (table) => {
    table.boolean('is_main').defaultTo(false)
  })

  // Set "is_main" to true for the first IP of each existing asset server
  await knex.raw(`
    UPDATE ip 
    SET is_main = TRUE 
    WHERE id IN (SELECT MIN(id) AS id FROM ip GROUP BY asset_server_id)
    `)
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
