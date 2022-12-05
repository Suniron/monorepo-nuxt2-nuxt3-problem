CREATE VIEW public.v_remediation_project_comment AS
SELECT
	crp.fk_remediation_project_id AS project_id,
	crp.id AS comment_id,
	crp.created_at AS from_date,
	u.id AS user_id,
	u.username AS user_name,
	crp.COMMENT,
	ps2."name" AS from_status_name,
	ps."name" AS to_status_name
FROM
	public.comment_remediation_project crp
INNER JOIN public."user" u ON
	u.id = crp.fk_user_id
LEFT JOIN public.remediation_project_status_history psh ON
	psh.id = crp.fk_remediation_project_status_history_id
LEFT JOIN public.remediation_project_status_history psh2 ON
	psh.fk_project_id = psh2.fk_project_id
	AND psh.start_date = psh2.end_date
LEFT JOIN public.project_status ps ON
	ps.id = psh.fk_status_id
LEFT JOIN public.project_status ps2 ON
	ps2.id = psh2.fk_status_id
ORDER BY
from_date DESC