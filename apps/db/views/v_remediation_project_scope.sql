CREATE VIEW public.v_remediation_project_scope AS
SELECT
	rps.fk_project_id AS project_id,
	rps.id AS project_scope_id,
	rps.fk_vulnerability_asset_id AS vulnerability_asset_id,
	a.id AS asset_id,
	a.type AS asset_type,
	CASE
		WHEN va.id IS NOT NULL 
	THEN a.name
		ELSE rps.deleted_asset_name
	END AS asset_name,
	v.id AS vulnerability_id,
	CASE
		WHEN va.id IS NOT NULL 
	THEN v.name
		ELSE rps.deleted_vulnerability_name
	END AS vulnerability_name,
	va.severity AS severity,
	v.remediation AS remediation,
	rps.is_done AS is_done
FROM
	public.remediation_project_scope rps
LEFT JOIN public.vulnerability_asset va ON
	rps.fk_vulnerability_asset_id = va.id
LEFT JOIN public.asset a ON
	va.asset_id = a.id
LEFT JOIN public.vulnerability v ON
	va.vulnerability_id = v.id