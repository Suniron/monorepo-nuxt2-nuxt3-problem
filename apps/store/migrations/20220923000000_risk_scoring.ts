// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  // NEW ENUM TYPE
  await knex.raw(`CREATE TYPE "ScoreType" AS ENUM ('RISK');`)

  // NEW TABLES
  await knex.raw(`CREATE TABLE score_asset (
    id SERIAL,
    fk_asset_id integer NOT NULL,
    type "ScoreType" NOT NULL,
    score float(8)
  );`)

  await knex.raw(`CREATE TABLE score_asset_history (
    id SERIAL,
    fk_asset_id integer NOT NULL,
    type "ScoreType" NOT NULL,
    score float(8),
    log_date date NOT NULL
  );`)

  // NEW VIEWS
  // v_asset_risk_scores.sql
  await knex.raw(
    `CREATE VIEW public.v_asset_risk_scores AS
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

  // CONSTRAINTS
  await knex.raw(
    'ALTER TABLE ONLY public.score_asset ADD CONSTRAINT score_asset_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.score_asset ADD CONSTRAINT score_asset_type_key UNIQUE (fk_asset_id, type);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.score_asset_history ADD CONSTRAINT score_asset_history_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.score_asset_history ADD CONSTRAINT score_asset_history_type_log_date_key UNIQUE (fk_asset_id, type, log_date);'
  )

  // FOREIGN KEYS
  await knex.raw(
    'ALTER TABLE ONLY public.score_asset ADD CONSTRAINT score_asset_fk_asset_id_fkey FOREIGN KEY (fk_asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.score_asset_history ADD CONSTRAINT score_asset_history_fk_asset_id_fkey FOREIGN KEY (fk_asset_id) REFERENCES public.asset(id) ON DELETE CASCADE;'
  )
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  // NEW ENUM TYPE
  await knex.raw('DROP TYPE IF EXISTS "ScoreType"')

  // NEW TABLES
  await knex.raw('DROP TABLE IF EXISTS score_asset CASCADE;')
  await knex.raw('DROP TABLE IF EXISTS score_asset_history CASCADE;')

  // NEW VIEWS
  await knex.raw('DROP VIEW IF EXISTS v_asset_risk_scores;')
}
