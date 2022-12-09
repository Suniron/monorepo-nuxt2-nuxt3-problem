
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  // If already setup, ignore
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  await knex.schema.createTable('phishing_scenario_domain', (table) => {
    table.increments('id').primary()
    table.string('name')
  })
}

/**
 *
 * @param {import("knex").Knex} knex
 * @returns
 */
exports.down = async (knex) => {
  await knex.schema.dropTable('phishing_scenario_domain')
}
