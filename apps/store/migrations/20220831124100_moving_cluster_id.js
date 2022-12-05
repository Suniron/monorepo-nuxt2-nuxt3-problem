// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(`ALTER TABLE vulnerability ADD COLUMN cluster_id integer;`)

  // UPDATE TABLES
  const remediationClusters = await knex.raw(`select
              array_agg(vuln.id) as vuln_ids
            from
              vulnerability as vuln
            group by
              vuln.remediation`)

  const updateQueries = remediationClusters.rows.reduce(
    (queries, row, index) => {
      const { vuln_ids } = row
      return (queries += `
    update vulnerability
    set cluster_id = ${index + 1}
    where id in (${vuln_ids});
    `)
    },
    ''
  )

  // Run all update queries in one time:
  await knex.raw(updateQueries)

  // v_grouped_remediation
  await knex.raw(
    `CREATE OR REPLACE VIEW public.v_grouped_remediation AS
      SELECT
      vuln.cluster_id AS cluster_id,
      vuln.remediation AS remediation,
      ast.company_id AS company_id,
      count(DISTINCT vuln.id)
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
      cluster_id ASC;`
  )
  await knex.raw('ALTER TABLE vulnerability_asset DROP COLUMN cluster_id;')
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.raw(
    `ALTER TABLE vulnerability_asset ADD COLUMN cluster_id integer;`
  )
  // UPDATE TABLES
  const remediationClusters = await knex.raw(`select
              array_agg(vuln.id) as vuln_ids
            from
              vulnerability as vuln
            group by
              vuln.remediation`)

  const updateQueries = remediationClusters.rows.reduce(
    (queries, row, index) => {
      const { vuln_ids } = row
      return (queries += `
    update vulnerability_asset
    set cluster_id = ${index + 1}
    where vulnerability_id in (${vuln_ids});
    `)
    },
    ''
  )

  // v_grouped_remediation
  await knex.raw(
    `CREATE OR REPLACE VIEW public.v_grouped_remediation AS
      SELECT
      vuln_asset.cluster_id AS cluster_id,
      vuln.remediation AS remediation,
      ast.company_id AS company_id,
      count(DISTINCT vuln.id)
    FROM
      public.vulnerability_asset vuln_asset
    INNER JOIN public.vulnerability vuln ON
      vuln_asset.vulnerability_id = vuln.id
    INNER JOIN public.asset ast ON
      ast.id = vuln_asset.asset_id
    GROUP BY
      (vuln_asset.cluster_id,
      vuln.remediation,
      ast.company_id)
    ORDER BY
      cluster_id ASC;`
  )

  // Run all update queries in one time:
  await knex.raw(updateQueries)

  await knex.raw('ALTER TABLE vulnerability DROP COLUMN cluster_id;')
}
