
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  // Deleting potential duplicate rows from asset_mission
  await knex.raw(
    `DELETE
      FROM asset_mission am 
      WHERE ctid IN (
        SELECT ctid FROM (
          SELECT id, ctid, row_number() OVER (PARTITION BY id) AS rn FROM asset_mission
        ) t WHERE rn > 1
      );`
  )

  // Deleting potential duplicate rows from tag_asset
  await knex.raw(
    `DELETE
      FROM tag_asset ta 
      WHERE ctid IN (
        SELECT ctid FROM (
          SELECT asset_id, tag_id, ctid, row_number() OVER (PARTITION BY asset_id, tag_id) AS rn FROM tag_asset
        ) t WHERE rn > 1
      );`
  )

  // ADD PRIMARY KEY CONSTRAINT to asset_mission and tag_asset tables
  await knex.raw(
    `
    ALTER TABLE ONLY public.asset_mission ADD CONSTRAINT asset_mission_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY public.tag_asset ADD CONSTRAINT tag_asset_pkey PRIMARY KEY (asset_id, tag_id);
    `
  )
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw(
    `
    ALTER TABLE public.asset_mission drop CONSTRAINT IF EXISTS "asset_mission_pkey";
    ALTER TABLE public.tag_asset drop CONSTRAINT IF EXISTS "tag_asset_pkey";
    `
  )
}
