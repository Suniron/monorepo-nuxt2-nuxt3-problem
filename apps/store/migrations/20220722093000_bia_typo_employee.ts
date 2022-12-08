// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(
    `UPDATE business_impact
    SET business_impact_name='Employee Social Link'
    WHERE business_impact_name='Employe Social Link';`
  )
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex: any) => {
  await knex.raw(
    `UPDATE business_impact
    SET business_impact_name='Employe Social Link'
    WHERE business_impact_name='Employee Social Link';`
  )
}
