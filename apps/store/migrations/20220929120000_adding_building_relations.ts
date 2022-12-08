// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(`
    CREATE OR REPLACE VIEW public.v_asset_child
    AS SELECT rel.id,
      parent_asset.id AS parent_id,
      parent_asset.name AS parent_name,
      parent_asset.type AS parent_type,
      child_asset.id AS child_id,
      child_asset.name AS child_name,
      child_asset.type AS child_type,
      parent_asset.company_id AS parent_company_id,
      child_asset.company_id AS child_company_id,
      parent_group.group_id AS parent_group_id,
      child_group.group_id AS child_group_id
     FROM relation rel
       JOIN asset parent_asset ON rel.to_asset_id = parent_asset.id
       JOIN asset child_asset ON rel.from_asset_id = child_asset.id
       LEFT JOIN group_asset parent_group ON parent_asset.id = parent_group.asset_id
       LEFT JOIN group_asset child_group ON child_asset.id = child_group.asset_id
    WHERE rel.type::text = 'BELONGS_TO'::text
      OR (rel.type::text = 'LOCATED_TO'::text AND parent_asset."type" = 'BUILDING');
  `)
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex: any) => {
  await knex.raw(`
    CREATE OR REPLACE VIEW public.v_asset_child
    AS SELECT rel.id,
      parent_asset.id AS parent_id,
      parent_asset.name AS parent_name,
      parent_asset.type AS parent_type,
      child_asset.id AS child_id,
      child_asset.name AS child_name,
      child_asset.type AS child_type,
      parent_asset.company_id AS parent_company_id,
      child_asset.company_id AS child_company_id,
      parent_group.group_id AS parent_group_id,
      child_group.group_id AS child_group_id
    FROM relation rel
      JOIN asset parent_asset ON rel.to_asset_id = parent_asset.id
      JOIN asset child_asset ON rel.from_asset_id = child_asset.id
      LEFT JOIN group_asset parent_group ON parent_asset.id = parent_group.asset_id
      LEFT JOIN group_asset child_group ON child_asset.id = child_group.asset_id
    WHERE rel.type::text = 'BELONGS_TO'::text;
  `)
}
