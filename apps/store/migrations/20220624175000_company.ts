// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex: any) => {
  // If already setup, ignore
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  await knex.schema.alterTable('company', (table: any) => {
    table
      .integer('fk_phishing_scenario_domain_id')
      .references('id')
      .inTable('public.phishing_scenario_domain')
  })
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = async (knex: any) => {
  await knex.raw(
    'ALTER TABLE "company" DROP COLUMN fk_phishing_scenario_domain_id;'
  )
}
