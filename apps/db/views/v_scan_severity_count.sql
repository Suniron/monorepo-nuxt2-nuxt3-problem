CREATE VIEW public.v_scan_severity_count AS
SELECT
	sa.scan_id,
	count(va.id) FILTER (
	WHERE va.severity = 'info') AS info,
	count(va.id) FILTER (
	WHERE va.severity = 'low'
	OR c.score < 4) AS low,
	count(va.id) FILTER (
	WHERE va.severity = 'medium'
	OR (c.score >= 4
		AND c.score < 7)) AS medium,
	count(va.id) FILTER (
	WHERE va.severity = 'high'
	OR (c.score >= 7
		AND c.score < 9)) AS high,
	count(va.id) FILTER (
	WHERE va.severity = 'critical'
	OR c.score >= 9) AS critical
FROM
	public.scan_asset sa
LEFT JOIN public.vulnerability_asset va ON
	va.id = sa.vulnerability_asset_id
LEFT JOIN public.cvss c ON
	c.id = va.cvss_id
GROUP BY
	sa.scan_id;