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
  return knex.schema.table('company', (table: any) => {
    table.binary('base64_logo')
  });
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = (knex: any) => {
  return knex.schema.table('company', (table: any) => {
    table.dropColumn('base64_logo')
  });
}
