
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  // If already setup, ignore
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  await knex.schema.alterTable('company', (table) => {
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
exports.down = async (knex) => {
  await knex.raw(
    'ALTER TABLE "company" DROP COLUMN fk_phishing_scenario_domain_id;'
  )
}
