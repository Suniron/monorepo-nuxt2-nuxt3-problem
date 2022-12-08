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
    `
    ALTER TABLE public.asset DROP CONSTRAINT IF EXISTS "asset_group_id_fkey";
    ALTER TABLE public.asset DROP COLUMN IF EXISTS group_id;
    `
  )
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex: any) => {
  await knex.raw(
    `
    ALTER TABLE asset ADD COLUMN IF NOT EXISTS group_id integer;
    ALTER TABLE ONLY public.asset
      ADD CONSTRAINT asset_group_id_fkey FOREIGN KEY (group_id) REFERENCES public."group"(id) ON DELETE CASCADE;
    `
  )
}
