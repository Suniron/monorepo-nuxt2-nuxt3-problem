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
    `CREATE TYPE "ProbeType" AS ENUM ('SERVER', 'VMDK', 'OVA', 'VHD');`
  )
  await knex.raw(
    `UPDATE probe SET probe_type = NULL WHERE probe_type NOT IN (select unnest(enum_range(NULL::"ProbeType"))::text);`
  )
  await knex.raw(
    `ALTER TABLE public.probe ALTER COLUMN probe_type TYPE "ProbeType" USING probe_type::"ProbeType";`
  )
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex: any) {
  await knex.raw(
    `ALTER TABLE public.probe ALTER COLUMN probe_type TYPE varchar;`
  )
  await knex.raw(`DROP type "ProbeType";`)
}
