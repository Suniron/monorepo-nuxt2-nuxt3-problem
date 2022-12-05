CREATE OR REPLACE
VIEW public.v_remediation_project_details
AS
SELECT
	rp.id AS project_id,
	rp.name AS project_name,
	rp.description AS project_description,
	u.id AS owner_id,
	u.username AS owner_name,
	array_agg(CASE WHEN u2.id IS NULL THEN NULL ELSE jsonb_build_object('user_id', u2.id, 'username', u2.username)END) AS assignees,
	pp.name AS priority,
	ps.name AS status,
	ps.id AS status_id,
	ps.weight AS status_weight,
	rp.creation_date,
	rp.start_date,
	rp.due_date,
	EXTRACT(epoch
FROM
	rp.due_date - now()) < 0::NUMERIC
	AND (ps.name::TEXT <> ALL (ARRAY['completed'::CHARACTER VARYING,
	'canceled'::CHARACTER VARYING]::TEXT[])) AS is_overdue
FROM
	public.remediation_project rp
JOIN public."user" u ON
	u.id = rp.fk_owner
LEFT JOIN public.remediation_project_assignee rpa ON
	rpa.fk_project_id = rp.id
LEFT JOIN public."user" u2 ON
	u2.id = rpa.fk_user_id
JOIN public.project_priority pp ON
	pp.id = rp.fk_priority_id
JOIN public.remediation_project_status_history psh ON
	psh.fk_project_id = rp.id
	AND psh.end_date IS NULL
JOIN public.project_status ps ON
	ps.id = psh.fk_status_id
GROUP BY
	rp.id,
	u.id,
	pp.id,
	ps.id;