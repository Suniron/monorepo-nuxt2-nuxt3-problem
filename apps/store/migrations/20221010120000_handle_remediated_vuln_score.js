
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(`
CREATE OR REPLACE
VIEW public.v_asset_risk_scores
AS
SELECT
  ast.id AS asset_id,
  ast.name AS asset_name,
  ast.type AS asset_type,
  CASE
    WHEN max_cvss.score IS NULL
    AND last_scan.last_date IS NULL
    AND vuln_count.vuln_count > 0 THEN 0::double PRECISION
    WHEN max_cvss.score IS NULL
    AND last_scan.last_date IS NULL
    AND vuln_count.vuln_count = 0 THEN 10::double PRECISION
    WHEN max_cvss.score IS NULL
    AND last_scan.last_date IS NOT NULL THEN 0::double PRECISION
    ELSE max_cvss.score
  END AS inherent_score,
  CASE
    WHEN ast.type::TEXT <> ALL (ARRAY['NETWORK'::CHARACTER VARYING::TEXT,
    'BUILDING'::CHARACTER VARYING::TEXT,
    'USER_GROUP'::CHARACTER VARYING::TEXT,
    'UNIT'::CHARACTER VARYING::TEXT,
    'MISSION'::CHARACTER VARYING::TEXT]) THEN astsc.score
    ELSE NULL::REAL
  END AS inherited_score,
  CASE
    WHEN ast.type::TEXT = ANY (ARRAY['NETWORK'::CHARACTER VARYING::TEXT,
    'BUILDING'::CHARACTER VARYING::TEXT,
    'USER_GROUP'::CHARACTER VARYING::TEXT,
    'UNIT'::CHARACTER VARYING::TEXT,
    'MISSION'::CHARACTER VARYING::TEXT]) THEN astsc.score
    ELSE NULL::REAL
  END AS compound_score,
  last_scan.last_date AS last_scan_date,
  ast.company_id
FROM
  asset ast
LEFT JOIN score_asset astsc ON
  astsc.fk_asset_id = ast.id
  AND astsc.type = 'RISK'::"ScoreType"
JOIN (
  SELECT
    DISTINCT ast_1.id AS asset_id,
    count(vast.id) AS vuln_count
  FROM
    asset ast_1
  LEFT JOIN vulnerability_asset vast ON
    vast.asset_id = ast_1.id
  GROUP BY
    ast_1.id) vuln_count ON
  vuln_count.asset_id = ast.id
LEFT JOIN (
  SELECT
    DISTINCT scores.asset_id,
    max(scores.cvss_score) AS score
  FROM
    (
    SELECT
      vast.asset_id,
      CASE
        WHEN vast.cvss_id IS NULL
          AND vast.severity::TEXT = 'low'::TEXT THEN 2::double PRECISION
          WHEN vast.cvss_id IS NULL
          AND vast.severity::TEXT = 'medium'::TEXT THEN 5::double PRECISION
          WHEN vast.cvss_id IS NULL
          AND vast.severity::TEXT = 'high'::TEXT THEN 8::double PRECISION
          WHEN vast.cvss_id IS NULL
          AND vast.severity::TEXT = 'critical'::TEXT THEN 10::double PRECISION
          ELSE cvss.score
        END AS cvss_score
      FROM
        vulnerability_asset vast
      LEFT JOIN cvss cvss ON
        vast.cvss_id = cvss.id
      WHERE
        vast.status::TEXT <> 'remediated'::TEXT
        OR vast.status IS NULL) scores
  GROUP BY
    scores.asset_id) max_cvss ON
  max_cvss.asset_id = ast.id
LEFT JOIN (
  SELECT
    DISTINCT sca.asset_id,
    max(sc.sdate) AS last_date
  FROM
    scan_asset sca
  JOIN scan sc ON
    sc.id = sca.scan_id
  GROUP BY
    sca.asset_id) last_scan ON
  last_scan.asset_id = ast.id;`)
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw(
    `CREATE OR REPLACE VIEW public.v_asset_risk_scores AS
    SELECT
    ast.id AS asset_id,
    ast.name AS asset_name,
    ast.type AS asset_type,
    CASE
      WHEN max_cvss.score IS NULL AND last_scan.last_date IS NULL
      THEN 10
      ELSE max_cvss.score
    END AS inherent_score,
    CASE
      WHEN ast.type NOT IN ('NETWORK','BUILDING','USER_GROUP','UNIT','MISSION')
      THEN astsc.score 
      ELSE null
    END AS inherited_score,
    CASE
      WHEN ast.type IN ('NETWORK','BUILDING','USER_GROUP','UNIT','MISSION')
      THEN astsc.score 
      ELSE null
    END AS compound_score,
    last_scan.last_date AS last_scan_date,
    ast.company_id
  FROM
    public.asset AS ast
  LEFT JOIN 
    public.score_asset astsc ON
      astsc.fk_asset_id = ast.id AND
      astsc.type = 'RISK'
  LEFT JOIN (
    SELECT
      DISTINCT vast.asset_id,
      max(cvss.score) AS score
    FROM
      public.vulnerability_asset AS vast
    INNER JOIN public.cvss cvss ON
      vast.cvss_id = cvss.id
    WHERE
      vast.status NOT IN ('remediated')
        OR vast.status IS NULL
    GROUP BY
      vast.asset_id
  ) max_cvss ON
    max_cvss.asset_id = ast.id
  LEFT JOIN (
    SELECT
      DISTINCT sca.asset_id,
      max(sc.sdate) AS last_date
    FROM
      public.scan_asset sca
    INNER JOIN public.scan sc ON
      sc.id = sca.scan_id
    GROUP BY
      sca.asset_id
  ) last_scan ON
    last_scan.asset_id = ast.id
  ;`
  )
}
