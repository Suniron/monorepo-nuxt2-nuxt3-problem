CREATE VIEW public.v_project_status_workflow AS
SELECT
	psw.id as project_status_workflow_id,
	psw.transition as transition,
	psw.fk_from_status_id AS from_status_id,
	ps."name" AS from_status_name,
	psw.fk_to_status_id AS to_status_id,
	ps2."name" AS to_status_name
FROM
	public.project_status_workflow psw
JOIN public.project_status ps ON
	psw.fk_from_status_id = ps.id
JOIN public.project_status ps2 ON
psw.fk_to_status_id = ps2.id