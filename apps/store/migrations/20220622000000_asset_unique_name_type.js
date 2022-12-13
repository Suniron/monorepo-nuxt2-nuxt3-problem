
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(
    'ALTER TABLE ONLY public.asset ADD CONSTRAINT asset_name_type_key UNIQUE (name, type);'
  )
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw(
    'ALTER TABLE "asset" DROP CONSTRAINT IF EXISTS "asset_name_type_key";'
  )
}
