// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await Promise.all([
    knex.raw(
      `ALTER TABLE public.vulnerability_asset ALTER COLUMN cluster_id DROP NOT NULL;`
    ),

    knex.raw(
      `CREATE OR REPLACE VIEW public.v_grouped_remediation
    AS SELECT vuln_asset.cluster_id,
        vuln.remediation,
        ast.company_id,
        count(DISTINCT vuln.id) AS count
       FROM vulnerability_asset vuln_asset
         JOIN vulnerability vuln ON vuln_asset.vulnerability_id = vuln.id
         JOIN asset ast ON ast.id = vuln_asset.asset_id
      WHERE vuln_asset.cluster_id IS NOT NULL
      GROUP BY vuln_asset.cluster_id, vuln.remediation, ast.company_id
      ORDER BY vuln_asset.cluster_id;`
    ),
  ])
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await Promise.all([
    knex.raw(
      `ALTER TABLE public.vulnerability_asset ALTER COLUMN cluster_id SET NOT NULL;`
    ),

    knex.raw(
      `CREATE OR REPLACE VIEW public.v_grouped_remediation
    AS SELECT vuln_asset.cluster_id,
        vuln.remediation,
        ast.company_id,
        count(DISTINCT vuln.id) AS count
       FROM vulnerability_asset vuln_asset
         JOIN vulnerability vuln ON vuln_asset.vulnerability_id = vuln.id
         JOIN asset ast ON ast.id = vuln_asset.asset_id
      GROUP BY vuln_asset.cluster_id, vuln.remediation, ast.company_id
      ORDER BY vuln_asset.cluster_id;`
    ),
  ])
}
