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
  return knex.schema.alterTable('asset_building', (table: any) => {
    table.string('postal_address')
    table.string('phone_number')
  });
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex: any) => {
  return knex.schema.table('asset_building', (table: any) => {
    table.dropColumn('postal_address')
    table.dropColumn('phone_number')
  });
}
