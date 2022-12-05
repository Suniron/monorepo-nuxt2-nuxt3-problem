CREATE VIEW public.v_asset_child AS
  SELECT
	rel.id as id,
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
FROM
	public.relation AS rel
INNER JOIN public.asset parent_asset ON
	rel.to_asset_id = parent_asset.id
INNER JOIN public.asset child_asset ON
	rel.from_asset_id = child_asset.id
LEFT JOIN public.group_asset parent_group ON
	parent_asset.id = parent_group.asset_id
LEFT JOIN public.group_asset child_group ON
	child_asset.id = child_group.asset_id
WHERE
	rel.type = 'BELONGS_TO'
	OR (rel.type::text = 'LOCATED_TO'::text AND parent_asset."type" = 'BUILDING');
