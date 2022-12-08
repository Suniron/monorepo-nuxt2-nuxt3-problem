// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(
    'ALTER TABLE "asset" DROP CONSTRAINT IF EXISTS "asset_name_type_key";'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.asset ADD CONSTRAINT asset_name_type_key UNIQUE (name, type, company_id);'
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
  await knex.raw(`
    DELETE FROM asset
    WHERE id IN (
      SELECT id FROM (
        SELECT id, row_number() OVER (PARTITION BY name, type ORDER BY id asc) AS rn FROM asset
      ) t WHERE rn > 1
    );
  `)
  await knex.raw(
    'ALTER TABLE ONLY public.asset ADD CONSTRAINT asset_name_type_key UNIQUE (name, type);'
  )
}
