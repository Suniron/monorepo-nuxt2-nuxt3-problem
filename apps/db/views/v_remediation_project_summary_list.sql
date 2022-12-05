CREATE view public.v_remediation_project_summary_list AS
SELECT
	rmp_summary.project_id,
	rmp_summary.project_name,
	rmp_summary.owner_id,
	rmp_summary.owner_name,
	rmp_summary.priority,
	rmp_summary.priority_weight,
	CASE
		WHEN is_overdue THEN 'overdue'
		ELSE rmp_summary.status
	END AS status,
	CASE
		WHEN is_overdue THEN rmp_summary.max_status_weight + 1
		ELSE rmp_summary.status_weight
	END AS status_weight,
	rmp_summary.due_date,
	rmp_summary.is_overdue,
	rmp_summary.company_id
FROM
	(
	SELECT
		rmp.id AS project_id,
		rmp.name AS project_name,
		rmp.fk_owner AS owner_id,
		usr.username AS owner_name,
		ppr.name AS priority,
		ppr.weight AS priority_weight,
		pst.name AS status,
		pst.weight AS status_weight,
		rmp.due_date AS due_date,
		EXTRACT(epoch
	FROM
		rmp.due_date - now()) < 0
		AND pst.name NOT IN ('completed', 'canceled') AS is_overdue,
		(SELECT MAX(weight) FROM public.project_status) AS max_status_weight,
		rmp.fk_company_id AS company_id
	FROM
		public.remediation_project rmp
	INNER JOIN public.user usr ON
		rmp.fk_owner = usr.id
	INNER JOIN public.project_priority ppr ON
		rmp.fk_priority_id = ppr.id
	INNER JOIN public.remediation_project_status_history psh ON
		rmp.id = psh.fk_project_id
		AND psh.end_date IS NULL
	INNER JOIN public.project_status pst ON
		pst.id = psh.fk_status_id
	ORDER BY
		rmp.due_date) AS rmp_summary;