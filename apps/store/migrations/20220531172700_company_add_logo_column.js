

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
  return knex.schema.table('company', (table) => {
    table.binary('base64_logo')
  })
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex) => {
  return knex.schema.table('company', (table) => {
    table.dropColumn('base64_logo')
  })
}
