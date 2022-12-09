
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(
    `ALTER VIEW v_grouped_remediation
      RENAME column count TO count_vuln;`
  )
  await knex.raw(
    `CREATE OR REPLACE VIEW public.v_grouped_remediation AS
      SELECT
      vuln.cluster_id AS cluster_id,
      vuln.remediation AS remediation,
      ast.company_id AS company_id,
      count(DISTINCT vuln.id) AS count_vuln,
      count(DISTINCT ast.id) AS count_asset,
      count(DISTINCT vuln_asset.id) AS count_asset_vuln,
      count(DISTINCT vuln_asset.id) - count(rps.fk_project_id) AS count_asset_vuln_unmanaged -- Not in any remediation project
    FROM
      public.vulnerability_asset vuln_asset
    INNER JOIN public.vulnerability vuln ON
      vuln_asset.vulnerability_id = vuln.id
    INNER JOIN public.asset ast ON
      ast.id = vuln_asset.asset_id
    LEFT JOIN public.remediation_project_scope rps ON
      vuln_asset.id = rps.fk_vulnerability_asset_id
    WHERE vuln.cluster_id IS NOT NULL
    GROUP BY
      (vuln.cluster_id,
      vuln.remediation,
      ast.company_id)
    ORDER BY
      cluster_id ASC`
  )
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw(`DROP VIEW v_grouped_remediation;`)
  await knex.raw(
    `CREATE OR REPLACE VIEW public.v_grouped_remediation AS
      SELECT
      vuln.cluster_id AS cluster_id,
      vuln.remediation AS remediation,
      ast.company_id AS company_id,
      count(DISTINCT vuln.id) AS count
    FROM
      public.vulnerability_asset vuln_asset
    INNER JOIN public.vulnerability vuln ON
      vuln_asset.vulnerability_id = vuln.id
    INNER JOIN public.asset ast ON
      ast.id = vuln_asset.asset_id
    WHERE vuln.cluster_id IS NOT NULL
    GROUP BY
      (vuln.cluster_id,
      vuln.remediation,
      ast.company_id)
    ORDER BY
      cluster_id ASC`
  )
}
