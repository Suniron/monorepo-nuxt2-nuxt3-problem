
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(`
  CREATE OR REPLACE VIEW public.v_scan_asset_details AS
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
  `)

  await knex.raw(`
  CREATE OR REPLACE VIEW public.v_scan_severity_count AS
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
  `)
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw('DROP VIEW IF EXISTS public.v_scan_asset_details;')
  await knex.raw('DROP VIEW IF EXISTS public.v_scan_severity_count;')
}
