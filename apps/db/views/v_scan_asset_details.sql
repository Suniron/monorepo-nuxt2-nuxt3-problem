CREATE VIEW public.v_scan_asset_details AS
SELECT
	sa.scan_id,
	sa.asset_id,
	a."name",
	lower(a."name") as lower_name,
	server_ip.os,
	server_ip.hostname,
	server_ip.ip_address,
	aw."language",
	aw.url,
	au.mail
FROM
	public.scan_asset sa
INNER JOIN public.asset a ON
	a.id = sa.asset_id
LEFT JOIN (
	SELECT
		ass.id,
		ass.os,
		ass.hostname,
		array_agg(i.address) AS ip_address
	FROM
		public.asset_server ass
	LEFT JOIN public.ip i ON
		i.asset_server_id = ass.id
	GROUP BY
		ass.id) server_ip ON
	server_ip.id = a.id
LEFT JOIN public.asset_web aw ON
	aw.id = a.id
LEFT JOIN public.asset_user au ON
	au.id = a.id
GROUP BY
	sa.scan_id,
	sa.asset_id,
	a."name",
	server_ip.os,
	server_ip.hostname,
	server_ip.ip_address,
	aw."language",
	aw.url,
	au.mail;