

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
  return knex.schema.alterTable('ip', (table) => {
    table.string('type')
    table.string('operational_status')
  })
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex) => {
  return knex.schema.table('asset_server', (table) => {
    table.dropColumn('os_build')
    table.dropColumn('operational_status')
  })
}
