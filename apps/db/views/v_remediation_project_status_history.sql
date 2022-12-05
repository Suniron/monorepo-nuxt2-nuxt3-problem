CREATE VIEW public.v_remediation_project_status_history AS
SELECT
	psh.fk_project_id AS project_id,
	psh.fk_user_id AS user_id,
	u.username AS user_name,
	psh.start_date AS from_date,
	ps2."name" AS from_status_name,
	ps."name" AS to_status_name,
	crp."comment" AS comment
FROM
	public.remediation_project_status_history psh
INNER JOIN public.user u ON
	u.id = psh.fk_user_id
LEFT JOIN public.remediation_project_status_history psh2 ON
	psh.fk_project_id = psh2.fk_project_id
	AND psh.start_date = psh2.end_date
LEFT JOIN public.project_status ps ON
	ps.id = psh.fk_status_id
LEFT JOIN public.project_status ps2 ON
	ps2.id = psh2.fk_status_id
LEFT JOIN public.comment_remediation_project crp ON
	crp.fk_remediation_project_status_history_id = psh.id
ORDER BY
	from_date DESC