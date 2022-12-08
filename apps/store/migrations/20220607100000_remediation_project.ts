// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  // NEW TABLES
  await knex.raw(`CREATE TABLE project_priority (
    id integer UNIQUE
    , name varchar(255) NOT NULL UNIQUE
    , weight integer NOT NULL
    );`)
  await knex('project_priority').insert([
    { id: 1, name: 'low', weight: 1 },
    { id: 2, name: 'medium', weight: 2 },
    { id: 3, name: 'high', weight: 3 },
    { id: 4, name: 'critical', weight: 4 },
  ])
  await knex.raw(`CREATE TABLE project_status (
    id integer UNIQUE
    , name varchar(255) NOT NULL UNIQUE
    , weight integer NOT NULL
    );`)
  await knex('project_status').insert([
    { id: 1, name: 'open', weight: 1 },
    { id: 2, name: 'in_progress', weight: 2 },
    { id: 3, name: 'to_review', weight: 3 },
    { id: 4, name: 'completed', weight: 4 },
    { id: 5, name: 'canceled', weight: 5 },
  ])
  await knex.raw(`CREATE TABLE project_status_workflow (
    id serial
    , transition varchar(255) NOT NULL
    , fk_from_status_id integer NOT NULL
    , fk_to_status_id integer NOT NULL
    );`)
  await knex('project_status_workflow').insert([
    { id: 1, transition: 'start', fk_from_status_id: 1, fk_to_status_id: 2 },
    {
      id: 2,
      transition: 'send_for_review',
      fk_from_status_id: 2,
      fk_to_status_id: 3,
    },
    { id: 3, transition: 'accept', fk_from_status_id: 3, fk_to_status_id: 4 },
    { id: 4, transition: 'refuse', fk_from_status_id: 3, fk_to_status_id: 2 },
    { id: 5, transition: 'cancel', fk_from_status_id: 1, fk_to_status_id: 5 },
    { id: 6, transition: 'cancel', fk_from_status_id: 2, fk_to_status_id: 5 },
    { id: 7, transition: 'cancel', fk_from_status_id: 3, fk_to_status_id: 5 },
    { id: 8, transition: 're_open', fk_from_status_id: 4, fk_to_status_id: 1 },
    { id: 9, transition: 're_open', fk_from_status_id: 5, fk_to_status_id: 1 },
  ])
  await knex.raw(`CREATE TABLE remediation_project_status_history (
    id serial
    , fk_project_id integer NOT NULL
    , fk_user_id UUID NOT NULL
    , fk_status_id integer NOT NULL DEFAULT 1
    , start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    , end_date TIMESTAMP WITH TIME ZONE
    );`)
  await knex.raw(`CREATE TABLE remediation_project (
    id serial
    , fk_company_id integer NOT NULL
    , name varchar(255) NOT NULL
    , description varchar NOT NULL
    , fk_owner UUID NOT NULL
    , fk_priority_id integer NOT NULL
    , start_date TIMESTAMP WITH TIME ZONE
    , creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    , due_date TIMESTAMP WITH TIME ZONE NOT NULL
    );`)
  await knex.raw(`CREATE TABLE remediation_project_assignee (
      id serial
      , fk_project_id integer NOT NULL
      , fk_user_id UUID NOT NULL
    );`)
  await knex.raw(`CREATE TABLE remediation_project_scope (
      id serial
      , fk_project_id integer NOT NULL
      , fk_vulnerability_asset_id integer
      , deleted_asset_name varchar 
      , deleted_vulnerability_name varchar
      , is_done boolean NOT NULL DEFAULT false
    );`)
  await knex.raw(`CREATE TABLE comment_remediation_project (
      id serial
      , fk_remediation_project_id integer NOT NULL
      , fk_user_id UUID NOT NULL
      , fk_remediation_project_status_history_id integer
      , comment varchar NOT NULL
      , created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );`)
  // EXISTING TABLES MODIFIED
  await knex.raw(
    `ALTER TABLE vulnerability_asset ADD COLUMN cluster_id integer;`
  ) // add NOT NULL bellow
  // NEW VIEWS
  // v_project_summary_list
  await knex.raw(
    `CREATE view public.v_remediation_project_summary_list AS
    SELECT
      rmp_summary.project_id,
      rmp_summary.project_name,
      rmp_summary.owner_id,
      rmp_summary.owner_name,
      rmp_summary.priority,
      rmp_summary.priority_weight,
      CASE
        WHEN is_overdue THEN 'overdue'
        ELSE rmp_summary.status
      END AS status,
      CASE
        WHEN is_overdue THEN rmp_summary.max_status_weight + 1
        ELSE rmp_summary.status_weight
      END AS status_weight,
      rmp_summary.due_date,
      rmp_summary.is_overdue,
      rmp_summary.company_id
    FROM
      (
      SELECT
        rmp.id AS project_id,
        rmp.name AS project_name,
        rmp.fk_owner AS owner_id,
        usr.username AS owner_name,
        ppr.name AS priority,
        ppr.weight AS priority_weight,
        pst.name AS status,
        pst.weight AS status_weight,
        rmp.due_date AS due_date,
        EXTRACT(epoch
      FROM
        rmp.due_date - now()) < 0
        AND pst.name NOT IN ('completed', 'canceled') AS is_overdue,
        (SELECT MAX(weight) FROM public.project_status) AS max_status_weight,
        rmp.fk_company_id AS company_id
      FROM
        public.remediation_project rmp
      INNER JOIN public.user usr ON
        rmp.fk_owner = usr.id
      INNER JOIN public.project_priority ppr ON
        rmp.fk_priority_id = ppr.id
      INNER JOIN public.remediation_project_status_history psh ON
        rmp.id = psh.fk_project_id
        AND psh.end_date IS NULL
      INNER JOIN public.project_status pst ON
        pst.id = psh.fk_status_id
      ORDER BY
        rmp.due_date) AS rmp_summary;`
  )
  // v_remediation_project_details
  await knex.raw(
    `CREATE VIEW public.v_remediation_project_details
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
        rp.name,
        rp.description,
        u.id,
        u.username,
        pp.name,
        ps.name,
        ps.id,
        ps.weight,
        rp.creation_date,
        rp.start_date,
        rp.due_date;
  `
  )
  // v_asset_child
  await knex.raw(`
  CREATE VIEW public.v_asset_child AS
    SELECT
    parent_asset.id AS parent_id,
    parent_asset.name AS parent_name,
    parent_asset.type AS parent_type,
    child_asset.id AS child_id,
    child_asset.name AS child_name,
    child_asset.type AS child_type,
    parent_asset.company_id AS parent_company_id,
    child_asset.company_id AS child_company_id,
    parent_group.group_id AS parent_group_id,
    child_group.group_id AS child_group_id
  FROM
    public.relation AS rel
  INNER JOIN public.asset parent_asset ON
    rel.to_asset_id = parent_asset.id
  INNER JOIN public.asset child_asset ON
    rel.from_asset_id = child_asset.id
  LEFT JOIN public.group_asset parent_group ON
    parent_asset.id = parent_group.asset_id
  LEFT JOIN public.group_asset child_group ON
    child_asset.id = child_group.asset_id
  WHERE
    rel.type = 'BELONGS_TO';
  `)
  // v_grouped_remediation
  await knex.raw(
    `CREATE VIEW public.v_grouped_remediation AS
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

  // v_remediation_project_comment
  await knex.raw(`CREATE VIEW public.v_remediation_project_comment AS
  SELECT
    crp.fk_remediation_project_id AS project_id,
    crp.id AS comment_id,
    crp.created_at AS from_date,
    u.id AS user_id,
    u.username AS user_name,
    crp.COMMENT,
    ps2."name" AS from_status_name,
    ps."name" AS to_status_name
  FROM
    public.comment_remediation_project crp
  INNER JOIN public."user" u ON
    u.id = crp.fk_user_id
  LEFT JOIN public.remediation_project_status_history psh ON
    psh.id = crp.fk_remediation_project_status_history_id
  LEFT JOIN public.remediation_project_status_history psh2 ON
    psh.fk_project_id = psh2.fk_project_id
    AND psh.start_date = psh2.end_date
  LEFT JOIN public.project_status ps ON
    ps.id = psh.fk_status_id
  LEFT JOIN public.project_status ps2 ON
    ps2.id = psh2.fk_status_id
  ORDER BY
  from_date DESC`)

  // v_remediation_project_scope
  await knex.raw(`CREATE VIEW public.v_remediation_project_scope AS
  SELECT
    rps.fk_project_id AS project_id,
    rps.id AS project_scope_id,
    rps.fk_vulnerability_asset_id AS vulnerability_asset_id,
    a.id AS asset_id,
    a.type AS asset_type,
    CASE
      WHEN va.id IS NOT NULL 
    THEN a.name
      ELSE rps.deleted_asset_name
    END AS asset_name,
    v.id AS vulnerability_id,
    CASE
      WHEN va.id IS NOT NULL 
    THEN v.name
      ELSE rps.deleted_vulnerability_name
    END AS vulnerability_name,
    va.severity AS severity,
    v.remediation AS remediation,
    rps.is_done AS is_done
  FROM
    public.remediation_project_scope rps
  LEFT JOIN public.vulnerability_asset va ON
    rps.fk_vulnerability_asset_id = va.id
  LEFT JOIN public.asset a ON
    va.asset_id = a.id
  LEFT JOIN public.vulnerability v ON
    va.vulnerability_id = v.id`)

  // v_remediation_project_status_history
  await knex.raw(`CREATE VIEW public.v_remediation_project_status_history AS
  SELECT
    psh.fk_project_id AS project_id,
    psh.fk_user_id AS user_id,
    u.username AS user_name,
    psh.start_date AS from_date,
    ps2."name" AS from_status_name,
    ps."name" AS to_status_name,
    crp."comment" AS comment
  FROM
    public.remediation_project_status_history psh
  INNER JOIN public.user u ON
    u.id = psh.fk_user_id
  LEFT JOIN public.remediation_project_status_history psh2 ON
    psh.fk_project_id = psh2.fk_project_id
    AND psh.start_date = psh2.end_date
  LEFT JOIN public.project_status ps ON
    ps.id = psh.fk_status_id
  LEFT JOIN public.project_status ps2 ON
    ps2.id = psh2.fk_status_id
  LEFT JOIN public.comment_remediation_project crp ON
    crp.fk_remediation_project_status_history_id = psh.id
  ORDER BY
    from_date DESC`)

  // v_project_status_workflow
  await knex.raw(`CREATE VIEW public.v_project_status_workflow AS
  SELECT
    psw.id as project_status_workflow_id,
    psw.transition AS transition,
    psw.fk_from_status_id AS from_status_id,
    ps."name" AS from_status_name,
    psw.fk_to_status_id AS to_status_id,
    ps2."name" AS to_status_name
  FROM
    public.project_status_workflow psw
  JOIN public.project_status ps ON
    psw.fk_from_status_id = ps.id
  JOIN public.project_status ps2 ON
  psw.fk_to_status_id = ps2.id`)

  // UPDATE TABLES
  const remediationClusters = await knex.raw(`select
              array_agg(vuln.id) as vuln_ids
            from
              vulnerability as vuln
            group by
              vuln.remediation`)

  const updateQueries = remediationClusters.rows.reduce(
    (queries: any, row: any, index: any) => {
      const { vuln_ids } = row
      return (queries += `
    update vulnerability_asset
    set cluster_id = ${index + 1}
    where vulnerability_id in (${vuln_ids});
    `)
    },
    ''
  )

  // Run all update queries in one time:
  await knex.raw(updateQueries)
  // PRIMARY KEYS
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project ADD CONSTRAINT remediation_project_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_assignee ADD CONSTRAINT remediation_project_assignee_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.project_status ADD CONSTRAINT project_status_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.project_priority ADD CONSTRAINT project_priority_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.project_status_workflow ADD CONSTRAINT project_status_workflow_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_status_history ADD CONSTRAINT remediation_project_status_history_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_scope ADD CONSTRAINT remediation_project_scope_pkey PRIMARY KEY (id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.comment_remediation_project ADD CONSTRAINT comment_remediation_project_pkey PRIMARY KEY (id);'
  )
  // CONSTRAINTS
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_status_history ADD CONSTRAINT remediation_project_status_history_fk_project_id_fkey FOREIGN KEY (fk_project_id) REFERENCES public.remediation_project(id) ON DELETE CASCADE;'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_status_history ADD CONSTRAINT remediation_project_status_history_fk_user_id_fkey FOREIGN KEY (fk_user_id) REFERENCES public.user(id) ON DELETE SET NULL;'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_status_history ADD CONSTRAINT remediation_project_status_history_fk_status_id_fkey FOREIGN KEY (fk_status_id) REFERENCES public.project_status(id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.comment_remediation_project ADD CONSTRAINT fk_remediation_project_status_history_id_key UNIQUE (fk_remediation_project_status_history_id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.project_status_workflow ADD CONSTRAINT project_status_workflow_fk_from_status_id_fkey FOREIGN KEY (fk_from_status_id) REFERENCES public.project_status(id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.project_status_workflow ADD CONSTRAINT project_status_workflow_fk_to_status_id_fkey FOREIGN KEY (fk_to_status_id) REFERENCES public.project_status(id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.project_status_workflow ADD CONSTRAINT fk_from_status_id_fk_to_status_id_key UNIQUE (fk_from_status_id, fk_to_status_id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project ADD CONSTRAINT remediation_project_fk_company_id_fkey FOREIGN KEY (fk_company_id) REFERENCES public.company(id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project ADD CONSTRAINT remediation_project_fk_owner_fkey FOREIGN KEY (fk_owner) REFERENCES public.user(id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project ADD CONSTRAINT remediation_project_fk_priority_id_fkey FOREIGN KEY (fk_priority_id) REFERENCES public.project_priority(id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_assignee ADD CONSTRAINT remediation_project_assignee_fk_project_id_fkey FOREIGN KEY (fk_project_id) REFERENCES public.remediation_project(id) ON DELETE CASCADE;'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_assignee ADD CONSTRAINT remediation_project_assignee_fk_user_id_fkey FOREIGN KEY (fk_user_id) REFERENCES public.user(id) ON DELETE CASCADE;'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_assignee ADD CONSTRAINT fk_project_id_fk_user_id_key UNIQUE (fk_project_id, fk_user_id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_scope ADD CONSTRAINT remediation_project_scope_fk_project_id_fkey FOREIGN KEY (fk_project_id) REFERENCES public.remediation_project(id) ON DELETE CASCADE;'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_scope ADD CONSTRAINT remediation_project_scope_fk_vulnerability_asset_id_fkey FOREIGN KEY (fk_vulnerability_asset_id) REFERENCES public.vulnerability_asset(id) ON DELETE SET NULL;'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.remediation_project_scope ADD CONSTRAINT fk_project_id_fk_vulnerability_asset_id_key UNIQUE (fk_project_id, fk_vulnerability_asset_id);'
  )
  await knex.raw(
    `ALTER TABLE public.remediation_project_scope ADD CONSTRAINT remediation_project_scope_check CHECK (
      fk_vulnerability_asset_id IS NOT NULL 
      OR deleted_asset_name IS NOT NULL
    );`
  )
  await knex.raw(
    'ALTER TABLE ONLY public.comment_remediation_project ADD CONSTRAINT comment_remediation_project_fk_remediation_project_id_fkey FOREIGN KEY (fk_remediation_project_id) REFERENCES public.remediation_project(id) ON DELETE CASCADE;'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.comment_remediation_project ADD CONSTRAINT comment_remediation_project_fk_remediation_project_status_history_id_fkey FOREIGN KEY (fk_remediation_project_status_history_id) REFERENCES public.remediation_project_status_history(id);'
  )
  await knex.raw(
    'ALTER TABLE ONLY public.comment_remediation_project ADD CONSTRAINT comment_remediation_project_fk_user_id_fkey FOREIGN KEY (fk_user_id) REFERENCES public.user(id) ON DELETE SET NULL;'
  )
  // ADD EXTRA CONSTRAINTS
  await knex.raw(
    `ALTER TABLE vulnerability_asset ALTER COLUMN cluster_id SET NOT NULL;`
  )

  // FUNCTIONS

  await knex.raw(`CREATE OR REPLACE FUNCTION public.archive_asset_vuln_project_scope()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    declare
      asset_name varchar ;
      vuln_name varchar ;
    begin

      -- If executing on asset table
      if (TG_TABLE_NAME = 'asset') then

        select old.name
        into asset_name;
      
        update public.remediation_project_scope
        set deleted_asset_name = asset_name
        from vulnerability_asset va
        where va.asset_id = old.id
          and va.id = public.remediation_project_scope.fk_vulnerability_asset_id;

      end if;

      -- If executing on vulnerability_asset table
      if (TG_TABLE_NAME = 'vulnerability_asset') then
      
        select asset.name
        into asset_name
        from public.asset
        where old.asset_id = asset.id ;

        -- If the asset still exists after asset vulnerability deletion
        if (asset_name is not null) then
        
          select name
          into vuln_name
          from public.vulnerability
          where id = old.vulnerability_id;
          
          update public.remediation_project_scope
          set deleted_asset_name = asset_name,
            deleted_vulnerability_name = vuln_name
          where public.remediation_project_scope.fk_vulnerability_asset_id = old.id;
        end if;

      end if;

      return old;
    end;

    $function$
    ;`)

  // TRIGGERS

  await knex.raw(`create trigger archive_project_scope_before_asset_vuln_delete before delete
  on public.vulnerability_asset for each row execute function public.archive_asset_vuln_project_scope();`)

  await knex.raw(`create trigger archive_project_scope_before_asset_delete before delete
  on public.asset for each row execute function public.archive_asset_vuln_project_scope();`)
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex: any) => {
  // NEW TABLES
  await knex.raw('DROP TABLE IF EXISTS remediation_project CASCADE;')
  await knex.raw('DROP TABLE IF EXISTS remediation_project_assignee CASCADE;')
  await knex.raw('DROP TABLE IF EXISTS project_status CASCADE;')
  await knex.raw('DROP TABLE IF EXISTS project_priority CASCADE;')
  await knex.raw('DROP TABLE IF EXISTS project_status_workflow CASCADE;')
  await knex.raw(
    'DROP TABLE IF EXISTS remediation_project_status_history CASCADE;'
  )
  await knex.raw('DROP TABLE IF EXISTS remediation_project_scope CASCADE;')
  await knex.raw('DROP TABLE IF EXISTS comment_remediation_project CASCADE;')
  // NEW VIEWS
  await knex.raw('DROP VIEW IF EXISTS v_project_summary_list;')
  await knex.raw('DROP VIEW IF EXISTS v_asset_child;')
  await knex.raw('DROP VIEW IF EXISTS v_grouped_remediation;')
  await knex.raw('DROP VIEW IF EXISTS v_remediation_project_comment;')
  await knex.raw('DROP VIEW IF EXISTS v_remediation_project_scope;')
  await knex.raw('DROP VIEW IF EXISTS v_remediation_project_status_history;')
  await knex.raw('DROP VIEW IF EXISTS v_remediation_project_status_workflow;')

  // EXISTING TABLES MODIFIED
  await knex.raw('ALTER TABLE vulnerability_asset DROP COLUMN cluster_id;')

  // FUNCTIONS
  await knex.raw(
    'DROP FUNCTION IF EXISTS public.archive_asset_vuln_project_scope();'
  )

  // TRIGGERS
  await knex.raw(
    'DROP TRIGGER IF EXISTS archive_project_scope_before_asset_vuln_delete ON public.vulnerability_asset;'
  )
  await knex.raw(
    'DROP TRIGGER IF EXISTS archive_project_scope_before_asset_delete ON public.asset;'
  )
}
