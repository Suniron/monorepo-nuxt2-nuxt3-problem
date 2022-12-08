// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex: any) {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(
    `ALTER TABLE asset ADD COLUMN IF NOT EXISTS risk_score character varying;`
  )
  await knex.raw(
    `ALTER TABLE asset ADD COLUMN IF NOT EXISTS exposure_level character varying;`
  )
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex: any) {
  await knex.raw('ALTER TABLE asset DROP COLUMN IF EXISTS risk_score;')
  await knex.raw('ALTER TABLE asset DROP COLUMN IF EXISTS exposure_level;')
}
