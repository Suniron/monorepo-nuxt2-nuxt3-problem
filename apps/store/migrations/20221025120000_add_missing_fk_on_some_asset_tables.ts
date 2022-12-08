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
    `ALTER TABLE public.asset_mission drop CONSTRAINT IF EXISTS "fkey_asset_mission";`
  )

  await knex.raw(
    `ALTER TABLE asset_mission ADD COLUMN IF NOT EXISTS type character varying default 'MISSION' check(type = 'MISSION');`
  )

  await knex.raw(
    `
    ALTER TABLE ONLY public.asset_building ADD CONSTRAINT asset_building_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;
    ALTER TABLE ONLY public.asset_document ADD CONSTRAINT asset_document_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;
    ALTER TABLE ONLY public.asset_user ADD CONSTRAINT asset_user_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;
    ALTER TABLE ONLY public.asset_mission ADD CONSTRAINT asset_mission_asset_id_fkey FOREIGN KEY (id, type) REFERENCES public.asset(id, type) ON DELETE CASCADE;
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
      ALTER TABLE public.asset_building drop CONSTRAINT IF EXISTS "asset_building_asset_id_fkey";
      ALTER TABLE public.asset_document drop CONSTRAINT IF EXISTS "asset_document_asset_id_fkey";
      ALTER TABLE public.asset_user drop CONSTRAINT IF EXISTS "asset_user_asset_id_fkey";
      ALTER TABLE public.asset_mission drop CONSTRAINT IF EXISTS "asset_mission_asset_id_fkey";
      `
  )

  await knex.raw('ALTER TABLE asset_mission DROP COLUMN IF EXISTS type;')

  await knex.raw(
    `ALTER TABLE ONLY public.asset_mission ADD CONSTRAINT fkey_asset_mission FOREIGN KEY (id) REFERENCES public.asset(id) ON DELETE CASCADE;`
  )
}
