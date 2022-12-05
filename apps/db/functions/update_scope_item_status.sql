CREATE OR REPLACE FUNCTION public.update_scope_item_status()
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
;