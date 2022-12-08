// @ts-check
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex: any) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }
  // FUNCTIONS
  await knex.raw(`CREATE OR REPLACE FUNCTION public.update_vulnerability_asset_status()
    RETURNS trigger
    LANGUAGE plpgsql
  AS $function$
  begin
  
    UPDATE
    public.vulnerability_asset vast
  SET
    status = 'remediated'
  FROM
    public.remediation_project_scope rps
  WHERE
    rps.fk_project_id = new.fk_project_id
    AND rps.fk_vulnerability_asset_id = vast.id
    AND rps.is_done IS TRUE
    ;
    
    return new;
  end;
  
  $function$
  ;`)

  await knex.raw(`CREATE OR REPLACE FUNCTION public.update_scope_item_status()
    RETURNS trigger
    LANGUAGE plpgsql
  AS $function$
  begin
  
    if new.status = 'remediated' then
      update public.remediation_project_scope
      set is_done = true
      where fk_vulnerability_asset_id = new.id and is_done is not true;
    end if;
  
    if old.status = 'remediated' then
      update public.remediation_project_scope
      set is_done = false
      where fk_vulnerability_asset_id = new.id and is_done is true;
    end if;
    
    return new;
  end;
  
  $function$
  ;`)

  // TRIGGERS

  await knex.raw(`CREATE TRIGGER update_vulnerability_asset_status 
      AFTER 
    INSERT 
      ON
      public.remediation_project_status_history
      FOR EACH ROW
      WHEN (NEW.fk_status_id = 4)
      EXECUTE PROCEDURE public.update_vulnerability_asset_status();`)

  await knex.raw(`CREATE TRIGGER update_scope_item_status 
    AFTER
  UPDATE
    ON
    public.vulnerability_asset
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status
      AND (OLD.status = 'remediated'
        OR NEW.status = 'remediated'))
    EXECUTE PROCEDURE public.update_scope_item_status();`)
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex: any) => {
  // FUNCTIONS
  await knex.raw(
    'DROP FUNCTION IF EXISTS public.update_vulnerability_asset_status();'
  )

  await knex.raw('DROP FUNCTION IF EXISTS public.update_scope_item_status();')

  // TRIGGERS
  await knex.raw(
    'DROP TRIGGER IF EXISTS update_vulnerability_asset_status ON public.remediation_project_status_history;'
  )
  await knex.raw(
    'DROP TRIGGER IF EXISTS update_scope_item_status ON public.vulnerability_asset;'
  )
}
