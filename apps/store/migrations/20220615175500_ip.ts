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
  return knex.schema.alterTable('ip', (table: any) => {
    table.string('type')
    table.string('operational_status')
  });
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex: any) => {
  return knex.schema.table('asset_server', (table: any) => {
    table.dropColumn('os_build')
    table.dropColumn('operational_status')
  });
}
