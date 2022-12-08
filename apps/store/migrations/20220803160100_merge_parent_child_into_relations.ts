// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(`
    -- UPGRADE

    -- 1) Removing constraint for BMission -> BUnit old relation table
    alter table business_mission_unit_has_feared_event
      drop constraint fkey_business_mission_unit_id;
    
    -- Remove erroneous data before adding foreign key constraints
    -- (records were not deleted if a business mission or unit was deleted, since there was no constraints)
    delete
    from
      relation r
    where
      r.from_asset_id not in (
      select
        asset.id
      from
        asset)
      or r.to_asset_id not in (
      select
        asset.id
      from
        asset);
    
    -- 2) Add foreign keys for relation table
    alter table public.relation
      add constraint fk_from_asset_id foreign key (from_asset_id) references public.asset(id) on delete cascade,
      add constraint fk_to_asset_id foreign key (to_asset_id) references public.asset(id) on delete cascade;
    
    -- 3) Add relationships in relation table
    insert into relation (from_asset_id, to_asset_id, "type")
      select pc.child_id as from_asset_id, pc.parent_id as to_asset_id, 'BELONGS_TO' as type
      from public.parent_child pc;
    
    
    
    -- 4) Update the business missions' feared events table with the new relations IDs
    update
      public.business_mission_unit_has_feared_event src
    set
      business_mission_unit_id = r.id
    from
      relation r,
      business_mission_unit_has_feared_event bmufe
    inner join parent_child pc on bmufe.business_mission_unit_id = pc.id 
    where
      pc.child_id = r.from_asset_id
      and pc.parent_id = r.to_asset_id
      and r."type" = 'BELONGS_TO'
      and src.id = bmufe.id;
    
    
    -- 5) Removing old relation table
    drop table public.parent_child;
    
    -- 6) Adding constraint for BMission -> BUnit new relation table
    alter table business_mission_unit_has_feared_event
      add constraint fkey_business_mission_unit_id foreign key (business_mission_unit_id) references public.relation(id) on delete cascade;
    
    -- 7) Update v_asset_child view to add relation ID
    DROP VIEW public.v_asset_child;

    CREATE OR REPLACE VIEW public.v_asset_child
    AS
    SELECT
    rel.id as id,
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
    FROM relation rel
      JOIN asset parent_asset ON rel.to_asset_id = parent_asset.id
      JOIN asset child_asset ON rel.from_asset_id = child_asset.id
      LEFT JOIN group_asset parent_group ON parent_asset.id = parent_group.asset_id
      LEFT JOIN group_asset child_group ON child_asset.id = child_group.asset_id
    WHERE rel.type = 'BELONGS_TO';

    -- 8) Add relation unique constraint

    -- 8.1) Remove duplicated rows
    DELETE FROM relation
    WHERE id IN (
      SELECT id FROM (
        SELECT id, row_number() OVER (PARTITION BY from_asset_id, to_asset_id, "type" ORDER BY id) AS rn FROM relation
      ) t WHERE rn > 1
    );

    -- 8.2) Add unique constraint
    ALTER TABLE ONLY public.relation
      ADD CONSTRAINT relation_uniq UNIQUE ("type",from_asset_id,to_asset_id);
    `)
}

/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  await knex.raw(`
    -- DOWNGRADE

    -- 1) Update constraint for BMission -> BUnit old relation table
    alter table business_mission_unit_has_feared_event
      drop constraint fkey_business_mission_unit_id;
    
    -- 2) Remove foreign keys for relation table
    alter table public.relation 
      drop constraint fk_from_asset_id,
      drop constraint fk_to_asset_id;
    
    
    -- 3) Add relationships back in parent_child table
    
    -- 3.1) Creating the old table
    create table parent_child ( 
        id SERIAL unique,
        child_id INT not null,
        parent_id INT not null,
        score INTEGER,
        unique (parent_id,
    child_id)
    );
    
    -- 3.2) Adding the foreign keys
    alter table only public.parent_child
      add constraint fkey_parent_id foreign key (parent_id) references public.asset(id) on delete cascade,
      add constraint fkey_child_id foreign key (child_id) references public.asset(id) on delete cascade;
    
    -- 3.3) Inserting the data back in the old relationship table
    insert into public.parent_child (child_id, parent_id)
      select r.from_asset_id as child_id, r.to_asset_id as parent_id
      from public.relation r
      inner join asset a_from on a_from.id = r.from_asset_id and a_from."type" = 'UNIT' 
      inner join asset a_to on a_to.id = r.to_asset_id and a_to."type" = 'MISSION' 
      where r."type" = 'BELONGS_TO';
    
    
    -- 4) Update the business missions' feared events table with the old relations IDs
    update
      public.business_mission_unit_has_feared_event src
    set
      business_mission_unit_id = pc.id
    from
      parent_child pc,
      business_mission_unit_has_feared_event bmufe
    inner join relation r on bmufe.business_mission_unit_id = r.id 
    where
      pc.child_id = r.from_asset_id
      and pc.parent_id = r.to_asset_id
      and r."type" = 'BELONGS_TO'
      and src.id = bmufe.id;
    
    
    -- 5) Removing the new (post-rework) relationship recordsdelete
    delete
    from
      relation r
    where
      r.id in (
      select
        r.id
      from
        relation r
      inner join parent_child pc on
        pc.child_id = r.from_asset_id
        and pc.parent_id = r.to_asset_id
        and r."type" = 'BELONGS_TO');
    
    -- 6) Adding constraint for BMission -> BUnit new relation table
    alter table business_mission_unit_has_feared_event
      add constraint fkey_business_mission_unit_id foreign key (business_mission_unit_id) references public.parent_child(id) on delete cascade;

    -- 7) Update v_asset_child view to add relation ID
    DROP VIEW public.v_asset_child;

    CREATE OR REPLACE VIEW public.v_asset_child
    AS
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
    FROM relation rel
      JOIN asset parent_asset ON rel.to_asset_id = parent_asset.id
      JOIN asset child_asset ON rel.from_asset_id = child_asset.id
      LEFT JOIN group_asset parent_group ON parent_asset.id = parent_group.asset_id
      LEFT JOIN group_asset child_group ON child_asset.id = child_group.asset_id
    WHERE rel.type = 'BELONGS_TO';

    -- 8) Remove relation unique constraint
    ALTER TABLE ONLY public.relation
      DROP CONSTRAINT relation_uniq;
    `)
}
